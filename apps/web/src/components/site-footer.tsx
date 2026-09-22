import Link from "next/link";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Guides" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-accent-strong to-[color:var(--accent-glow)] text-[11px] font-bold text-white">
                S
              </span>
              <p className="text-sm font-semibold text-foreground">{BRAND}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Download videos, GIFs and live replays from public X / Twitter posts at{" "}
              {SITE_DOMAIN}. Not affiliated with X Corp. Users are responsible for respecting
              copyright and platform rules.
            </p>
            <p className="text-sm text-muted-foreground">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#disclaimer"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Disclaimer
            </a>
          </nav>
        </div>
        <p id="disclaimer" className="mt-10 text-xs leading-relaxed text-muted-foreground/80">
          Disclaimer: {BRAND} is an independent tool and is not affiliated with, endorsed
          by, or connected to X Corp. or Twitter. Only download content you have the right
          to use, and always follow applicable laws and platform terms.
        </p>
      </div>
    </footer>
  );
}
