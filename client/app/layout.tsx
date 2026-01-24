import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ScrollAnimations from "@/components/ScrollAnimations"
import PageLoader from "@/components/PageLoader"
import PageTransition from "@/components/PageTransition"
import NavigationLoader from "@/components/NavigationLoader"
import SilkBackground from "@/components/SilkBackground"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VOID Studio - Stark Identity Studio",
  description:
    "Multidisciplinary design practice operating at the intersection of brutalist aesthetics and digital precision.",
  generator: "v0.app",
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
      <body className={`font-sans antialiased`}>
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
