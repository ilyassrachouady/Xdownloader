import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the X Video Downloader team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / Contact
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        Contact
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          For support, privacy questions, or abuse reports, email{" "}
          <a
            href="mailto:support@example.com"
            className="font-medium text-accent hover:underline"
          >
            support@example.com
          </a>
          .
        </p>
        <p>
          When reporting an issue, include the public post URL (if appropriate) and a short
          description of what went wrong. Do not send credentials or private account links.
        </p>
      </div>
    </div>
  );
}
