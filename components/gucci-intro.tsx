"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function GucciIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasFadedIn, setHasFadedIn] = useState(false)

  useEffect(() => {
    // Gentle fade-in + scale animation (350-400ms)
    const fadeInTimer = setTimeout(() => {
      setHasFadedIn(true)
    }, 50)

    // Auto-fade after 700ms if no scroll
    const autoFadeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 700)

    // Listen for any minimal scroll (20-40px) to immediately collapse
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(autoFadeTimer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#fdebea] transition-all duration-[350ms]",
        "pointer-events-none",
        hasFadedIn ? "opacity-100 scale-100" : "opacity-0 scale-95",
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <h1
        className="font-serif font-bold tracking-tight text-[#3f210c]"
        style={{
          fontSize: "clamp(3rem, 10vw, 7rem)",
          textShadow: "0 2px 12px rgba(234, 216, 200, 0.3)",
        }}
      >
        MUXU
      </h1>
    </div>
  )
}
