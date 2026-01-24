"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function NavigationLoader() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 30)

    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 300)
    }, 500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <>
      <div className="page-transition-loader">
        <div className="loader-content">
          <div className="loader-square"></div>
          <div className="loader-text-professional">
            <span className="loader-void">Tassium</span>
            <span className="loader-progress">{progress}%</span>
          </div>
        </div>
      </div>
      {/* Top progress bar */}
      <div className="navigation-loader">
        <div className="nav-loader-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </>
  )
}
