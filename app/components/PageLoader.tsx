"use client";

import Image from "next/image";

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-emerald-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/x9-logo.png"
              alt="X9Elysium"
              width={48}
              height={48}
              priority
              className="h-12 w-12 object-contain"
            />
          </div>
        </div>

        <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-[loader-slide_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        </div>

        <span className="sr-only">Loading X9Elysium</span>
      </div>
    </div>
  );
}
