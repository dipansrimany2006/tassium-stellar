import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
