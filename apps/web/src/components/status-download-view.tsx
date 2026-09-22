import type { Metadata } from "next";
import Link from "next/link";
import { Downloader } from "@/components/downloader";
import { HistoryPanel } from "@/components/history-panel";
import { MagicLinkTip } from "@/components/magic-link-tip";
import { buildNormalizedStatusUrl } from "@/lib/url";

type Props = {
  username: string;
  tweetId: string;
};

export function buildStatusMetadata(username: string, tweetId: string): Metadata {
  const handle = username === "i" ? "X" : `@${username}`;
  return {
    title: `Download ${handle} video`,
    description: `Download the video or live replay from this public X post (${tweetId}).`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${username}/status/${tweetId}`,
    },
  };
}

export function StatusDownloadView({ username, tweetId }: Props) {
  const initialUrl = buildNormalizedStatusUrl(tweetId);
  const handle = username === "i" || username === "web" ? null : `@${username}`;

  return (
    <section className="relative px-3 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-accent">Magic link</span>
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[1.65rem] font-semibold leading-tight tracking-tight text-foreground sm:mt-4 sm:text-4xl">
          {handle ? (
            <>
              Downloading <span className="text-gradient">{handle}</span>
            </>
          ) : (
            "Downloading this post"
          )}
        </h1>
        <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
          You used the replace-domain shortcut. We&apos;re fetching the public media
          automatically.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-3xl sm:mt-8">
        <Downloader initialUrl={initialUrl} autoFetch />
      </div>

      <MagicLinkTip examplePath={`/${username}/status/${tweetId}`} variant="card" />
      <HistoryPanel />
    </section>
  );
}
