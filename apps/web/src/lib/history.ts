"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ResolveResponse } from "@/lib/api";

const STORAGE_KEY = "savex.history.v1";
const MAX_ITEMS = 10;
const EVENT = "savex:history";

export type HistoryItem = {
  id: string;
  savedAt: number;
  thumbnail: string | null;
  uploader: string | null;
  caption: string | null;
  mediaKind: "video" | "live_replay" | "live";
  webpageUrl: string | null;
};

function safeRead(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is HistoryItem =>
        Boolean(item) && typeof item === "object" && typeof (item as HistoryItem).id === "string",
    );
  } catch {
    return [];
  }
}

function safeWrite(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // storage disabled — no-op
  }
}

// Cached snapshot so useSyncExternalStore stays referentially stable between reads.
let cachedSnapshot: HistoryItem[] = [];
let cachedRaw = "";

function readSnapshot(): HistoryItem[] {
  if (typeof window === "undefined") return cachedSnapshot;
  const raw = window.localStorage.getItem(STORAGE_KEY) || "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = safeRead();
  }
  return cachedSnapshot;
}

function subscribe(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

const EMPTY: HistoryItem[] = [];

export function useDownloadHistory() {
  const items = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => EMPTY,
  );

  const add = useCallback((result: ResolveResponse) => {
    const next: HistoryItem = {
      id: result.id,
      savedAt: Date.now(),
      thumbnail: result.thumbnail ?? null,
      uploader: result.uploader ?? result.uploader_id ?? null,
      caption: result.description ?? result.title ?? null,
      mediaKind: (result.media_kind as HistoryItem["mediaKind"]) ?? "video",
      webpageUrl: result.webpage_url ?? null,
    };
    const current = safeRead();
    const deduped = [next, ...current.filter((it) => it.id !== next.id)];
    safeWrite(deduped);
  }, []);

  const remove = useCallback((id: string) => {
    const current = safeRead().filter((it) => it.id !== id);
    safeWrite(current);
  }, []);

  const clear = useCallback(() => {
    safeWrite([]);
  }, []);

  return { items, ready: true, add, remove, clear };
}
