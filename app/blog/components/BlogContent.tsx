import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const mdxComponents = {
  a: (props: ComponentPropsWithoutRef<"a">) => {
    const href = props.href || "";
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-500"
        >
          {props.children}
        </Link>
      );
    }
    return (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-500"
      />
    );
  },
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <span className="block my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        alt={props.alt || ""}
        className="w-full rounded-2xl border border-neutral-200/60 dark:border-white/[0.06]"
        loading="lazy"
      />
      {props.alt && (
        <span className="block mt-3 text-center text-body-sm text-neutral-500 dark:text-neutral-500">
          {props.alt}
        </span>
      )}
    </span>
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className="my-8 border-l-4 border-emerald-500 pl-6 py-2 italic text-neutral-700 dark:text-neutral-300 bg-emerald-500/[0.04] rounded-r-lg"
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/[0.06]">
      <table {...props} className="w-full border-collapse" />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      {...props}
      className="px-4 py-3 text-left text-label-sm uppercase tracking-[0.1em] bg-neutral-100 dark:bg-white/[0.03] text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-white/[0.06]"
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      {...props}
      className="px-4 py-3 text-body-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-200/60 dark:border-white/[0.04]"
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => {
    const isInline = !String(props.children || "").includes("\n");
    if (isInline) {
      return (
        <code
          {...props}
          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[0.9em] font-mono"
        />
      );
    }
    return <code {...props} className="font-mono text-[0.9em]" />;
  },
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      className="my-8 p-6 bg-neutral-950 border border-white/[0.06] rounded-xl overflow-x-auto text-neutral-100 text-body-sm leading-relaxed"
    />
  ),
};

interface BlogContentProps {
  source: string;
}

export default function BlogContent({ source }: BlogContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-900 dark:prose-headings:text-white prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-[1.8] prose-li:text-neutral-700 dark:prose-li:text-neutral-300 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-hr:border-neutral-200 dark:prose-hr:border-white/[0.06]">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
