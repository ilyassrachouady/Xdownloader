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

/**
 * Always talk to the extractor directly.
 * Do NOT proxy long HLS remux downloads through Next.js `/api` rewrites —
 * those truncate streams (users were getting ~1 segment / ~8s of a multi-hour live).
 */
export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"
  );
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

/** Extract signed download token from `/download/{token}` (or absolute URL). */
export function downloadTokenFromUrl(pathOrUrl: string): string | null {
  try {
    const path = pathOrUrl.startsWith("http")
      ? new URL(pathOrUrl).pathname
      : pathOrUrl;
    const m = path.match(/\/download\/([^/?#]+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

export type RemuxJobStatus = {
  job_id: string;
  status: "queued" | "running" | "done" | "error";
  bytes: number;
  error: string | null;
  tweet_id?: string;
  quality?: string;
};

export async function startRemuxJob(token: string): Promise<RemuxJobStatus> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/remux/${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    credentials: "omit",
    mode: "cors",
  });
  const data = (await response.json().catch(() => null)) as RemuxJobStatus | ApiError | null;
  if (!response.ok) {
    const err = data as ApiError | null;
    throw {
      code: err?.code || "remux_failed",
      message: err?.message || "Could not start live remux.",
    } satisfies ApiError;
  }
  return data as RemuxJobStatus;
}

export async function pollRemuxJob(
  jobId: string,
  signal?: AbortSignal,
): Promise<RemuxJobStatus> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/remux/${encodeURIComponent(jobId)}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
    mode: "cors",
    signal,
  });
  const data = (await response.json().catch(() => null)) as RemuxJobStatus | ApiError | null;
  if (!response.ok) {
    const err = data as ApiError | null;
    throw {
      code: err?.code || "remux_failed",
      message: err?.message || "Remux status check failed.",
    } satisfies ApiError;
  }
  return data as RemuxJobStatus;
}

export function remuxFileUrl(jobId: string): string {
  return `${getApiBaseUrl()}/remux/${encodeURIComponent(jobId)}/file`;
}
