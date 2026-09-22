import Link from "next/link";
import { BRAND } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`${BRAND} home`}
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent-strong to-[color:var(--accent-glow)] text-[13px] font-bold text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.7)] transition group-hover:scale-105">
            S
          </span>
          <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight text-foreground">
            {BRAND}
          </span>
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
          <a
            href="#how-it-works"
            className="hidden rounded-lg px-3 py-1.5 transition hover:bg-surface-elevated hover:text-foreground sm:inline"
          >
            How it works
          </a>
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
