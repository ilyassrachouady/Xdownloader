import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { BRAND } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex min-w-0 shrink items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`${BRAND} home`}
        >
          {/* Compact mark on very small screens; full wordmark from sm up */}
          <span className="sm:hidden">
            <BrandLogo variant="mark" priority className="h-8 w-8" />
          </span>
          <span className="hidden sm:inline-flex">
            <BrandLogo variant="full" priority className="h-8 max-w-[min(200px,42vw)]" />
          </span>
          <span className="ml-2 truncate font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-foreground sm:hidden">
            {BRAND}
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground sm:gap-1 sm:text-sm"
        >
          <a
            href="#fast-way"
            className="min-h-10 min-w-10 rounded-lg px-2.5 py-2 transition hover:bg-surface-elevated hover:text-foreground sm:px-3"
          >
            Fast
          </a>
          <Link
            href="/guides"
            className="min-h-10 min-w-10 rounded-lg px-2.5 py-2 transition hover:bg-surface-elevated hover:text-foreground sm:px-3"
          >
            Guides
          </Link>
          <a
            href="#faq"
            className="min-h-10 min-w-10 rounded-lg px-2.5 py-2 transition hover:bg-surface-elevated hover:text-foreground sm:px-3"
          >
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
