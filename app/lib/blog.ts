import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BlogCategory,
  FAQItem,
  PostAuthor,
  PostFrontmatter,
  Post,
} from "./blog-types";

export type {
  BlogCategory,
  FAQItem,
  PostAuthor,
  PostFrontmatter,
  Post,
} from "./blog-types";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const DEFAULT_AUTHOR: PostAuthor = {
  name: "Darshan Patel",
  avatar: "/images/author/dp.jpeg",
  url: "https://x9elysium.com/about",
  sameAs: ["https://linkedin.com/company/x9elysium"],
  bio: "Founder of X9Elysium, a Shopify unified commerce consultancy serving Vancouver, Toronto, and Calgary.",
};

function normalizeAuthor(raw: unknown): PostAuthor {
  if (!raw || typeof raw !== "object") return DEFAULT_AUTHOR;
  const r = raw as Record<string, unknown>;
  return {
    name: (r.name as string) ?? DEFAULT_AUTHOR.name,
    avatar: (r.avatar as string) ?? DEFAULT_AUTHOR.avatar,
    url: (r.url as string) ?? DEFAULT_AUTHOR.url,
    sameAs: (r.sameAs as string[]) ?? DEFAULT_AUTHOR.sameAs,
    bio: (r.bio as string) ?? DEFAULT_AUTHOR.bio,
  };
}

function pickDate(raw: Record<string, unknown>, key: string): string | undefined {
  const value = raw[key];
  if (!value) return undefined;
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return undefined;
}

function deriveDescription(content: string, max = 160): string {
  const stripped = content
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`>\-]/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= max) return stripped;
  return stripped.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function sanitizeMdx(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\d)/g, "&lt;$1")
    .replace(/<(?=\s)/g, "&lt;");
}

function readPost(filename: string): Post | null {
  if (filename.startsWith("_") || (!filename.endsWith(".md") && !filename.endsWith(".mdx"))) {
    return null;
  }

  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  if (data.draft) return null;

  const slug =
    (data.slug as string) ||
    filename.replace(/\.(md|mdx)$/, "");

  const publishedAt =
    pickDate(data, "publishedAt") ||
    pickDate(data, "date") ||
    new Date().toISOString();

  const updatedAt = pickDate(data, "updatedAt") || publishedAt;

  const description =
    (data.description as string) ||
    (data.excerpt as string) ||
    deriveDescription(content);

  const heroImage =
    (data.heroImage as string) ||
    (data.image as string) ||
    "/images/blog/01.jpg";

  const category: BlogCategory = (data.category as BlogCategory) || "Canada";

  const frontmatter: PostFrontmatter = {
    title: data.title as string,
    description,
    slug,
    publishedAt,
    updatedAt,
    author: normalizeAuthor(data.author),
    category,
    tags: (data.tags as string[]) || [],
    heroImage,
    heroImageAlt: (data.heroImageAlt as string) || (data.title as string),
    image: heroImage,
    featured: Boolean(data.featured),
    faqs: (data.faqs as FAQItem[]) || [],
  };

  if (new Date(frontmatter.publishedAt) > new Date()) return null;

  const sanitizedContent = sanitizeMdx(content);

  return {
    frontmatter,
    slug,
    content: sanitizedContent,
    readingTime: calculateReadingTime(sanitizedContent),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR);
  const posts = files
    .map(readPost)
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);

  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.frontmatter.category === current.frontmatter.category) score += 3;
      const overlap = (p.frontmatter.tags || []).filter((t) =>
        (current.frontmatter.tags || []).includes(t)
      ).length;
      score += overlap * 2;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

export function getCategories(): { category: BlogCategory; count: number }[] {
  const counts = new Map<BlogCategory, number>();
  for (const post of getAllPosts()) {
    const c = post.frontmatter.category;
    counts.set(c, (counts.get(c) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}

export function getFeaturedPost(): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.frontmatter.featured) ?? posts[0] ?? null;
}

export { formatPostDate } from "./blog-types";
