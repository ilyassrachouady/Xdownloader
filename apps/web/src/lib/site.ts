export const BRAND = "SaveX";
export const BRAND_TAGLINE = "Download X videos, GIFs & live replays";
/** Production domain — used in marketing copy when env is unset. */
export const SITE_DOMAIN = "savethex.com";
export const CONTACT_EMAIL = "contact@savethex.com";

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
