import { BackgroundAnimation } from "../reusable/backgroundAnimation";
import { Explore } from "./Explore";
import { Hero } from "./Hero";
import HowItWorksSection from "./how";

export function Home() {
  return (
    <>
      <BackgroundAnimation />
      <Hero />
      <Explore />
      <HowItWorksSection />
    </>
  );
}
