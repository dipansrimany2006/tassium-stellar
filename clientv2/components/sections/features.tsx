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
import BackgroundSquare from "../shared/background-square";

const iconMap = {
  Rocket,
  Cpu,
  Network,
  ShieldCheck,
  Globe,
  Search,
} as const;

/* Per-card visual content keyed by feature icon name */
function FeatureVisual({ icon }: { icon: string }) {
  switch (icon) {
    case "Rocket":
      return (
        <div className="relative w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
            <span className="text-[10px] font-mono text-text/50 uppercase tracking-wider">Live</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-text/60">git push origin main</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
              <span className="text-xs font-mono text-text/60">Building image...</span>
              <span className="ml-auto text-[10px] text-text/50">12s</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-text/60">Deployed to production</span>
              <span className="ml-auto text-[10px] text-emerald-400">Done</span>
            </div>
          </div>
        </div>
      );

    case "Cpu":
      return (
        <div className="flex gap-6 items-end">
          <div className="text-center">
            <div className="text-2xl font-bold tracking-tight text-text">amd64</div>
            <div className="mt-2 h-16 w-20 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-accent/50" />
            </div>
          </div>
          <div className="text-text/50 text-lg mb-6">+</div>
          <div className="text-center">
            <div className="text-2xl font-bold tracking-tight text-text">arm64</div>
            <div className="mt-2 h-16 w-20 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-accent/50" />
            </div>
          </div>
        </div>
      );

    case "Network":
      return (
        <div className="relative w-full h-full min-h-[120px]">
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <line x1="40" y1="30" x2="100" y2="60" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
            <line x1="160" y1="30" x2="100" y2="60" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
            <line x1="40" y1="30" x2="160" y2="30" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
            <line x1="100" y1="60" x2="60" y2="100" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
            <line x1="100" y1="60" x2="140" y2="100" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
            <line x1="60" y1="100" x2="140" y2="100" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
            {[[40, 30], [160, 30], [100, 60], [60, 100], [140, 100]].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="12" fill="rgba(214,239,255,0.06)" stroke="rgba(214,239,255,0.15)" strokeWidth="1" />
                <circle cx={cx} cy={cy} r="3" fill="rgba(214,239,255,0.5)" />
              </g>
            ))}
          </svg>
        </div>
      );

    case "ShieldCheck":
      return (
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono text-text/50 uppercase tracking-wider">TLS Certificates</span>
          </div>
          {["app.example.com", "api.example.com", "docs.example.com"].map((domain) => (
            <div key={domain} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <span className="text-xs font-mono text-text/60">{domain}</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">Secured</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "Globe":
      return (
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <Globe className="w-3.5 h-3.5 text-accent/50" />
            <span className="text-xs font-mono text-text/60">app.yoursite.com</span>
            <span className="ml-auto text-[10px] text-accent/60">A</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <Globe className="w-3.5 h-3.5 text-accent/50" />
            <span className="text-xs font-mono text-text/60">api.yoursite.com</span>
            <span className="ml-auto text-[10px] text-accent/60">CNAME</span>
          </div>
        </div>
      );

    case "Search":
      return (
        <div className="flex flex-wrap gap-2 justify-center">
          {["Node.js", "Python", "Go", "Bun", "Rust", "Ruby"].map((fw) => (
            <span
              key={fw}
              className="px-3 py-1.5 text-[11px] font-mono rounded-lg bg-white/[0.04] border border-white/[0.06] text-text/50"
            >
              {fw}
            </span>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* Bento grid layout: cards 0,3 are tall (row-span-2), rest are single */
const gridClasses = [
  "row-span-2",  // Rocket — tall left
  "",            // Cpu — short
  "row-span-2",  // Network — tall right (was ShieldCheck, swapped for visual balance)
  "row-span-2",  // ShieldCheck — tall
  "",            // Globe — short
  "",            // Search — short
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden min-h-[calc(100vh-200px)] max-w-8xl my-16 mx-16 px-6 py-12 rounded-4xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Everything You Need to Deploy
        </h2>
        <p className="mt-4 text-text/50 text-lg max-w-2xl mx-auto">
          From push to production in seconds. Built for developers who want
          control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        {features.map((feature, i) => (
          <Card
            key={feature.title}
            className={`group flex flex-col justify-between overflow-hidden rounded-3xl bg-bg-secondary/20 backdrop-blur-lg hover:-translate-y-1 transition-all duration-200 p-0! ${gridClasses[i] || ""}`}
          >
            <div className="relative flex-1 flex items-center justify-center p-6 overflow-hidden">
              <FeatureVisual icon={feature.icon} />
            </div>
            <div className="p-6 pt-0">
              <h3 className="text-lg font-semibold mb-1.5">{feature.title}</h3>
              <p className="text-sm text-text/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <BackgroundSquare size={400} angle={45} x="90%" y="20%" />
      <BackgroundSquare size={600} angle={-45} x="10%" y="80%" />
    </section>
  );
}
