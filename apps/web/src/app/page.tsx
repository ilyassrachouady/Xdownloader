import { Shield } from "lucide-react";
import { ContentSections } from "@/components/content-sections";
import { HistoryPanel } from "@/components/history-panel";
import { HomeDownloader } from "@/components/home-downloader";
import { InstallShareTip } from "@/components/install-share-tip";
import { MagicLinkTip } from "@/components/magic-link-tip";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN, getSiteOrigin } from "@/lib/site";

const origin = getSiteOrigin();

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: BRAND,
    url: origin,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    description: `Download videos, GIFs and live replays from X and Twitter in high quality on ${SITE_DOMAIN}. Paste a public post URL or just swap the domain.`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: origin,
    email: CONTACT_EMAIL,
    sameAs: [`https://${SITE_DOMAIN}`],
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative px-4 pb-8 pt-12 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface-strong/70 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur">
            <Shield className="h-3.5 w-3.5 text-accent" aria-hidden />
            No account · No ads · Public posts
          </span>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Save any X post in{" "}
            <span className="text-gradient">one click</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Videos, GIFs, and live replays — in the highest quality X serves.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
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
