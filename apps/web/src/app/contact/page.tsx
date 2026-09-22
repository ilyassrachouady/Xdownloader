import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Globe } from "lucide-react";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${BRAND} at ${CONTACT_EMAIL} for support, privacy questions, or abuse reports.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-16">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / Contact
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
        Contact
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          For support, privacy questions, or abuse reports, email us:
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 font-medium text-accent transition hover:border-accent/40 hover:underline"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {CONTACT_EMAIL}
        </a>
        <p>
          When reporting an issue, include the public post URL (if appropriate) and a short
          description of what went wrong. Do not send credentials or private account links.
        </p>
        <a
          href={`https://${SITE_DOMAIN}`}
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <Globe className="h-4 w-4" aria-hidden />
          {SITE_DOMAIN}
        </a>
      </div>
    </div>
  );
}
