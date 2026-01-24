"use client"

import { useEffect, useState } from "react"

export default function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded")

    if (hasLoaded) {
      setLoading(false)
      setIsInitialLoad(false)
      return
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5 // Faster progress increment
      })
    }, 20)

    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem("hasLoaded", "true")
    }, 600) // Reduced from 800ms to 600ms

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [])

  if (!loading || !isInitialLoad) return null

  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-square"></div>
        <div className="loader-text-professional">
          <span className="loader-void">VOID</span>
          <span className="loader-progress">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
