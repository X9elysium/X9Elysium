"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function MobileSidebarToggle({ children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] text-sm font-medium text-neutral-700 dark:text-neutral-300 backdrop-blur"
      >
        <Menu className="w-4 h-4" />
        Files
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative w-[88%] max-w-sm h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-white/[0.06] flex flex-col">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
