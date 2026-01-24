import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ScrollAnimations from "@/components/ScrollAnimations"
import PageLoader from "@/components/PageLoader"
import PageTransition from "@/components/PageTransition"
import NavigationLoader from "@/components/NavigationLoader"
import SilkBackground from "@/components/SilkBackground"

const geistMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tassium - Distributed Container Deployment",
  description:
    "Self-hosted container deployment platform. Deploy from GitHub to your own infrastructure with one click. No vendor lock-in.",
  keywords: ["container", "deployment", "self-hosted", "docker", "kubernetes", "stellar", "distributed"],
  authors: [{ name: "Silone Labs" }],
  openGraph: {
    title: "Tassium - Distributed Container Deployment",
    description: "Self-hosted container deployment platform. Deploy from GitHub to your own infrastructure with one click.",
    type: "website",
    siteName: "Tassium",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tassium - Distributed Container Deployment",
    description: "Self-hosted container deployment platform. Deploy from GitHub to your own infrastructure with one click.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.className} font-sans antialiased`}>
        <SilkBackground />
        <PageLoader />
        <NavigationLoader />
        <PageTransition />
        {children}
        <ScrollAnimations />
        <Analytics />
      </body>
    </html>
  )
}
