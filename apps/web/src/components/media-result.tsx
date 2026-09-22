"use client";

import { useMemo, useRef, useState } from "react";
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

type ProgressState = {
  key: string;
  received: number;
  /** Indeterminate remux — no content-length from HLS stream */
  phase: "fetching" | "saving" | "done" | "error";
  message?: string;
};

function pickBest(formats: MediaFormat[]): MediaFormat | null {
  if (!formats.length) return null;
  return [...formats].sort((a, b) => (b.height || 0) - (a.height || 0))[0];
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
}

export function MediaResult({ result, resolveDownloadHref }: Props) {
  const duration = formatDuration(result.duration);
  const caption = result.description || result.title;
  const isLiveKind = result.media_kind === "live_replay" || result.media_kind === "live";

  const [thumbFailed, setThumbFailed] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const thumbSrc = result.thumbnail ? absoluteDownloadUrl(result.thumbnail) : null;
  const best = useMemo(() => pickBest(result.formats), [result.formats]);
  const others = useMemo(
    () => (best ? result.formats.filter((f) => f !== best) : result.formats),
    [best, result.formats],
  );

  const busyKey = progress && progress.phase !== "done" && progress.phase !== "error"
    ? progress.key
    : null;

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

  /**
   * Progressive MP4: plain <a download> is fine.
   * HLS / live remux: fetch the full stream into a blob first. Browser <a download>
   * against a long cross-origin stream often closes early (~1 HLS segment / ~8s).
   */
  async function downloadFormat(format: MediaFormat, key: string) {
    const href = resolveDownloadHref(format.download_url);
    const filename = `x-${isLiveKind ? "live" : "video"}-${result.id}-${format.quality}.mp4`;

    if (!format.is_hls) {
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setProgress({ key, received: 0, phase: "fetching" });

    try {
      const response = await fetch(href, {
        signal: controller.signal,
        credentials: "omit",
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }
      if (!response.body) {
        const blob = await response.blob();
        setProgress({ key, received: blob.size, phase: "saving" });
        triggerBlobDownload(blob, filename);
        setProgress({ key, received: blob.size, phase: "done" });
        return;
      }

      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        setProgress({ key, received, phase: "fetching" });
      }

      setProgress({ key, received, phase: "saving" });
      const blob = new Blob(chunks, { type: "video/mp4" });
      triggerBlobDownload(blob, filename);
      setProgress({ key, received, phase: "done" });
      window.setTimeout(() => {
        setProgress((p) => (p?.key === key ? null : p));
      }, 4000);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        setProgress(null);
        return;
      }
      setProgress({
        key,
        received: 0,
        phase: "error",
        message:
          "Live remux failed or was interrupted. Keep this tab open and try again — longer lives can take several minutes.",
      });
    }
  }

  function renderDownloadButton(
    format: MediaFormat,
    key: string,
    opts: { size?: "sm" | "lg"; label: string; className?: string },
  ) {
    const busy = busyKey === key;
    const phase = progress?.key === key ? progress.phase : null;
    const received = progress?.key === key ? progress.received : 0;

    return (
      <div className={opts.className}>
        <Button
          type="button"
          size={opts.size ?? "lg"}
          className="h-12 w-full sm:w-auto"
          disabled={Boolean(busyKey) && !busy}
          onClick={() => void downloadFormat(format, key)}
        >
          {busy && phase === "fetching" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Remuxing… {formatBytes(received) || "0 B"}
            </>
          ) : busy && phase === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : phase === "done" ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Saved
            </>
          ) : (
            <>
              <Download className="h-4 w-4" aria-hidden />
              {opts.label}
            </>
          )}
        </Button>
        {busy && format.is_hls && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/30">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-2" />
          </div>
        )}
        {progress?.key === key && progress.phase === "error" && (
          <p className="mt-2 text-[11px] text-danger-foreground">{progress.message}</p>
        )}
      </div>
    );
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

        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <header className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {(result.uploader || result.uploader_id) && (
                  <p className="inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-foreground">
                    <User className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                    <span className="truncate">{result.uploader || result.uploader_id}</span>
                  </p>
                )}
                {caption && (
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
                    {caption}
                  </p>
                )}
              </div>
              {result.webpage_url && (
                <button
                  type="button"
                  onClick={() => void copyPostLink()}
                  className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg border border-border-strong bg-surface-strong/60 px-2.5 py-1.5 text-[11px] text-muted transition hover:text-foreground"
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
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-accent-2/5 to-transparent p-3.5 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Recommended · Best quality
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground sm:text-lg">
                    {best.quality} {best.ext.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      best.width && best.height ? `${best.width} × ${best.height}` : null,
                      formatBytes(best.filesize),
                      best.is_hls ? "HLS to MP4" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "MP4 video"}
                  </p>
                </div>
                {renderDownloadButton(best, `best-${best.format_id}`, {
                  label: "Save video",
                  className: "w-full sm:w-auto",
                })}
              </div>
              {isLiveKind && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Live replays remux in this tab before saving. A 1-hour live can take several
                  minutes — watch the size counter and keep the tab open until you see Saved.
                  Opening a half-finished file only shows the first ~8s segment.
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
                                format.is_hls ? "HLS to MP4" : null,
                              ]
                                .filter(Boolean)
                                .join(" · ") || "MP4 video"}
                            </p>
                          </div>
                          {renderDownloadButton(format, key, {
                            size: "sm",
                            label: "Download",
                            className: "w-full sm:w-auto",
                          })}
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
