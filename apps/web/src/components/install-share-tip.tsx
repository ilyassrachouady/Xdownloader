"use client";

import { Share2, Smartphone } from "lucide-react";
import { BRAND } from "@/lib/site";

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
            <span className="text-foreground">iPhone:</span> Safari → Share → Add
            to Home Screen.
            <br />
            <span className="text-foreground">Android:</span> Chrome → menu →
            Install app / Add to Home screen.
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
            From the X app, tap Share → More → {BRAND}. We open the post ready to
            download — no copy/paste.
          </p>
        </div>
      </div>
    </section>
  );
}
