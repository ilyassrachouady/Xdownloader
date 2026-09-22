import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND, BRAND_TAGLINE } from "@/lib/site";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = `${BRAND} — ${BRAND_TAGLINE}`;
const description =
  "Download videos, GIFs, and live replays from X in the highest available quality. Paste a link or just swap x.com with our domain.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${BRAND}`,
  },
  description,
  applicationName: BRAND,
  keywords: [
    "savethex",
    "savex",
    "x video downloader",
    "twitter video download",
    "download twitter gif",
    "x.com media download",
    "x live replay download",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: BRAND,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
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
