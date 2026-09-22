"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  ImageOff,
  Loader2,
  Radio,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MediaFormat, ResolveResponse } from "@/lib/api";
import { absoluteDownloadUrl } from "@/lib/api";
import { formatBytes, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  result: ResolveResponse;
  resolveDownloadHref: (path: string) => string;
};

function pickBest(formats: MediaFormat[]): MediaFormat | null {
  if (!formats.length) return null;
  return [...formats].sort((a, b) => (b.height || 0) - (a.height || 0))[0];
}

export function MediaResult({ result, resolveDownloadHref }: Props) {
  const duration = formatDuration(result.duration);
  const caption = result.description || result.title;
  const isLiveKind = result.media_kind === "live_replay" || result.media_kind === "live";

  const [thumbFailed, setThumbFailed] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);

  const thumbSrc = result.thumbnail ? absoluteDownloadUrl(result.thumbnail) : null;
  const best = useMemo(() => pickBest(result.formats), [result.formats]);
  const others = useMemo(
    () => (best ? result.formats.filter((f) => f !== best) : result.formats),
    [best, result.formats],
  );

  function markPending(key: string, isHls: boolean) {
    setPendingId(key);
    window.setTimeout(() => setPendingId(null), isHls ? 12000 : 2500);
  }

  async function copyPostLink() {
    if (!result.webpage_url) return;
    try {
      await navigator.clipboard.writeText(result.webpage_url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <article className="glass overflow-hidden rounded-3xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]">
      <div className="grid gap-0 md:grid-cols-[minmax(0,260px)_1fr]">
        <div className="relative aspect-video overflow-hidden bg-surface-elevated md:aspect-auto md:min-h-[220px]">
          {thumbSrc && !thumbFailed ? (
            // Proxied through the extractor API so hotlink-protected CDNs (pscp.tv) load.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbSrc}
              alt={caption ? `Thumbnail for ${caption}` : "Video thumbnail"}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setThumbFailed(true)}
            />
          ) : (
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
              <ImageOff className="h-5 w-5 opacity-60" aria-hidden />
              Preview unavailable
            </div>
          )}
          {isLiveKind && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-accent backdrop-blur">
              <Radio className="h-3 w-3" aria-hidden />
              {result.media_kind === "live" ? "Live" : "Live replay"}
            </span>
          )}
          {duration && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
              {duration}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <header className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {(result.uploader || result.uploader_id) && (
                  <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <User className="h-3.5 w-3.5 text-accent" aria-hidden />
                    {result.uploader || result.uploader_id}
                  </p>
                )}
                {caption && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {caption}
                  </p>
                )}
              </div>
              {result.webpage_url && (
                <button
                  type="button"
                  onClick={() => void copyPostLink()}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border-strong bg-surface-strong/60 px-2 py-1 text-[11px] text-muted transition hover:text-foreground"
                  title="Copy post link"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden /> Copied
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3 w-3" aria-hidden /> Post
                    </>
                  )}
                </button>
              )}
            </div>
          </header>

          {best && (
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-accent-2/5 to-transparent p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Recommended · Best quality
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {best.quality} {best.ext.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      best.width && best.height ? `${best.width} × ${best.height}` : null,
                      formatBytes(best.filesize),
                      best.is_hls ? "HLS → MP4" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "MP4 video"}
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a
                    href={resolveDownloadHref(best.download_url)}
                    download
                    rel="noopener noreferrer"
                    onClick={() => markPending(`best-${best.format_id}`, Boolean(best.is_hls))}
                  >
                    {pendingId === `best-${best.format_id}` ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        {best.is_hls ? "Preparing…" : "Starting…"}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" aria-hidden />
                        Save video
                      </>
                    )}
                  </a>
                </Button>
              </div>
              {best.is_hls && pendingId === `best-${best.format_id}` && (
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-black/30">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-2" />
                </div>
              )}
              {isLiveKind && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Live replays remux in the browser download — a 1-hour live can take
                  several minutes. Keep this tab open until the file finishes saving.
                  Don&apos;t open the file early or you&apos;ll only see the first ~8s
                  segment.
                </p>
              )}
            </div>
          )}

          {others.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-foreground"
                aria-expanded={showAll}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${showAll ? "rotate-180" : ""}`}
                  aria-hidden
                />
                {showAll ? "Hide" : `Show ${others.length} other`}{" "}
                {others.length === 1 ? "quality" : "qualities"}
              </button>
              <AnimatePresence initial={false}>
                {showAll && (
                  <motion.ul
                    key="others"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 space-y-2 overflow-hidden"
                    aria-label="Alternative download formats"
                  >
                    {others.map((format) => {
                      const key = `${format.format_id}-${format.quality}`;
                      const busy = pendingId === key;
                      return (
                        <li
                          key={key}
                          className="flex flex-col gap-3 rounded-xl border border-border bg-surface-strong/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {format.quality} {format.ext.toUpperCase()}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {[
                                format.width && format.height
                                  ? `${format.width} × ${format.height}`
                                  : null,
                                formatBytes(format.filesize),
                                format.is_hls ? "HLS → MP4" : null,
                              ]
                                .filter(Boolean)
                                .join(" · ") || "MP4 video"}
                            </p>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            variant="secondary"
                            className="w-full sm:w-auto"
                          >
                            <a
                              href={resolveDownloadHref(format.download_url)}
                              download
                              rel="noopener noreferrer"
                              onClick={() => markPending(key, Boolean(format.is_hls))}
                            >
                              {busy ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                                  {format.is_hls ? "Preparing…" : "Starting…"}
                                </>
                              ) : (
                                <>
                                  <Download className="h-3.5 w-3.5" aria-hidden />
                                  Download
                                </>
                              )}
                            </a>
                          </Button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80">
            {isLiveKind && (
              <span className="inline-flex items-center gap-1 text-accent">
                <Clock className="h-3 w-3" aria-hidden />
                Broadcast
              </span>
            )}
            <span>Post ID {result.id}</span>
            <span>Saved to your device only</span>
          </div>
        </div>
      </div>
    </article>
  );
}
