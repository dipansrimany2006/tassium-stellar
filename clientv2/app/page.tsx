import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/layout/footer";
import { BackgroundBeam } from "@/components/shared/background-beam";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <Hero />
      {/* <BackgroundBeam x="45%" y="-50%" pathLength="500px" color="#fff" delay={0} length={100} />
      <BackgroundBeam x="50%" y="-50%" pathLength="500px" color="#fff" delay={1} length={100} />
      <BackgroundBeam x="55%" y="-50%" pathLength="500px" color="#fff" delay={2} length={100} /> */}
      {/* <Logos /> */}
      <Features />
      {/* <HowItWorks /> */}
      <CTA />
      <Footer />
    </main>
  );
}
