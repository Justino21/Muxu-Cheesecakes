"use client"

import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8
    }
  }, [])

  return (
    <div className="relative w-full min-h-[55vh] max-h-[70vh] h-[65vh] overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster="/luxury-cheesecake-on-elegant-plate.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <div className="text-center px-4 animate-fade-in-up">
          <h1 className="font-serif text-7xl md:text-9xl font-bold tracking-tight text-foreground mb-6">MUXU</h1>
          <p className="text-xl md:text-2xl text-foreground/90 font-light max-w-2xl mx-auto text-balance">
            Share a slice of joy.
          </p>
        </div>
      </div>
    </div>
  )
}
