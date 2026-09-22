import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  BRAND,
  CONTACT_EMAIL,
  getSiteOrigin,
} from "@/lib/site";
import { ENTITY_DESCRIPTION } from "@/lib/seo";
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
const title = `Download X / Twitter Videos Free — ${BRAND}`;
const description = ENTITY_DESCRIPTION;

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
    "SaveTheX",
    "Save The X",
    "savethex",
    "savethex.com",
    "download twitter video",
    "twitter video downloader",
    "download x video",
    "x video downloader",
    "twitter video download",
    "download twitter gif",
    "x gif downloader",
    "x live replay download",
    "x live downloader",
    "download x live replay",
    "ssstwitter alternative",
    "save twitter video",
    "twitter mp4 download",
    "download x video mp4",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: BRAND,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${BRAND} — free X/Twitter video downloader`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
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
        <Analytics />
      </body>
    </html>
  );
}
