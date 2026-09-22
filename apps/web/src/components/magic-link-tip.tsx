"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Sparkles } from "lucide-react";
import { getSiteHost, getSiteOrigin } from "@/lib/site";
import { Button } from "@/components/ui/button";

type Props = {
  examplePath?: string;
  variant?: "hero" | "card";
};

export function MagicLinkTip({
  examplePath = "/username/status/123456789",
  variant = "hero",
}: Props) {
  const host = getSiteHost();
  const origin = getSiteOrigin();
  const [copied, setCopied] = useState(false);

  const after = useMemo(() => `${origin}${examplePath}`, [examplePath, origin]);

  async function copyAfter() {
    try {
      await navigator.clipboard.writeText(after);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  if (variant === "hero") {
    return (
      <section
        id="fast-way"
        aria-labelledby="fast-way-heading"
        className="mx-auto mt-8 max-w-3xl"
      >
        <div className="glass glow-ring relative overflow-hidden rounded-3xl p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-accent-2/15 blur-3xl" />

          <div className="relative flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3 w-3" aria-hidden />
              Fastest way
            </span>
            <h2
              id="fast-way-heading"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl"
            >
              Just replace <span className="text-muted-foreground line-through decoration-danger/70">x.com</span>{" "}
              with{" "}
              <span className="text-gradient font-bold">{host}</span>
            </h2>
          </div>

          <div className="relative mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-2xl border border-border-strong bg-background/60 px-4 py-3 font-mono text-xs sm:text-sm">
              <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground/80">
                From
              </p>
              <p className="mt-1 truncate text-muted-foreground">
                <span className="text-danger/90">x.com</span>
                <span className="text-foreground/80">{examplePath}</span>
              </p>
            </div>
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center sm:flex">
              <ArrowRight className="h-5 w-5 text-accent" aria-hidden />
            </div>
            <div className="flex-1 rounded-2xl border border-accent/40 bg-background/70 px-4 py-3 font-mono text-xs shadow-[0_10px_30px_-15px_rgba(139,92,246,0.6)] sm:text-sm">
              <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-accent">
                To
              </p>
              <p className="mt-1 truncate text-foreground">
                <span className="text-gradient font-semibold">{host}</span>
                <span className="text-foreground/90">{examplePath}</span>
              </p>
            </div>
          </div>

          <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Works from mobile too. Share any X post to{" "}
              <span className="text-foreground">{host}</span> and it opens ready to
              download.
            </p>
            <Button
              type="button"
              size="sm"
              variant={copied ? "soft" : "secondary"}
              onClick={() => void copyAfter()}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Copy example
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="fast-way"
      aria-labelledby="fast-way-heading-card"
      className="mx-auto mt-12 max-w-2xl rounded-2xl border border-accent/25 bg-accent/5 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-accent/15 p-2 text-accent">
          <Sparkles className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="fast-way-heading-card"
            className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground"
          >
            Fastest way — replace the domain
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Keep the post path, swap <span className="text-foreground">x.com</span> for{" "}
            <span className="text-accent">{host}</span>. Lands here ready to download.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2.5 font-mono text-xs sm:text-sm">
            <span className="truncate text-foreground">{after}</span>
            <Button
              type="button"
              size="sm"
              variant={copied ? "soft" : "secondary"}
              onClick={() => void copyAfter()}
              className="ml-auto shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
