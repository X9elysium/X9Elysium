import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Sidebar from "./components/Sidebar";
import MobileSidebarToggle from "./components/MobileSidebarToggle";
import { getTree } from "./lib";

export const metadata: Metadata = {
  title: "Docs · X9Elysium",
  description: "Internal documentation: audits, deployments, and progress changelog.",
  robots: { index: false, follow: false },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getTree();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="pt-[72px] lg:pt-[80px]">
        <div className="section-container py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] gap-8 xl:gap-12">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-[100px] h-[calc(100vh-120px)] rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                <Sidebar tree={tree} />
              </div>
            </aside>

            {/* Mobile toggle */}
            <div className="lg:hidden mb-2">
              <MobileSidebarToggle>
                <Sidebar tree={tree} />
              </MobileSidebarToggle>
            </div>

            {/* Main content */}
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
