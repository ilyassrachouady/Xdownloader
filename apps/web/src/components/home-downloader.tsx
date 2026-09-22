"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Downloader } from "@/components/downloader";

function HomeDownloaderInner() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url")?.trim() || "";

  return <Downloader initialUrl={urlParam} autoFetch={Boolean(urlParam)} />;
}

export function HomeDownloader() {
  return (
    <Suspense fallback={<Downloader />}>
      <HomeDownloaderInner />
    </Suspense>
  );
}
