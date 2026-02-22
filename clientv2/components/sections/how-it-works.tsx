import { steps } from "@/constants/steps";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-6 py-24 border-t border-border"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Deploy in Four Steps
        </h2>
        <p className="mt-4 text-text-muted text-lg max-w-xl mx-auto">
          From repository to running application in under a minute.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.step} className="relative flex flex-col items-center text-center">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-accent/40 to-border" />
            )}

            {/* Step number */}
            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-accent/40 bg-bg text-accent font-mono text-sm font-bold mb-4">
              {step.step}
            </div>

            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed max-w-[200px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
