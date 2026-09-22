"use client";

import { ChevronRight, Share2, Smartphone } from "lucide-react";
import { BRAND } from "@/lib/site";

function StepTrail({ steps }: { steps: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {steps.map((step, i) => (
        <span key={`${step}-${i}`} className="inline-flex items-center gap-1">
          {i > 0 ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground/70" aria-hidden />
          ) : null}
          <span className="text-foreground">{step}</span>
        </span>
      ))}
    </span>
  );
}

export function InstallShareTip() {
  return (
    <section
      id="install"
      aria-labelledby="install-heading"
      className="mx-auto mt-10 max-w-3xl px-0"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-accent">
            <Smartphone className="h-4 w-4" aria-hidden />
            <h2
              id="install-heading"
              className="text-sm font-semibold text-foreground"
            >
              Install {BRAND}
            </h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">iPhone:</span>{" "}
            <StepTrail steps={["Safari", "Share", "Add to Home Screen"]} />
            <br />
            <span className="font-medium text-foreground">Android:</span>{" "}
            <StepTrail steps={["Chrome", "Menu", "Install app"]} />
          </p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-accent">
            <Share2 className="h-4 w-4" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">
              Share to {BRAND}
            </h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            From the X app, tap{" "}
            <StepTrail steps={["Share", "More", BRAND]} />. We open the post ready
            to download — no copy/paste.
          </p>
        </div>
      </div>
    </section>
  );
}
