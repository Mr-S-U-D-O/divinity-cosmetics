/**
 * Zero-dependency HTML, JSON-LD, XML Sitemap, robots.txt, and binary image
 * header parsers (PNG, JPEG, WEBP) for Divinity Cosmetics SEO/AEO E2E suite.
 */

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  hellip: "…",
  copy: "©",
  reg: "®",
  trade: "™",
  times: "×",
  middot: "·",
  bull: "•",
  rarr: "→",
  larr: "←",
  harr: "↔",
  ge: "≥",
  le: "≤",
};

export function decodeHtmlEntities(input) {
  if (!input || typeof input !== "string") return "";
  return input.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z0-9]+);/g, (full, entity) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, entity)
      ? NAMED_ENTITIES[entity]
      : full;
  });
}

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title"]);

const BLOCK_BOUNDARY_TAGS = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "br",
  "dd",
  "details",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "summary",
  "table",
  "td",
  "th",
  "tr",
  "ul",
]);

function parseAttributes(attrString) {
  const attrs = {};
  let i = 0;
  const len = attrString.length;

  while (i < len) {
    while (i < len && /\s/.test(attrString[i])) i++;
    if (i >= len) break;
    if (attrString[i] === "/") {
      i++;
      continue;
    }

    const nameStart = i;
    while (i < len && !/[\s=/>]/.test(attrString[i])) i++;
    const name = attrString.slice(nameStart, i).toLowerCase();
    if (!name) {
      i++;
      continue;
    }

    while (i < len && /\s/.test(attrString[i])) i++;
    let value = "";
    if (i < len && attrString[i] === "=") {
      i++;
      while (i < len && /\s/.test(attrString[i])) i++;
      if (i < len && (attrString[i] === '"' || attrString[i] === "'")) {
        const quote = attrString[i++];
        const valStart = i;
        while (i < len && attrString[i] !== quote) i++;
        value = decodeHtmlEntities(attrString.slice(valStart, i));
        if (i < len && attrString[i] === quote) i++;
      } else {
        const valStart = i;
        while (i < len && !/[\s>]/.test(attrString[i])) i++;
        value = decodeHtmlEntities(attrString.slice(valStart, i));
      }
    }
    if (!Object.prototype.hasOwnProperty.call(attrs, name)) {
      attrs[name] = value;
    }
  }

  return attrs;
}

/**
 * Find the closing `>` of a tag starting at `<` (index `start`), respecting quoted attribute values.
 */
function findTagEnd(html, start) {
  let quote = null;
  for (let i = start + 1; i < html.length; i++) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return i;
    }
  }
  return -1;
}

/**
 * Genuine HTML tokenizer + lightweight DOM tree builder.
 */
export function parseHtml(html) {
  const source = typeof html === "string" ? html : "";
  const root = { tag: "#root", attrs: {}, children: [], parent: null };
  const stack = [root];
  let i = 0;

  while (i < source.length) {
    const lt = source.indexOf("<", i);
    if (lt === -1) {
      const text = source.slice(i);
      if (text) {
        stack[stack.length - 1].children.push({ type: "text", text });
      }
      break;
    }

    if (lt > i) {
      stack[stack.length - 1].children.push({
        type: "text",
        text: source.slice(i, lt),
      });
    }

    // HTML comment
    if (source.startsWith("<!--", lt)) {
      const endComment = source.indexOf("-->", lt + 4);
      i = endComment === -1 ? source.length : endComment + 3;
      continue;
    }

    // DOCTYPE or processing instruction
    if (source.startsWith("<!", lt) || source.startsWith("<?", lt)) {
      const endDecl = source.indexOf(">", lt + 2);
      i = endDecl === -1 ? source.length : endDecl + 1;
      continue;
    }

    // Closing tag
    if (source[lt + 1] === "/") {
      const gt = source.indexOf(">", lt + 2);
      if (gt === -1) break;
      const closeTag = source.slice(lt + 2, gt).trim().toLowerCase();
      for (let s = stack.length - 1; s >= 1; s--) {
        if (stack[s].tag === closeTag) {
          stack.length = s;
          break;
        }
      }
      i = gt + 1;
      continue;
    }

    // Opening tag
    const gt = findTagEnd(source, lt);
    if (gt === -1) {
      stack[stack.length - 1].children.push({ type: "text", text: source.slice(lt) });
      break;
    }

    const inner = source.slice(lt + 1, gt);
    const match = /^([a-zA-Z][a-zA-Z0-9:-]*)([\s\S]*)$/.exec(inner);
    if (!match) {
      stack[stack.length - 1].children.push({ type: "text", text: "<" });
      i = lt + 1;
      continue;
    }

    const tag = match[1].toLowerCase();
    const rest = match[2];
    const selfClosing = /\/\s*$/.test(rest) || VOID_TAGS.has(tag);
    const attrs = parseAttributes(rest);
    const parent = stack[stack.length - 1];
    const node = { type: "element", tag, attrs, children: [], parent };
    parent.children.push(node);

    if (RAW_TEXT_TAGS.has(tag) && !selfClosing) {
      const closeRe = new RegExp(`</${tag}\\s*>`, "i");
      const tail = source.slice(gt + 1);
      const closeMatch = closeRe.exec(tail);
      if (closeMatch) {
        const rawText = tail.slice(0, closeMatch.index);
        if (rawText) {
          node.children.push({ type: "text", text: rawText, raw: true });
        }
        i = gt + 1 + closeMatch.index + closeMatch[0].length;
      } else {
        const rawText = tail;
        if (rawText) {
          node.children.push({ type: "text", text: rawText, raw: true });
        }
        i = source.length;
      }
      continue;
    }

    if (!selfClosing) {
      stack.push(node);
    }
    i = gt + 1;
  }

  return extractDocumentView(root);
}

function getRawText(node) {
  let out = "";
  for (const child of node.children || []) {
    if (child.type === "text") {
      out += child.text;
    } else if (child.type === "element") {
      out += getRawText(child);
    }
  }
  return out;
}

function getVisibleText(node, skipHiddenTags = true) {
  if (!node) return "";
  if (node.type === "text") {
    return decodeHtmlEntities(node.text);
  }
  if (node.type !== "element" && node.tag !== "#root") return "";
  if (
    skipHiddenTags &&
    (node.tag === "script" ||
      node.tag === "style" ||
      node.tag === "noscript" ||
      node.tag === "template")
  ) {
    return "";
  }
  const parts = [];
  for (const child of node.children || []) {
    parts.push(getVisibleText(child, skipHiddenTags));
  }
  const joined = parts.join(" ");
  return BLOCK_BOUNDARY_TAGS.has(node.tag) ? ` ${joined} ` : joined;
}

function hasAncestor(node, predicate) {
  let cur = node.parent;
  while (cur && cur.tag !== "#root") {
    if (predicate(cur)) return true;
    cur = cur.parent;
  }
  return false;
}

function hasDescendantTag(node, tagName) {
  for (const child of node.children || []) {
    if (child.type === "element") {
      if (child.tag === tagName || hasDescendantTag(child, tagName)) {
        return true;
      }
    }
  }
  return false;
}

function extractDocumentView(root) {
  let title = "";
  const metas = [];
  const links = [];
  const headings = [];
  const images = [];
  const anchors = [];
  const jsonLdScripts = [];

  function walk(node, inHead = false, inBody = false) {
    if (node.type === "element") {
      const tag = node.tag;
      const nowInHead = inHead || tag === "head";
      const nowInBody = inBody || tag === "body";

      if (tag === "title" && nowInHead && !title) {
        title = decodeHtmlEntities(getRawText(node)).replace(/\s+/g, " ").trim();
      } else if (tag === "meta") {
        metas.push({ ...node.attrs, inHead: nowInHead });
      } else if (tag === "link") {
        links.push({ ...node.attrs, inHead: nowInHead });
      } else if (/^h[1-6]$/.test(tag)) {
        const level = Number.parseInt(tag[1], 10);
        const text = getVisibleText(node).replace(/\s+/g, " ").trim();
        const ariaHidden =
          node.attrs["aria-hidden"] === "true" ||
          hasAncestor(node, (p) => p.attrs["aria-hidden"] === "true");
        headings.push({
          tag,
          level,
          text,
          ariaHidden,
          hasImgDescendant: hasDescendantTag(node, "img"),
        });
      } else if (tag === "img") {
        const hasAltAttr = Object.prototype.hasOwnProperty.call(node.attrs, "alt");
        const alt = hasAltAttr ? node.attrs.alt : "";
        const selfAriaHidden = node.attrs["aria-hidden"] === "true";
        const ancestorAriaHidden = hasAncestor(
          node,
          (p) => p.attrs["aria-hidden"] === "true"
        );
        const insideTabWithAriaLabel = hasAncestor(
          node,
          (p) =>
            p.tag === "button" &&
            p.attrs.role === "tab" &&
            typeof p.attrs["aria-label"] === "string" &&
            p.attrs["aria-label"].trim().length > 0
        );
        images.push({
          src: node.attrs.src || "",
          alt,
          hasAltAttr,
          ariaHidden: selfAriaHidden,
          ancestorAriaHidden,
          insideAriaHidden: selfAriaHidden || ancestorAriaHidden,
          insideTabWithAriaLabel,
          inBody: nowInBody,
        });
      } else if (tag === "a") {
        anchors.push({
          href: node.attrs.href || "",
          text: getVisibleText(node).replace(/\s+/g, " ").trim(),
          ariaLabel: node.attrs["aria-label"] || "",
        });
      } else if (
        tag === "script" &&
        (node.attrs.type || "").toLowerCase().split(";")[0].trim() === "application/ld+json"
      ) {
        jsonLdScripts.push(getRawText(node));
      }

      for (const child of node.children || []) {
        walk(child, nowInHead, nowInBody);
      }
      return;
    }

    for (const child of node.children || []) {
      walk(child, inHead, inBody);
    }
  }

  walk(root);

  const visibleText = getVisibleText(root).replace(/\s+/g, " ").trim();

  const metaByName = {};
  const metaByProperty = {};
  for (const m of metas) {
    if (m.name && !Object.prototype.hasOwnProperty.call(metaByName, m.name.toLowerCase())) {
      metaByName[m.name.toLowerCase()] = m.content ?? "";
    }
    if (
      m.property &&
      !Object.prototype.hasOwnProperty.call(metaByProperty, m.property.toLowerCase())
    ) {
      metaByProperty[m.property.toLowerCase()] = m.content ?? "";
    }
  }

  const canonicalLinks = links.filter((l) =>
    (l.rel || "")
      .toLowerCase()
      .split(/\s+/)
      .includes("canonical")
  );

  const alternateLinks = links.filter((l) =>
    (l.rel || "")
      .toLowerCase()
      .split(/\s+/)
      .includes("alternate")
  );

  const iconLinks = links.filter((l) => {
    const rels = (l.rel || "").toLowerCase().split(/\s+/);
    return rels.includes("icon") || rels.includes("apple-touch-icon");
  });

  return {
    root,
    title,
    metas,
    metaByName,
    metaByProperty,
    links,
    canonicalLinks,
    alternateLinks,
    iconLinks,
    headings,
    images,
    anchors,
    jsonLdScripts,
    visibleText,
  };
}

/**
 * Parse and validate all <script type="application/ld+json"> blocks from HTML or parsed doc.
 * Checks for raw unescaped `<` inside JSON-LD raw text and catches JSON.parse errors.
 */
export function parseJsonLdScripts(htmlOrDoc) {
  const scripts =
    typeof htmlOrDoc === "string"
      ? parseHtml(htmlOrDoc).jsonLdScripts
      : htmlOrDoc.jsonLdScripts || [];

  return scripts.map((rawText, index) => {
    const trimmed = (rawText || "").trim();
    const hasRawUnescapedLt = trimmed.includes("<");
    if (!trimmed) {
      return {
        index,
        rawText,
        valid: false,
        hasRawUnescapedLt,
        error: "Empty JSON-LD script block",
        data: null,
        nodes: [],
      };
    }
    try {
      const data = JSON.parse(trimmed);
      const nodes = flattenJsonLdNodes(data);
      return {
        index,
        rawText,
        valid: !hasRawUnescapedLt,
        hasRawUnescapedLt,
        error: hasRawUnescapedLt
          ? "Raw unescaped '<' found inside JSON-LD script block (use \\u003c)"
          : null,
        data,
        nodes,
      };
    } catch (err) {
      return {
        index,
        rawText,
        valid: false,
        hasRawUnescapedLt,
        error: `JSON.parse error: ${err.message}`,
        data: null,
        nodes: [],
      };
    }
  });
}

export function flattenJsonLdNodes(data) {
  const out = [];
  function visit(item) {
    if (!item || typeof item !== "object") return;
    if (Array.isArray(item)) {
      for (const el of item) visit(el);
      return;
    }
    if (item["@type"]) {
      out.push(item);
    }
    if (Array.isArray(item["@graph"])) {
      for (const g of item["@graph"]) visit(g);
    }
  }
  visit(data);
  return out;
}

export function nodeHasType(node, expectedType) {
  if (!node || !node["@type"]) return false;
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  return types.includes(expectedType);
}

/**
 * Genuine binary image header parser for PNG, JPEG, and WEBP.
 */
export function parseImageDimensions(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  if (buf.length < 12) {
    return { format: "unknown", width: 0, height: 0, error: "Buffer too short" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A + IHDR
  if (
    buf.length >= 24 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a &&
    buf.toString("ascii", 12, 16) === "IHDR"
  ) {
    return {
      format: "png",
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
      error: null,
    };
  }

  // WEBP: RIFF....WEBP
  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X" && buf.length >= 30) {
      const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { format: "webp", variant: "VP8X", width, height, error: null };
    }
    if (chunk === "VP8 " && buf.length >= 30) {
      if (buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
        const width = buf.readUInt16LE(26) & 0x3fff;
        const height = buf.readUInt16LE(28) & 0x3fff;
        return { format: "webp", variant: "VP8", width, height, error: null };
      }
      return { format: "webp", width: 0, height: 0, error: "Invalid VP8 keyframe signature" };
    }
    if (chunk === "VP8L" && buf.length >= 25) {
      if (buf[20] === 0x2f) {
        const bits = buf.readUInt32LE(21);
        const width = (bits & 0x3fff) + 1;
        const height = ((bits >> 14) & 0x3fff) + 1;
        return { format: "webp", variant: "VP8L", width, height, error: null };
      }
      return { format: "webp", width: 0, height: 0, error: "Invalid VP8L signature" };
    }
    return { format: "webp", width: 0, height: 0, error: `Unsupported WEBP chunk: ${chunk}` };
  }

  // JPEG: FF D8
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 1 < buf.length) {
      while (offset < buf.length && buf[offset] === 0xff) offset++;
      if (offset >= buf.length) break;
      const marker = buf[offset++];

      // Standalone markers without length
      if (marker === 0x00 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
        if (marker === 0xd9) break; // EOI
        continue;
      }

      if (offset + 1 >= buf.length) break;
      const segLen = buf.readUInt16BE(offset);
      if (segLen < 2 || offset + segLen > buf.length) {
        return { format: "jpeg", width: 0, height: 0, error: "Corrupt JPEG segment length" };
      }

      // SOF markers (baseline, extended, progressive, lossless, etc.)
      const isSof =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isSof && segLen >= 7) {
        const height = buf.readUInt16BE(offset + 3);
        const width = buf.readUInt16BE(offset + 5);
        return { format: "jpeg", marker: `0x${marker.toString(16)}`, width, height, error: null };
      }

      offset += segLen;
    }
    return { format: "jpeg", width: 0, height: 0, error: "No SOF marker found in JPEG" };
  }

  return { format: "unknown", width: 0, height: 0, error: "Unrecognized image header" };
}

/**
 * Genuine XML Sitemap parser (<urlset> -> <url> -> <loc>, <lastmod>, etc.)
 * Validates XML tag balance and extracts entries.
 */
export function parseSitemapXml(xml) {
  const src = typeof xml === "string" ? xml.trim() : "";
  if (!src) {
    return { valid: false, error: "Empty XML document", urls: [] };
  }

  const stripped = src.replace(/<\?[\s\S]*?\?>/g, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!/<urlset[\s>]/i.test(stripped) || !/<\/urlset\s*>/i.test(stripped)) {
    return { valid: false, error: "Missing <urlset> root element", urls: [] };
  }

  // Validate balanced XML tags
  const stack = [];
  const tagRe = /<\/?([a-zA-Z0-9:_-]+)([^>]*)>/g;
  let m;
  while ((m = tagRe.exec(stripped)) !== null) {
    const full = m[0];
    const tagName = m[1];
    if (full.startsWith("</")) {
      const top = stack.pop();
      if (top !== tagName) {
        return {
          valid: false,
          error: `Mismatched XML closing tag </${tagName}> (expected </${top || "EOF"}>)`,
          urls: [],
        };
      }
    } else if (!full.endsWith("/>")) {
      stack.push(tagName);
    }
  }
  if (stack.length > 0) {
    return {
      valid: false,
      error: `Unclosed XML tag(s): ${stack.join(", ")}`,
      urls: [],
    };
  }

  const urls = [];
  const urlBlockRe = /<url\b[^>]*>([\s\S]*?)<\/url>/gi;
  let urlMatch;
  while ((urlMatch = urlBlockRe.exec(stripped)) !== null) {
    const block = urlMatch[1];
    const locMatch = /<loc\b[^>]*>([\s\S]*?)<\/loc>/i.exec(block);
    const lastmodMatch = /<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/i.exec(block);
    const changefreqMatch = /<changefreq\b[^>]*>([\s\S]*?)<\/changefreq>/i.exec(block);
    const priorityMatch = /<priority\b[^>]*>([\s\S]*?)<\/priority>/i.exec(block);
    const images = [];
    const imgRe = /<image:loc\b[^>]*>([\s\S]*?)<\/image:loc>/gi;
    let imgM;
    while ((imgM = imgRe.exec(block)) !== null) {
      images.push(decodeHtmlEntities(imgM[1].trim()));
    }
    if (locMatch) {
      urls.push({
        loc: decodeHtmlEntities(locMatch[1].trim()),
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : null,
        changefreq: changefreqMatch ? changefreqMatch[1].trim() : null,
        priority: priorityMatch ? priorityMatch[1].trim() : null,
        images,
      });
    }
  }

  return {
    valid: urls.length > 0,
    error: urls.length === 0 ? "No <url><loc> entries found" : null,
    urls,
  };
}

/**
 * Genuine robots.txt directive parser supporting RFC 9309 grouped User-agent blocks.
 */
export function parseRobotsTxt(text) {
  const lines = (typeof text === "string" ? text : "").split(/\r?\n/);
  const groups = [];
  const sitemaps = [];
  const hosts = [];

  let currentAgents = [];
  let currentRules = [];
  let sawRuleInGroup = false;

  function flushGroup() {
    if (currentAgents.length > 0) {
      groups.push({
        userAgents: [...currentAgents],
        rules: [...currentRules],
      });
    }
    currentAgents = [];
    currentRules = [];
    sawRuleInGroup = false;
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const val = line.slice(colon + 1).trim();

    if (key === "user-agent") {
      if (sawRuleInGroup) {
        flushGroup();
      }
      currentAgents.push(val);
    } else if (key === "allow" || key === "disallow") {
      sawRuleInGroup = true;
      currentRules.push({ type: key, path: val });
    } else if (key === "sitemap") {
      sitemaps.push(val);
    } else if (key === "host") {
      hosts.push(val);
    }
  }
  flushGroup();

  return { groups, sitemaps, hosts };
}

function robotsRuleMatches(pattern, path) {
  if (pattern === "") return false;
  let regexStr = "^";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "*") {
      regexStr += ".*";
    } else if (ch === "$" && i === pattern.length - 1) {
      regexStr += "$";
    } else {
      regexStr += ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(regexStr).test(path);
}

/**
 * Evaluate RFC 9309 allow/disallow decision for a specific User-agent and path.
 */
export function isRobotsPathAllowed(parsedRobots, userAgent, path) {
  const targetUa = userAgent.toLowerCase();
  const specificGroups = parsedRobots.groups.filter((g) =>
    g.userAgents.some((ua) => ua.toLowerCase() === targetUa)
  );
  const matchingGroups =
    specificGroups.length > 0
      ? specificGroups
      : parsedRobots.groups.filter((g) => g.userAgents.some((ua) => ua === "*"));

  if (matchingGroups.length === 0) return true;

  let bestRule = null;
  for (const group of matchingGroups) {
    for (const rule of group.rules) {
      if (!rule.path) continue;
      if (robotsRuleMatches(rule.path, path)) {
        if (
          !bestRule ||
          rule.path.length > bestRule.path.length ||
          (rule.path.length === bestRule.path.length && rule.type === "allow")
        ) {
          bestRule = rule;
        }
      }
    }
  }

  return bestRule ? bestRule.type === "allow" : true;
}
