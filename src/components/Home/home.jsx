import { BackgroundAnimation } from "../reusable/backgroundAnimation";
import { Explore } from "./Explore";
import { MainFooter } from "./Footer";
import { Hero } from "./Hero";
import HowItWorksSection from "./how";
import { AiSupport } from "./AiSupport";

export function Home() {
  return (
    <>
      <BackgroundAnimation />
      <Hero />
      <Explore />
      <AiSupport />
      <HowItWorksSection />
      <MainFooter />
    </>
  );
}
