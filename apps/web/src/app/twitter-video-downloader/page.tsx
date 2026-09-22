import { LandingPage, landingConfigs, metaFor } from "@/lib/landing-pages";

export const metadata = metaFor(landingConfigs.downloader);

export default function Page() {
  return <LandingPage config={landingConfigs.downloader} />;
}
