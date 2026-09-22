import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { ContentSections } from "@/components/content-sections";
import { HistoryPanel } from "@/components/history-panel";
import { HomeDownloader } from "@/components/home-downloader";
import { InstallShareTip } from "@/components/install-share-tip";
import { MagicLinkTip } from "@/components/magic-link-tip";
import { BRAND, SITE_DOMAIN, getSiteHost } from "@/lib/site";
import {
  ENTITY_DESCRIPTION,
  ENTITY_ONE_LINER,
  faqPageJsonLd,
  getHomeFaqs,
  organizationJsonLd,
  webAppJsonLd,
  webpageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const host = getSiteHost();

export const metadata: Metadata = {
  title: {
    absolute: `Download X / Twitter Videos Free — ${BRAND}`,
  },
  description: ENTITY_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `Download X / Twitter Videos Free — ${BRAND}`,
    description: ENTITY_DESCRIPTION,
    url: "/",
    type: "website",
    siteName: BRAND,
  },
  twitter: {
    card: "summary_large_image",
    title: `Download X / Twitter Videos Free — ${BRAND}`,
    description: ENTITY_DESCRIPTION,
  },
};

const jsonLd = [
  organizationJsonLd(),
  websiteJsonLd(),
  webAppJsonLd(),
  webpageJsonLd({
    path: "/",
    name: `Download X / Twitter Videos Free — ${BRAND}`,
    description: ENTITY_DESCRIPTION,
  }),
  faqPageJsonLd(getHomeFaqs()),
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative px-3 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border-strong bg-surface-strong/70 px-2.5 py-1 text-[10px] font-medium text-muted backdrop-blur sm:px-3 sm:text-[11px]">
            <Shield className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
            <span className="truncate">Free · No account · No watermark</span>
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[2rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:mt-6 sm:text-6xl">
            Download X &amp; Twitter videos{" "}
            <span className="text-gradient">free</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {ENTITY_ONE_LINER} Save public posts as MP4 on {SITE_DOMAIN} — paste a
            link or swap <span className="text-foreground">x.com</span> for{" "}
            <span className="text-accent">{host}</span>.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Supports public videos, GIFs, and{" "}
            <Link href="/x-live-downloader" className="text-accent hover:underline">
              ended X Live replays
            </Link>
            . Not affiliated with X Corp.
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-3xl sm:mt-10">
          <HomeDownloader />
        </div>

        <MagicLinkTip />
        <InstallShareTip />
        <HistoryPanel />
      </section>

      <ContentSections />
    </>
  );
}
