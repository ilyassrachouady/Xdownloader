import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  BRAND,
  BRAND_TAGLINE,
  CONTACT_EMAIL,
  SITE_DOMAIN,
  getSiteOrigin,
} from "@/lib/site";
import "./globals.css";

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = getSiteOrigin();
const title = `${BRAND} — ${BRAND_TAGLINE}`;
const description = `Download videos, GIFs, and live replays from X in the highest available quality on ${SITE_DOMAIN}. Paste a link or swap x.com with ${SITE_DOMAIN}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${BRAND}`,
  },
  description,
  applicationName: BRAND,
  authors: [{ name: BRAND, url: siteUrl }],
  creator: BRAND,
  publisher: BRAND,
  keywords: [
    "savethex",
    "savethex.com",
    "savex",
    "x video downloader",
    "twitter video download",
    "download twitter gif",
    "x.com media download",
    "x live replay download",
    "download twitter video",
    "save x video",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: BRAND,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
  other: {
    "contact:email": CONTACT_EMAIL,
  },
  appleWebApp: {
    capable: true,
    title: BRAND,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
