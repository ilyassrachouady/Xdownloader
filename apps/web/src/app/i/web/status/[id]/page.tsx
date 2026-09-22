import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  StatusDownloadView,
  buildStatusMetadata,
} from "@/components/status-download-view";
import { ContentSections } from "@/components/content-sections";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Not found" };
  return buildStatusMetadata("i", id);
}

export default async function IWebStatusPage({ params }: PageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  return (
    <>
      <StatusDownloadView username="i" tweetId={id} />
      <ContentSections />
    </>
  );
}
