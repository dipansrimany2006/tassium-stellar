"use client";

import { motion } from "motion/react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="border-t border-border"
    >
        <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-2 gap-8">
          {/* Brand */}
          <div className="flex flex-col justify-between">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/TASSIUM.png" alt="Tassium Logo" className="h-4 w-4" />
                <span className="font-semibold text-text text-sm">Tassium</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Self-hosted container deployments. Open source, free forever.
              </p>
            </div>
            <span className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Tassium. Open Source.
            </span>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Documentation", href: "/docs" },
                {
                  label: "GitHub",
                  href: "https://github.com/silonelabs/tassium",
                },
                { label: "Twitter", href: "https://x.com/sshtassium" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </motion.footer>
  );
}
