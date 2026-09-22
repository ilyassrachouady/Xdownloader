"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardPaste, Loader2, Sparkles, X } from "lucide-react";
import {
  absoluteDownloadUrl,
  resolveMedia,
  type ApiError,
  type ResolveResponse,
} from "@/lib/api";
import { validateTwitterUrl } from "@/lib/url";
import { useDownloadHistory } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaResult } from "@/components/media-result";

type Props = {
  initialUrl?: string;
  autoFetch?: boolean;
};

export function Downloader({ initialUrl = "", autoFetch = false }: Props) {
  const inputId = useId();
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResolveResponse | null>(null);
  const [pastedHint, setPastedHint] = useState(false);
  const autoStarted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { add: addHistory } = useDownloadHistory();

  const runResolve = useCallback(
    async (raw: string) => {
      setError(null);
      const validation = validateTwitterUrl(raw);
      if (!validation.ok) {
        setResult(null);
        setError(validation.message);
        return;
      }

      setLoading(true);
      setResult(null);

      try {
        const data = await resolveMedia(validation.normalized);
        setResult(data);
        setUrl(validation.normalized);
        addHistory(data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError?.message ||
            "We couldn't find downloadable media in this post. Make sure the post is public and contains a video or GIF.",
        );
      } finally {
        setLoading(false);
      }
    },
    [addHistory],
  );

  useEffect(() => {
    if (!autoFetch || !initialUrl.trim()) return;
    if (autoStarted.current) return;
    autoStarted.current = true;
    void runResolve(initialUrl);
  }, [autoFetch, initialUrl, runResolve]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runResolve(url);
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return;
      setUrl(text.trim());
      setPastedHint(true);
      window.setTimeout(() => setPastedHint(false), 1600);
      if (validateTwitterUrl(text).ok) {
        await runResolve(text);
      }
    } catch {
      inputRef.current?.focus();
    }
  }

  function onPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text");
    if (!text) return;
    window.setTimeout(() => {
      if (validateTwitterUrl(text).ok) {
        void runResolve(text);
      }
    }, 0);
  }

  function clearAll() {
    setUrl("");
    setError(null);
    setResult(null);
    inputRef.current?.focus();
  }

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-2xl"
        aria-busy={loading}
      >
        <label htmlFor={inputId} className="sr-only">
          Paste an X or Twitter post URL
        </label>
        <div className="relative rounded-[22px] sm:rounded-[28px]">
          <div className="pointer-events-none absolute -inset-[1px] rounded-[24px] bg-[conic-gradient(from_180deg_at_50%_50%,#8b5cf6_0deg,#22d3ee_120deg,#a78bfa_240deg,#8b5cf6_360deg)] opacity-70 blur-[4px] sm:-inset-[2px] sm:rounded-[30px] sm:opacity-80 sm:blur-[6px]" />
          <div className="relative flex flex-col gap-2 rounded-[20px] border border-border-strong bg-[#0f0f19] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex-row sm:items-stretch sm:rounded-[26px] sm:pl-3">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              id={inputId}
              name="url"
              type="url"
              inputMode="url"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Paste X / Twitter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={onPaste}
              disabled={loading}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
              className="h-12 border-0 bg-transparent pl-3 pr-20 text-base text-foreground placeholder:text-muted-foreground/80 shadow-none focus-visible:ring-0 sm:h-14 sm:pl-2 sm:pr-24"
            />
            <div className="absolute inset-y-0 right-1 flex items-center gap-0.5 sm:right-2 sm:gap-1">
              {url && !loading && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-lg p-2.5 text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Clear URL"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => void pasteFromClipboard()}
                disabled={loading}
                className="rounded-lg p-2.5 text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                aria-label="Paste from clipboard"
                title="Paste"
              >
                {pastedHint ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <ClipboardPaste className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={loading || !url.trim()}
            className="relative h-12 w-full rounded-2xl sm:h-14 sm:w-44"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Fetching…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden />
                Get media
              </>
            )}
          </Button>
          </div>
        </div>
        <p
          id={`${inputId}-hint`}
          className="mt-2.5 px-1 text-center text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:text-left sm:text-sm"
        >
          Paste a link — we fetch automatically. Or replace{" "}
          <span className="text-foreground">x.com</span> in the URL.
        </p>
      </form>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface/70 p-4 shine sm:mt-10 sm:rounded-3xl sm:p-6"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
              Fetching media — videos, GIFs, and live replays…
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-[200px_1fr]">
              <div className="aspect-video animate-pulse rounded-2xl bg-surface-elevated" />
              <div className="space-y-3">
                <div className="h-4 w-1/3 animate-pulse rounded bg-surface-elevated" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-elevated" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-surface-elevated" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-surface-elevated" />
              </div>
            </div>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            id={`${inputId}-error`}
            role="alert"
            className="mx-auto mt-6 max-w-2xl rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger-foreground sm:mt-8 sm:px-5 sm:py-4"
          >
            {error}
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key={`result-${result.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-2xl sm:mt-10"
          >
            <MediaResult
              result={result}
              resolveDownloadHref={(path) => absoluteDownloadUrl(path)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
