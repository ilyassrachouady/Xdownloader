import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms for using ${BRAND} on ${SITE_DOMAIN}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-16">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / Terms
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
        Terms of Use
      </h1>
      <p className="mt-2 text-xs text-muted-foreground">Last updated: September 22, 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          By using {BRAND} ({SITE_DOMAIN}) you agree to use the service only with public posts
          and only for content you have the right to download and use.
        </p>
        <p>
          This tool is not affiliated with X Corp. or Twitter. Platform rules, copyright law, and
          local regulations still apply to any media you save.
        </p>
        <p>
          The service is provided as-is without warranties. Availability may change as third-party
          platforms update how media is delivered. We may rate-limit or block abusive traffic.
        </p>
        <p>
          You agree not to attempt to use the service as a general-purpose proxy, scraper for
          private data, or attack tool against any system.
        </p>
        <p>
          Questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
