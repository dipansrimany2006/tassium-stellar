export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold text-xs">T</span>
              </div>
              <span className="font-semibold text-text text-sm">Tassium</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Self-hosted container deployments. Open source, free forever.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {["Features", "How It Works", "Changelog"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
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
                { label: "Discord", href: "#" },
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

          {/* Legal */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {["Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Tassium. Open Source.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/silonelabs/tassium"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
