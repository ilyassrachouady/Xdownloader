import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND} (${SITE_DOMAIN}) handles URLs, analytics, and local storage.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-16">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / Privacy
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-xs text-muted-foreground">Last updated: September 23, 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          {BRAND} ({SITE_DOMAIN}) processes public post URLs you submit so we can list
          downloadable media. We do not require an account.
        </p>
        <p>
          The URL you paste is sent to our extraction service to resolve public media metadata.
          Short-lived download tokens are created so files can be streamed securely. For ended
          Live replays, temporary remux files may exist on the server until the job expires.
          We do not permanently store downloaded video files on our servers.
        </p>
        <p>
          Recent downloads listed in the interface are stored only in your browser’s localStorage
          on your device. Clearing site data removes that history.
        </p>
        <p>
          We use Vercel Analytics for anonymous usage metrics (such as page views). It does not
          require you to create an account with {BRAND}.
        </p>
        <p>
          Basic operational logs (such as request timing and error codes) may be retained briefly to
          keep the service reliable and to enforce rate limits. We do not sell personal data.
        </p>
        <p>
          Only public posts are supported. Do not submit links to private or protected content.
        </p>
        <p>
          Questions? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>{" "}
          or use the{" "}
          <Link href="/contact" className="text-accent hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
