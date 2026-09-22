import { LandingPage, landingConfigs, metaFor } from "@/lib/landing-pages";

export const metadata = metaFor(landingConfigs.liveDownloader);

export default function Page() {
  return <LandingPage config={landingConfigs.liveDownloader} />;
}
