"use client"

import { useEffect, useRef, useState } from "react"

export function CappedHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay failed, that's okay
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.25 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden bg-[#EAD8C8]"
      style={{
        minHeight: "50vh",
        maxHeight: "65vh",
        height: "55vh",
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        autoPlay
        muted
        loop
        playsInline
        poster="/luxury-cheesecake-on-elegant-plate.jpg"
      >
        <source src="/elegant-cheesecake-slow-motion.jpg" type="video/mp4" />
      </video>

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h2
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-balance"
          style={{
            color: "#FFF5E9",
            textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          Handcrafted with Love
        </h2>
        <p
          className="text-lg md:text-xl max-w-2xl"
          style={{
            color: "#FFF5E9",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          Each cheesecake is a masterpiece, made fresh with premium ingredients
        </p>
      </div>
    </section>
  )
}
