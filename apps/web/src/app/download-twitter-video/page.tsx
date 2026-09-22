import { LandingPage, landingConfigs, metaFor } from "@/lib/landing-pages";

export const metadata = metaFor(landingConfigs.twitterVideo);

export default function Page() {
  return <LandingPage config={landingConfigs.twitterVideo} />;
}
