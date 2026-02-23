"use client";

import { navLinks } from "@/constants/nav";
import { Button } from "@/components/ui/button";
import { BookOpen, File, GitBranch } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  "book-open": <BookOpen size={16} />,
  github: <GitBranch size={16} />,
  "file-text": <File size={16} />,
};

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg/10 backdrop-blur-xs"
    >
      <nav className="mx-16! flex h-24 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/TASSIUM.png" alt="Tassium Logo" className="h-8 w-8" />
          <span className="font-semibold text-text tracking-tight">
            Tassium
          </span>
        </Link>

        <div className="flex items-center gap-5 bg-linear-to-t from-bg-secondary to-bg-secondary/5 border-bg-secondary border rounded-2xl px-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 text-lg text-text hover:text-text/80 transition-colors"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {iconMap[link.icon]}
              {link.label}
            </Link>
          ))}
        </div>

        <Button href="https://app.tassium.io">
          Launch App
        </Button>
      </nav>
    </motion.header>
  );
}
