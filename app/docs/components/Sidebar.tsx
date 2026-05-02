"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, FolderOpen, FileText, Search } from "lucide-react";
import type { DocNode } from "../lib";

interface SidebarProps {
  tree: DocNode[];
}

export default function Sidebar({ tree }: SidebarProps) {
  const [query, setQuery] = useState("");
  const filtered = query.trim() ? filterTree(tree, query.toLowerCase()) : tree;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 border-b border-neutral-200/60 dark:border-white/[0.06]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-3">
          Documentation
        </p>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.08] rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 transition"
          />
        </div>
      </div>
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5"
        aria-label="Documentation navigation"
      >
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-500 px-3 py-2">
            No matches.
          </p>
        ) : (
          filtered.map((node) => <TreeItem key={node.path} node={node} depth={0} />)
        )}
      </nav>
    </div>
  );
}

function TreeItem({ node, depth }: { node: DocNode; depth: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(depth === 0);
  const padding = `${0.5 + depth * 0.75}rem`;

  if (node.type === "dir") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.04] hover:text-neutral-900 dark:hover:text-white transition"
          style={{ paddingLeft: padding }}
        >
          <ChevronRight
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
              open ? "rotate-90" : ""
            } text-neutral-400 dark:text-neutral-500`}
          />
          <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400/80" />
          <span className="truncate font-medium">{humanize(node.name)}</span>
        </button>
        {open && (
          <div className="mt-0.5">
            {node.children.map((child) => (
              <TreeItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const href = "/docs/" + node.slug.join("/");
  const isActive = pathname === href || pathname === href + "/";
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-sm transition truncate ${
        isActive
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] hover:text-neutral-900 dark:hover:text-white"
      }`}
      style={{ paddingLeft: padding }}
    >
      <span className="w-3.5 flex-shrink-0" aria-hidden />
      <FileText
        className={`w-3.5 h-3.5 flex-shrink-0 ${
          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"
        }`}
      />
      <span className="truncate">{node.title}</span>
    </Link>
  );
}

function humanize(s: string) {
  return s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function filterTree(nodes: DocNode[], q: string): DocNode[] {
  const out: DocNode[] = [];
  for (const n of nodes) {
    if (n.type === "file") {
      if (n.path.toLowerCase().includes(q) || n.title.toLowerCase().includes(q)) {
        out.push(n);
      }
    } else {
      const kids = filterTree(n.children, q);
      if (kids.length || n.name.toLowerCase().includes(q)) {
        out.push({ ...n, children: kids.length ? kids : n.children });
      }
    }
  }
  return out;
}
