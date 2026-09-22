import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { BRAND } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`${BRAND} home`}
        >
          <BrandLogo variant="full" priority className="transition group-hover:opacity-90" />
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          <a
            href="#fast-way"
            className="rounded-lg px-3 py-1.5 transition hover:bg-surface-elevated hover:text-foreground"
          >
            Fast way
          </a>
          <Link
            href="/guides"
            className="rounded-lg px-3 py-1.5 transition hover:bg-surface-elevated hover:text-foreground"
          >
            Guides
          </Link>
          <a
            href="#faq"
            className="hidden rounded-lg px-3 py-1.5 transition hover:bg-surface-elevated hover:text-foreground sm:inline"
          >
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
