"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Clock, Radio, Trash2, Video } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { absoluteDownloadUrl } from "@/lib/api";
import { useDownloadHistory } from "@/lib/history";
import { Button } from "@/components/ui/button";

function relative(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function HistoryPanel() {
  const { items, ready, clear } = useDownloadHistory();
  const visible = useMemo(() => items.slice(0, 10), [items]);

  if (!ready || visible.length === 0) return null;

  return (
    <section
      aria-labelledby="history-heading"
      className="mx-auto mt-10 max-w-4xl px-0 sm:mt-16 sm:px-6"
    >
      <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
        <div className="min-w-0">
          <h2
            id="history-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground sm:text-xl"
          >
            Recent downloads
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Stored on this device only. Cleared when you clear browser data.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => clear()}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Clear
        </Button>
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        <AnimatePresence initial={false}>
          {visible.map((item) => {
            const thumb = item.thumbnail ? absoluteDownloadUrl(item.thumbnail) : null;
            const isLive = item.mediaKind !== "video";
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/i/status/${item.id}`}
                  className="group flex gap-3 rounded-2xl border border-border bg-surface/70 p-3 transition hover:border-accent/40 hover:bg-surface"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground">
                        <Video className="h-4 w-4" aria-hidden />
                      </div>
                    )}
                    {isLive && (
                      <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                        <Radio className="h-2.5 w-2.5" aria-hidden />
                        Live
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">
                      {item.uploader || "Unknown"}
                    </p>
                    {item.caption && (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.caption}
                      </p>
                    )}
                    <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                      <Clock className="h-3 w-3" aria-hidden />
                      {relative(item.savedAt)}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}
