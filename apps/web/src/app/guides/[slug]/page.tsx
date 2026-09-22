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
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/guides" className="hover:text-foreground">
          Guides
        </Link>{" "}
        / {guide.title}
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Published {guide.publishedAt}
        {guide.updatedAt !== guide.publishedAt ? ` · Updated ${guide.updatedAt}` : ""}
      </p>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        {guide.description}
      </p>

      <div className="mt-10 space-y-10">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 rounded-2xl border border-border bg-surface p-5 text-sm text-muted-foreground">
        Ready to try it?{" "}
        <Link href="/" className="font-medium text-accent hover:underline">
          Open {BRAND}
        </Link>{" "}
        and paste a public post URL — or swap x.com for our domain.
      </p>
    </article>
  );
}
