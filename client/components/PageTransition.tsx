"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition() {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.opacity = "0"

    const timer = setTimeout(() => {
      document.body.style.opacity = "1"
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
