import Image from "next/image";
import Link from "next/link";
import type { PostAuthor } from "../../lib/blog";

interface AuthorCardProps {
  author: PostAuthor;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
      {author.avatar && (
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-emerald-500/20 ring-offset-4 ring-offset-white dark:ring-offset-black flex-shrink-0">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <p className="text-label-sm uppercase tracking-[0.12em] text-emerald-500 mb-2">
          Written by
        </p>
        <h4 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
          {author.name}
        </h4>
        {author.bio && (
          <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2">
            {author.bio}
          </p>
        )}
        <div className="flex items-center gap-4 mt-4 text-body-sm">
          {author.url && (
            <Link
              href={author.url}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              About →
            </Link>
          )}
          {author.sameAs?.[0] && (
            <a
              href={author.sameAs[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
