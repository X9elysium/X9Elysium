export type BlogCategory = "GTA" | "Calgary" | "Canada" | "Vancouver";

export interface FAQItem {
  q: string;
  a: string;
}

export interface PostAuthor {
  name: string;
  avatar?: string;
  url?: string;
  sameAs?: string[];
  bio?: string;
}

export interface PostFrontmatter {
  title: string;
  description?: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: PostAuthor;
  category: BlogCategory;
  tags?: string[];
  heroImage?: string;
  heroImageAlt?: string;
  image?: string;
  featured?: boolean;
  faqs?: FAQItem[];
  draft?: boolean;
}

export interface Post {
  frontmatter: PostFrontmatter;
  slug: string;
  content: string;
  readingTime: number;
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}
