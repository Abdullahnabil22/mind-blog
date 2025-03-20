import { BackgroundAnimation } from "../reusable/backgroundAnimation";
import { Explore } from "./Explore";
import { Hero } from "./Hero";

export function Home() {
  return (
    <>
      <BackgroundAnimation />
      <Hero />
      <Explore />
    </>
  );
}
