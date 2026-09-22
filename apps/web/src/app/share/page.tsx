import { redirect } from "next/navigation";
import { parseStatusPath } from "@/lib/url";

type SearchParams = Promise<{
  url?: string | string[];
  text?: string | string[];
  title?: string | string[];
}>;

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

/** Grabs the first x.com / twitter.com /status/ URL from a blob of text. */
function extractStatusUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  // Decode once in case share sheets double-encode
  let text = raw;
  try {
    text = decodeURIComponent(raw);
  } catch {
    // keep raw
  }
  const match = text.match(
    /https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/[^\s"'<>]*\/status\/\d+/i,
  );
  return match ? match[0] : null;
}

function statusIdFromCandidate(candidate: string | undefined): string | null {
  const url = extractStatusUrl(candidate);
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parseStatusPath(parsed.pathname);
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function SharePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const candidates = [first(params.url), first(params.text), first(params.title)];

  for (const candidate of candidates) {
    const id = statusIdFromCandidate(candidate);
    // redirect() throws — must NOT be inside try/catch
    if (id) redirect(`/i/status/${id}`);
  }

  redirect("/?shared=1");
}
