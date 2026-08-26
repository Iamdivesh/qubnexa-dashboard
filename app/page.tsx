import { ChapterRail } from "@/components/layout/ChapterRail";
import { Nav } from "@/components/layout/Nav";
import { StageLayer } from "@/components/layout/StageLayer";
import { Automate } from "@/components/sections/Automate";
import { Build } from "@/components/sections/Build";
import { Hero } from "@/components/sections/Hero";
import { Intelligence } from "@/components/sections/Intelligence";

export default function Home() {
  return (
    <>
      <StageLayer />
      <Nav />
      <ChapterRail />
      <main id="main" className="relative z-10">
        <Hero />
        <Build />
        <Automate />
        <Intelligence />
      </main>
    </>
  );
}
