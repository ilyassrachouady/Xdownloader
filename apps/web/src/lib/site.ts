export const BRAND = "SaveTheX";
export const BRAND_TAGLINE =
  "Free X/Twitter video, GIF and ended Live replay downloader";
/** Production domain — used in marketing copy when env is unset. */
export const SITE_DOMAIN = "savethex.com";
export const CONTACT_EMAIL = "contact@savethex.com";
/** IndexNow key host file: /{INDEXNOW_KEY}.txt (Bing / Yandex discovery). */
export const INDEXNOW_KEY = "a7c4e91f2b8d4f6a9c1e3d5b7f0a2c4e";

export function getSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? `https://${SITE_DOMAIN}` : "http://localhost:3000")
  ).replace(/\/$/, "");
}

export function getSiteHost(): string {
  try {
    return new URL(getSiteOrigin()).host;
  } catch {
    return SITE_DOMAIN;
  }
}

/** Example of the replace-domain growth hack. */
export function toMagicDownloadUrl(xStatusPath: string): string {
  const path = xStatusPath.startsWith("/") ? xStatusPath : `/${xStatusPath}`;
  return `${getSiteOrigin()}${path}`;
}
