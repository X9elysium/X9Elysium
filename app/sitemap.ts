import type { MetadataRoute } from "next";
import { getAllPosts } from "./lib/blog";
import { getAllJobs } from "./lib/careers";

const BASE_URL = "https://x9elysium.com";

// Pin static-route lastmod to the most recent meaningful content edit per page.
// Bumping the date here is a deliberate signal — don't replace with new Date()
// since that turns every build into a "freshness lie" for crawlers.
const STATIC_LASTMOD = {
  home: "2026-05-02",
  about: "2026-05-02",
  foundation: "2026-04-28",
  services: "2026-05-02",
  work: "2026-05-02",
  contact: "2026-05-02",
  blog: "2026-05-02",
  changelog: "2026-05-03",
  careers: "2026-04-26",
  toronto: "2026-04-22",
  calgary: "2026-04-22",
  platformOdoo: "2026-05-02",
  platformWoocommerce: "2026-05-02",
  termsPolicy: "2026-04-08",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: STATIC_LASTMOD.home,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: STATIC_LASTMOD.services,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: STATIC_LASTMOD.work,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: STATIC_LASTMOD.about,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/foundation`,
      lastModified: STATIC_LASTMOD.foundation,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: STATIC_LASTMOD.contact,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: STATIC_LASTMOD.blog,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/changelog`,
      lastModified: STATIC_LASTMOD.changelog,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: STATIC_LASTMOD.careers,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/locations/toronto`,
      lastModified: STATIC_LASTMOD.toronto,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/locations/calgary`,
      lastModified: STATIC_LASTMOD.calgary,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/platforms/odoo`,
      lastModified: STATIC_LASTMOD.platformOdoo,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/platforms/woocommerce`,
      lastModified: STATIC_LASTMOD.platformWoocommerce,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/terms-policy`,
      lastModified: STATIC_LASTMOD.termsPolicy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const posts = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.updatedAt || post.frontmatter.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const jobs = getAllJobs().map((job) => ({
    url: `${BASE_URL}/careers/${job.slug}`,
    lastModified: new Date(job.postedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts, ...jobs];
}
