import { ChapterRail } from "@/components/layout/ChapterRail";
import { Nav } from "@/components/layout/Nav";
import { StageLayer } from "@/components/layout/StageLayer";
import { Automate } from "@/components/sections/Automate";
import { Build } from "@/components/sections/Build";
import { ConnectedSystems } from "@/components/sections/ConnectedSystems";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Grow } from "@/components/sections/Grow";
import { Hero } from "@/components/sections/Hero";
import { Intelligence } from "@/components/sections/Intelligence";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";

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
        <Grow />
        <ConnectedSystems />
        <Services />
        <Process />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
