"use client"

import { useEffect, useRef, useState } from "react"

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (!video || !container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.25 },
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[55vh] max-h-[70vh] h-[65vh] overflow-hidden bg-background"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster="/luxury-cheesecake-on-elegant-plate.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />

      {/* Centered tagline (below the large MUXU logo) */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "25vh" }}>
        <div className="text-center px-4 animate-fade-in-up">
          <p className="text-xl md:text-2xl text-foreground/90 font-light tracking-wide text-balance">
            Share a slice of joy.
          </p>
        </div>
      </div>
    </div>
  )
}
