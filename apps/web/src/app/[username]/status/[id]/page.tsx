import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  StatusDownloadView,
  buildStatusMetadata,
} from "@/components/status-download-view";
import { ContentSections } from "@/components/content-sections";

type PageProps = {
  params: Promise<{ username: string; id: string }>;
};

const RESERVED = new Set([
  "privacy",
  "terms",
  "contact",
  "guides",
  "api",
  "share",
  "favicon.ico",
  "_next",
]);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, id } = await params;
  if (!/^\d+$/.test(id) || RESERVED.has(username.toLowerCase())) {
    return { title: "Not found" };
  }
  return buildStatusMetadata(username, id);
}

export default async function UsernameStatusPage({ params }: PageProps) {
  const { username, id } = await params;
  if (!/^\d+$/.test(id) || RESERVED.has(username.toLowerCase())) {
    notFound();
  }

  return (
    <>
      <StatusDownloadView username={username} tweetId={id} />
      <ContentSections />
    </>
  );
}
