import { LandingPage, landingConfigs, metaFor } from "@/lib/landing-pages";

export const metadata = metaFor(landingConfigs.gifDownloader);

export default function Page() {
  return <LandingPage config={landingConfigs.gifDownloader} />;
}
