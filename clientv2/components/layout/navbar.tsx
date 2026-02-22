import { navLinks } from "@/constants/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/10 backdrop-blur-xs">
      <nav className="mx-16! flex h-24 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-text tracking-tight">
            Tassium
          </span>
        </Link>

        <div className="flex items-center gap-1 bg-linear-to-t from-bg-secondary to-bg-secondary/5 border-bg-secondary border rounded-2xl px-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-lg text-text hover:text-text/80 transition-colors"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button size="sm" href="https://app.tassium.io">
          Launch App
        </Button>
      </nav>
    </header>
  );
}
