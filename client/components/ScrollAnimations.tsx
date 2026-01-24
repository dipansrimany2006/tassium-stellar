"use client"

import { useEffect } from "react"

export default function ScrollAnimations() {
  useEffect(() => {
    // Simple Intersection Observer to trigger animations on scroll
    const observerOptions = {
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ;(entry.target as HTMLElement).style.animationPlayState = "running"
        }
      })
    }, observerOptions)

    document.querySelectorAll(".project-card, .service-row").forEach((el) => {
      ;(el as HTMLElement).style.animationPlayState = "paused"
      observer.observe(el)
    })

    // Smooth Parallax effect for grid items
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      document.querySelectorAll(".card-2, .card-3").forEach((el) => {
        const speed = 0.05
        ;(el as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`
      })
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return null
}
