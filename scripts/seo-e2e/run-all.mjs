#!/usr/bin/env node
/**
 * Main CLI runner for Divinity Cosmetics SEO/AEO E2E Verification Suite.
 *
 * Flags:
 *   --self-test           Run deterministic unit tests against parsers & validators
 *   --static              Run repo/static checks (Tiers 1, 2, 3) without starting Next.js
 *   --live                Build (unless --skip-build) & start Next.js, run live HTTP Tiers 1, 2, 4
 *   --all                 Run both --static and --live (default when no mode flag is passed)
 *   --skip-build          Skip `prisma generate` + `next build` when running --live
 *   --url=<baseUrl>       Target an already-running server instead of spawning `next start`
 *   --tier=1,2,3,4        Comma-separated tier filter (default: 1,2,3,4)
 *   --base=<gitRef>       Baseline git ref for Tier 3 diff guard (default: HEAD)
 *   --json-out=<path>     Write machine-readable JSON test report
 */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTION_ORIGIN, TestCollector, fetchWithTimeout } from "./lib/assertions.mjs";
import { runSelfTests } from "./self-test.mjs";
import { runTier1Live, runTier1Static } from "./tier1-technical.mjs";
import { runTier2Live, runTier2Static } from "./tier2-ssr-assets.mjs";
import { runTier3Static } from "./tier3-scope-docs.mjs";
import { runTier4Live } from "./tier4-journeys.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const opts = {
    selfTest: false,
    staticOnly: false,
    liveOnly: false,
    all: false,
    skipBuild: false,
    url: null,
    tiers: new Set([1, 2, 3, 4]),
    baseRef: "HEAD",
    jsonOut: null,
  };

  for (const arg of argv) {
    if (arg === "--self-test") opts.selfTest = true;
    else if (arg === "--static") opts.staticOnly = true;
    else if (arg === "--live") opts.liveOnly = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--skip-build") opts.skipBuild = true;
    else if (arg.startsWith("--url=")) opts.url = arg.slice(6).replace(/\/+$/, "");
    else if (arg.startsWith("--base=")) opts.baseRef = arg.slice(7);
    else if (arg.startsWith("--json-out=")) opts.jsonOut = arg.slice(11);
    else if (arg.startsWith("--tier=")) {
      const nums = arg
        .slice(7)
        .split(",")
        .map((n) => Number.parseInt(n.trim(), 10))
        .filter((n) => [1, 2, 3, 4].includes(n));
      if (nums.length > 0) opts.tiers = new Set(nums);
    } else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scripts/seo-e2e/run-all.mjs [--self-test | --static | --live | --all] [--skip-build] [--url=<baseUrl>] [--tier=1,2,3,4] [--base=<gitRef>] [--json-out=<path>]"
      );
      process.exit(0);
    }
  }

  if (!opts.selfTest && !opts.staticOnly && !opts.liveOnly) {
    opts.all = true;
  }
  return opts;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      srv.close(() => resolve(port));
    });
  });
}

function killProcessTree(child) {
  if (!child || !child.pid) return;
  try {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } else {
      child.kill("SIGTERM");
    }
  } catch {
    // ignore cleanup errors
  }
}

function runProductionBuild(collector) {
  const buildEnv = {
    ...process.env,
    NEXT_PUBLIC_APP_URL: PRODUCTION_ORIGIN,
  };

  // 1. prisma generate
  const prismaBin = require.resolve("prisma/build/index.js", { paths: [REPO_ROOT] });
  const prismaRes = spawnSync(process.execPath, [prismaBin, "generate"], {
    cwd: REPO_ROOT,
    env: buildEnv,
    encoding: "utf8",
  });
  collector.assert(
    "T1.BUILD.PRISMA_GENERATE",
    "Tier 1",
    "Prisma client generation (prisma generate)",
    prismaRes.status === 0,
    "prisma generate exited 0",
    `prisma generate exited ${prismaRes.status}: ${(prismaRes.stderr || prismaRes.stdout || "").trim().slice(0, 400)}`
  );
  if (prismaRes.status !== 0) return false;

  // 2. next build with NEXT_PUBLIC_APP_URL=https://shopdivinitycosmetics.co.za
  const nextBin = require.resolve("next/dist/bin/next", { paths: [REPO_ROOT] });
  const buildRes = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: REPO_ROOT,
    env: buildEnv,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  collector.assert(
    "T1.BUILD.NEXT_BUILD",
    "Tier 1",
    `Production Next.js build (NEXT_PUBLIC_APP_URL=${PRODUCTION_ORIGIN})`,
    buildRes.status === 0,
    "next build exited 0",
    `next build exited ${buildRes.status}: ${(buildRes.stderr || buildRes.stdout || "").trim().slice(-600)}`
  );
  return buildRes.status === 0;
}

async function startNextServer(port) {
  const nextBin = require.resolve("next/dist/bin/next", { paths: [REPO_ROOT] });
  const serverEnv = {
    ...process.env,
    NEXT_PUBLIC_APP_URL: PRODUCTION_ORIGIN,
  };
  const logs = [];
  const child = spawn(
    process.execPath,
    [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: REPO_ROOT,
      env: serverEnv,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  child.stdout?.on("data", (d) => logs.push(d.toString()));
  child.stderr?.on("data", (d) => logs.push(d.toString()));

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `next start exited early (${child.exitCode}): ${logs.join("").slice(-600)}`
      );
    }
    try {
      const res = await fetchWithTimeout(`${baseUrl}/robots.txt`, {}, 2000);
      if (res.status > 0) {
        return { child, baseUrl };
      }
    } catch {
      // wait and retry
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  killProcessTree(child);
  throw new Error(`Timed out waiting for next start on ${baseUrl}. Logs: ${logs.join("").slice(-600)}`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.selfTest) {
    const code = await runSelfTests(REPO_ROOT);
    process.exit(code);
  }

  const collector = new TestCollector();
  const runStatic = opts.all || opts.staticOnly;
  const runLive = opts.all || opts.liveOnly;

  if (runStatic) {
    if (opts.tiers.has(1)) await runTier1Static(REPO_ROOT, collector);
    if (opts.tiers.has(2)) await runTier2Static(REPO_ROOT, collector);
    if (opts.tiers.has(3)) await runTier3Static(REPO_ROOT, collector, { baseRef: opts.baseRef });
  }

  if (runLive) {
    let buildOk = true;
    if (!opts.url && !opts.skipBuild) {
      buildOk = runProductionBuild(collector);
    }

    if (buildOk) {
      let serverChild = null;
      let targetUrl = opts.url;
      const onSignal = () => {
        killProcessTree(serverChild);
        process.exit(1);
      };
      process.on("SIGINT", onSignal);
      process.on("SIGTERM", onSignal);

      try {
        if (!targetUrl) {
          const port = await getFreePort();
          const started = await startNextServer(port);
          serverChild = started.child;
          targetUrl = started.baseUrl;
          console.log(`[seo-e2e] Started next start at ${targetUrl} (PID ${serverChild.pid})`);
        }

        if (opts.tiers.has(1)) await runTier1Live(targetUrl, collector);
        if (opts.tiers.has(2)) await runTier2Live(targetUrl, collector);
        if (opts.tiers.has(4)) await runTier4Live(targetUrl, collector);
      } finally {
        process.off("SIGINT", onSignal);
        process.off("SIGTERM", onSignal);
        if (serverChild) {
          killProcessTree(serverChild);
          console.log(`[seo-e2e] Terminated next start server (PID ${serverChild.pid})`);
        }
      }
    }
  }

  console.log(collector.formatReport());

  if (opts.jsonOut) {
    const outPath = path.isAbsolute(opts.jsonOut)
      ? opts.jsonOut
      : path.join(REPO_ROOT, opts.jsonOut);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(collector.toJSON(), null, 2), "utf8");
    console.log(`\n[seo-e2e] JSON report written to ${outPath}`);
  }

  const { counts } = collector.getSummary();
  process.exit(counts.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("[seo-e2e] Fatal error:", err);
  process.exit(1);
});
