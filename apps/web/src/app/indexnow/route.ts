import { NextResponse } from "next/server";
import { INDEXNOW_KEY, getSiteOrigin } from "@/lib/site";
import { guides } from "@/lib/guides";
import { landingConfigs } from "@/lib/landing-pages";

export const runtime = "nodejs";

/** Submit canonical URLs to IndexNow (Bing / Yandex / compatible engines). */
export async function POST(request: Request) {
  const secret = process.env.INDEXNOW_SUBMIT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "INDEXNOW_SUBMIT_SECRET is not configured" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const origin = getSiteOrigin();
  const host = new URL(origin).host;
  const urls = [
    `${origin}/`,
    `${origin}/about`,
    `${origin}/guides`,
    ...Object.values(landingConfigs).map((c) => `${origin}${c.path}`),
    ...guides.map((g) => `${origin}/guides/${g.slug}`),
    `${origin}/privacy`,
    `${origin}/terms`,
    `${origin}/contact`,
  ];

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    submitted: urls.length,
  });
}

export async function GET() {
  const origin = getSiteOrigin();
  return NextResponse.json({
    keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
    endpoint: `${origin}/indexnow`,
    note: "POST with Authorization: Bearer $INDEXNOW_SUBMIT_SECRET to submit sitemap URLs.",
  });
}
