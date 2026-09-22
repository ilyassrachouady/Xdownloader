export type MediaFormat = {
  format_id: string;
  quality: string;
  width: number | null;
  height: number | null;
  ext: string;
  filesize: number | null;
  download_url: string;
  vcodec: string | null;
  acodec: string | null;
  is_hls?: boolean;
};

export type ResolveResponse = {
  id: string;
  title: string | null;
  description: string | null;
  uploader: string | null;
  uploader_id: string | null;
  thumbnail: string | null;
  duration: number | null;
  webpage_url: string | null;
  media_kind?: "video" | "live_replay" | "live";
  formats: MediaFormat[];
};

export type ApiError = {
  error?: string;
  code: string;
  message: string;
};

export function getApiBaseUrl(): string {
  // Prefer same-origin /api rewrite in the browser to avoid CORS host mismatches
  // (localhost vs 127.0.0.1). Server-side still talks to the extractor directly.
  if (typeof window !== "undefined") {
    return "/api";
  }
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

export async function resolveMedia(url: string): Promise<ResolveResponse> {
  const base = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${base}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw {
      code: "backend_unavailable",
      message: "The download service is temporarily unavailable. Please try again shortly.",
    } satisfies ApiError;
  }

  const data = (await response.json().catch(() => null)) as
    | ResolveResponse
    | ApiError
    | null;

  if (!response.ok) {
    const err = data as ApiError | null;
    throw {
      code: err?.code || "extraction_failed",
      message:
        err?.message ||
        "We couldn't extract media from this post. Make sure it's public and try again.",
    } satisfies ApiError;
  }

  if (!data || !("formats" in data)) {
    throw {
      code: "extraction_failed",
      message: "Unexpected response from the download service.",
    } satisfies ApiError;
  }

  return data;
}

export function absoluteDownloadUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
