import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allGuideSlugs, getGuide } from "@/lib/guides";
import { BRAND, getSiteOrigin } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Not found" };

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      siteName: BRAND,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const origin = getSiteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: { "@type": "Organization", name: BRAND, url: origin },
    publisher: { "@type": "Organization", name: BRAND, url: origin },
    mainEntityOfPage: `${origin}/guides/${guide.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/guides" className="hover:text-foreground">
          Guides
        </Link>{" "}
        / <span className="text-foreground/80">{guide.title}</span>
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
        Published {guide.publishedAt}
        {guide.updatedAt !== guide.publishedAt ? ` · Updated ${guide.updatedAt}` : ""}
      </p>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">
        {guide.description}
      </p>

      <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {section.heading}
            </h2>
            <div className="mt-2.5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="break-words">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground sm:mt-12 sm:p-5">
        Ready to try it?{" "}
        <Link href="/" className="font-medium text-accent hover:underline">
          Open {BRAND}
        </Link>{" "}
        and paste a public post URL — or swap x.com for our domain.
      </p>
    </article>
  );
}
