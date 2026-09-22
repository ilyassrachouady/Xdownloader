import { LandingPage, landingConfigs, metaFor } from "@/lib/landing-pages";

export const metadata = metaFor(landingConfigs.xVideo);

export default function Page() {
  return <LandingPage config={landingConfigs.xVideo} />;
}
