import { features } from "@/constants/features";
import { Card } from "@/components/ui/card";
import {
  Rocket,
  Cpu,
  Network,
  ShieldCheck,
  Globe,
  Search,
} from "lucide-react";

const iconMap = {
  Rocket,
  Cpu,
  Network,
  ShieldCheck,
  Globe,
  Search,
} as const;

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Everything You Need to Deploy
        </h2>
        <p className="mt-4 text-text-muted text-lg max-w-xl mx-auto">
          From push to production in seconds. Built for developers who want
          control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <Card
              key={feature.title}
              className="group hover:-translate-y-1 transition-all duration-200"
            >
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
