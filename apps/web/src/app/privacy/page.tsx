import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How X Video Downloader handles URLs and media requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / Privacy
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          X Video Downloader is designed to process public post URLs you submit so we can list
          downloadable media. We do not require an account.
        </p>
        <p>
          The URL you paste is sent to our extraction service to resolve public media metadata.
          Short-lived download tokens are created so files can be streamed securely. We do not
          permanently store downloaded video files on our servers.
        </p>
        <p>
          Basic operational logs (such as request timing and error codes) may be retained briefly to
          keep the service reliable and to enforce rate limits. We do not sell personal data.
        </p>
        <p>
          Only public posts are supported. Do not submit links to private or protected content.
        </p>
        <p>
          Questions? Reach out via the{" "}
          <Link href="/contact" className="text-accent hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
