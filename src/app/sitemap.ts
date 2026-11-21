import type { MetadataRoute } from "next";
import { getSitemapProducts } from "@/lib/domain/products/service";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

const STATIC_LAST_MODIFIED = new Date("2026-11-20T00:00:00.000Z");

const publicRoutes: Array<{
  route: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  images?: string[];
}> = [
  {
    route: "",
    priority: 1.0,
    changeFrequency: "weekly",
    images: [`${siteConfig.url}/images/marula-baobab-body-lotion.jpg`],
  },
  {
    route: "/shop",
    priority: 0.95,
    changeFrequency: "weekly",
    images: [`${siteConfig.url}/images/marula-baobab-body-lotion.jpg`],
  },
  {
    route: "/about",
    priority: 0.9,
    changeFrequency: "monthly",
    images: [`${siteConfig.url}/images/divinity-our-story.jpg`],
  },
  {
    route: "/rituals",
    priority: 0.85,
    changeFrequency: "monthly",
    images: [`${siteConfig.url}/images/bento-story-lotion.jpg`],
  },
  {
    route: "/faq",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    route: "/reseller",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    route: "/shipping",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    route: "/contact",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    route: "/privacy",
    priority: 0.5,
    changeFrequency: "monthly",
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getSitemapProducts();

  return [
    ...publicRoutes.map(({ route, priority, changeFrequency, images }) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency,
      priority,
      ...(images ? { images } : {}),
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: product.updatedAt || STATIC_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.95,
      images: (product.images || [])
        .map((img) => img.trim())
        .filter(Boolean)
        .map((img) => {
          if (/^https?:\/\//i.test(img)) {
            return img;
          }
          const normalized = img.startsWith("/") ? img : `/${img}`;
          return `${siteConfig.url}${normalized}`;
        }),
    })),
  ];
}
