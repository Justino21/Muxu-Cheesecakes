"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function LogoScaler() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let hasScrolled = false

    const handleScroll = () => {
      const scrollY = window.scrollY

      // On first minimal scroll (30px), trigger the shrink
      if (scrollY > 30 && !hasScrolled) {
        setIsScrolled(true)
        hasScrolled = true
      } else if (scrollY <= 30) {
        setIsScrolled(false)
        hasScrolled = false
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Large centered logo (visible when not scrolled) */}
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center pointer-events-none z-40 transition-all duration-500",
          isScrolled ? "opacity-0 translate-y-[-20px]" : "opacity-100 translate-y-0",
        )}
        style={{
          top: "20vh",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <h1
          className="font-serif font-bold tracking-tight text-foreground"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 9rem)",
            textShadow: "0 2px 20px rgba(0,0,0,0.1)",
          }}
        >
          MUXU
        </h1>
      </div>

      {/* Small top-left logo (visible after scroll) */}
      <div
        className={cn(
          "fixed top-4 left-4 z-50 transition-all duration-500",
          isScrolled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[-20px] pointer-events-none",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <span className="font-serif text-2xl md:text-3xl font-bold text-primary">MUXU</span>
      </div>
    </>
  )
}
