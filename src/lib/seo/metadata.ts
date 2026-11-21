import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export interface OgImageInput {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
  ogImage?: OgImageInput;
  absoluteTitle?: boolean;
  noIndex?: boolean;
  follow?: boolean;
}

export const DEFAULT_OG_IMAGE: OgImageInput = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Divinity Cosmetics — Facial-Grade Marula & Baobab Body Care (South Africa)",
};

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, "") || "/";
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const normalizedPath = normalizePath(input.path);
  const fullUrl =
    normalizedPath === "/"
      ? siteConfig.url
      : `${siteConfig.url}${normalizedPath}`;

  const resolvedTitle: Metadata["title"] = input.absoluteTitle
    ? { absolute: input.title }
    : input.title;

  const socialTitle =
    input.absoluteTitle || input.title.includes(siteConfig.name)
      ? input.title
      : `${input.title} | ${siteConfig.name}`;

  const ogImage = input.ogImage ?? DEFAULT_OG_IMAGE;
  const twitterImage = input.ogImage
    ? { url: input.ogImage.url, alt: input.ogImage.alt }
    : "/twitter-image";
  const ogType = input.ogType ?? "website";

  const sharedOpenGraph: NonNullable<Metadata["openGraph"]> = {
    title: socialTitle,
    description: input.description,
    url: fullUrl,
    siteName: siteConfig.name,
    locale: "en_ZA",
    type: ogType,
    images: [ogImage],
  };

  const sharedTwitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title: socialTitle,
    description: input.description,
    images: [twitterImage],
  };

  if (input.noIndex) {
    return {
      title: resolvedTitle,
      description: input.description,
      robots: {
        index: false,
        follow: input.follow ?? false,
      },
      openGraph: sharedOpenGraph,
      twitter: sharedTwitter,
    };
  }

  const follow = input.follow ?? true;

  return {
    title: resolvedTitle,
    description: input.description,
    ...(input.keywords && input.keywords.length > 0
      ? { keywords: input.keywords }
      : {}),
    alternates: {
      canonical: normalizedPath,
      languages: {
        "en-ZA": normalizedPath,
      },
    },
    robots: {
      index: true,
      follow,
      googleBot: {
        index: true,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: sharedOpenGraph,
    twitter: sharedTwitter,
  };
}
