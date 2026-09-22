import { Shield } from "lucide-react";
import { ContentSections } from "@/components/content-sections";
import { HistoryPanel } from "@/components/history-panel";
import { HomeDownloader } from "@/components/home-downloader";
import { InstallShareTip } from "@/components/install-share-tip";
import { MagicLinkTip } from "@/components/magic-link-tip";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN, getSiteOrigin } from "@/lib/site";
import { faqPageJsonLd, getHomeFaqs, webAppJsonLd } from "@/lib/seo";

const origin = getSiteOrigin();

const jsonLd = [
  webAppJsonLd(),
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: origin,
    email: CONTACT_EMAIL,
    logo: `${origin}/icon-512.png`,
    sameAs: [`https://${SITE_DOMAIN}`],
  },
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
            Save public videos, GIFs, and live replays as MP4 on {SITE_DOMAIN} — paste a
            link or swap x.com for our domain.
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
