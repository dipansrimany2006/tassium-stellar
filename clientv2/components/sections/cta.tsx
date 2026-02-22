import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/shared/glow-effect";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-32 px-6">
      <GlowEffect
        size="md"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Ready to Own Your Pipeline?
        </h2>
        <p className="mt-4 text-text/50 text-lg">
          Deploy your first app in under 5 minutes. Free forever, open source.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" href="https://app.tassium.io">
            Start Deploying
          </Button>
          <Button
            size="lg"
            variant="outline"
            href="/docs"
          >
            Read the Docs
          </Button>
        </div>
      </div>
    </section>
  );
}
