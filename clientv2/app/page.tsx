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
      {/* <BackgroundBeam x="25%" pathLength="500px" color="#fff" delay={0} length={300} />
      <BackgroundBeam x="50%" pathLength="500px" color="#fff" delay={1} length={300} />
      <BackgroundBeam x="75%" pathLength="500px" color="#fff" delay={2} length={300} />
      <BackgroundBeam x="10%" pathLength="500px" color="#fff" delay={3} length={300} />
      <BackgroundBeam x="30%" pathLength="500px" color="#fff" delay={4} length={300} />
      <BackgroundBeam x="70%" pathLength="500px" color="#fff" delay={5} length={300} />
      <BackgroundBeam x="90%" pathLength="500px" color="#fff" delay={6} length={300} /> */}
      {/* <Logos /> */}
      <Features />
      {/* <HowItWorks /> */}
      <CTA />
      <Footer />
    </main>
  );
}
