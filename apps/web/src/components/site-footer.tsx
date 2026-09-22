import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";
import { ENTITY_ONE_LINER } from "@/lib/seo";

const links = [
  { href: "/", label: "Downloader" },
  { href: "/about", label: "About" },
  { href: "/download-x-video", label: "Download X video" },
  { href: "/download-twitter-video", label: "Download Twitter video" },
  { href: "/twitter-video-downloader", label: "Twitter video downloader" },
  { href: "/x-gif-downloader", label: "GIF downloader" },
  { href: "/x-live-downloader", label: "Live replay downloader" },
  { href: "/ssstwitter-alternative", label: "SSSTwitter alternative" },
  { href: "/guides", label: "Guides" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-6xl px-3 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-3">
            <Link
              href="/"
              className="inline-flex max-w-full items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`${BRAND} home`}
            >
              <BrandLogo variant="full" className="h-6 max-w-[min(220px,80vw)] sm:h-7" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ENTITY_ONE_LINER} Available at {SITE_DOMAIN}. Not affiliated with X Corp.
              Users are responsible for respecting copyright and platform rules.
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
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-10 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#disclaimer"
              className="min-h-10 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Disclaimer
            </Link>
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
