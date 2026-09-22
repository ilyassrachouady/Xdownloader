const STATUS_PATH = /^\/(?:i\/web\/status|i\/status|[^/]+\/status)\/(\d+)\/?$/;

export type UrlValidationResult =
  | { ok: true; tweetId: string; normalized: string }
  | { ok: false; code: string; message: string };

export function parseStatusPath(pathname: string): string | null {
  const match = STATUS_PATH.exec(pathname);
  return match?.[1] ?? null;
}

export function buildNormalizedStatusUrl(tweetId: string): string {
  return `https://x.com/i/status/${tweetId}`;
}

/**
 * Accepts classic X/Twitter links AND "magic" replace-domain links
 * (yourdomain.com/user/status/id), then normalizes to an x.com status URL
 * for the extractor API.
 */
export function validateTwitterUrl(raw: string): UrlValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      ok: false,
      code: "invalid_url",
      message: "Please paste a valid X or Twitter post URL.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      ok: false,
      code: "invalid_url",
      message: "Please paste a valid X or Twitter post URL.",
    };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      code: "invalid_url",
      message: "Please paste a valid X or Twitter post URL.",
    };
  }

  const tweetId = parseStatusPath(parsed.pathname);
  if (!tweetId) {
    return {
      ok: false,
      code: "invalid_path",
      message: "That link doesn't look like a post URL. Use a link that contains /status/.",
    };
  }

  // Any https host with a valid /status/ path is accepted on the frontend so
  // replace-domain magic links paste cleanly. The API still only fetches X.
  return {
    ok: true,
    tweetId,
    normalized: buildNormalizedStatusUrl(tweetId),
  };
}

export function isLikelyStatusUrl(raw: string): boolean {
  return validateTwitterUrl(raw).ok;
}
