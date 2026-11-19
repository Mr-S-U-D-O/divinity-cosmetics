import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/domain/products/service";
import { siteConfig } from "@/lib/config/site";

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
    images: [
      `${siteConfig.url}/images/body-lotion-marula-baobab-hero.jpg`,
      `${siteConfig.url}/images/body-lotion-marula-baobab-detail.jpg`,
    ],
  },
  {
    route: "/shop",
    priority: 0.95,
    changeFrequency: "weekly",
    images: [`${siteConfig.url}/images/body-lotion-marula-baobab-hero.jpg`],
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
  const products = await getAllProducts({ onlyActive: true });
  const now = new Date();

  return [
    ...publicRoutes.map(({ route, priority, changeFrequency, images }) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
      changeFrequency,
      priority,
      ...(images ? { images } : {}),
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: product.updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.95,
      images: (product.images || []).map((img) =>
        img.startsWith("http") ? img : `${siteConfig.url}${img}`
      ),
    })),
  ];
}
