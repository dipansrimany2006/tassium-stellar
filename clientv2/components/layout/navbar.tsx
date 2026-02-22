import { navLinks } from "@/constants/nav";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-text tracking-tight">
            Tassium
          </span>
        </a>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm text-text-muted hover:text-text transition-colors"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button size="sm" href="https://app.tassium.io">
          Launch App
        </Button>
      </nav>
    </header>
  );
}
