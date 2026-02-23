import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { PageLoader } from "@/components/shared/page-loader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tassium - Deploy to Your Infrastructure",
  description:
    "Self-hosted container deployment platform. Push to GitHub, deploy to your own servers. Multi-arch builds, Tailscale mesh, auto SSL. No vendor lock-in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.className} antialiased`}
      >
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
