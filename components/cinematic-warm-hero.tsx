"use client"

import { useRef, useState, useEffect } from "react"
import { useLocale } from "@/contexts/locale-context"

export function CinematicWarmHero() {
  const { t } = useLocale()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTimeUpdate = () => {
      const d = video.duration
      if (d && Number.isFinite(d)) setProgress(video.currentTime / d)
    }
    const onLoadedMetadata = () => {
      const d = video.duration
      if (d && Number.isFinite(d)) setProgress(video.currentTime / d)
    }
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("loadedmetadata", onLoadedMetadata)
    onLoadedMetadata()
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
    }
  }, [])

  const titleOpacity = progress < 0.06 ? 0 : progress > 0.18 ? 1 : (progress - 0.06) / 0.12
  const subheaderOpacity = progress < 0.12 ? 0 : progress > 0.26 ? 1 : (progress - 0.12) / 0.14

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={(e) => {
          const v = e.currentTarget
          v.playbackRate = 0.85
          v.play().catch(() => {})
        }}
      >
        <source src="/Muxu_new_hero2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 flex items-center justify-center text-center px-5 sm:px-6 pointer-events-none">
        <div className="space-y-3 md:space-y-4">
          <div
            className="space-y-0.5 md:space-y-1"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${12 * (1 - titleOpacity)}px)`,
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <h1
              className="font-serif text-[clamp(2.25rem,7vw,5.5rem)] font-bold tracking-tight text-[#3f210c] leading-none"
              style={{
                textShadow:
                  "0 2px 20px rgba(255,255,255,0.4), 0 4px 30px rgba(0,0,0,0.2)",
              }}
            >
              MUXU
            </h1>
            <h1
              className="font-serif text-[clamp(2.25rem,7vw,5.5rem)] font-bold tracking-tight text-[#3f210c] leading-none"
              style={{
                textShadow:
                  "0 2px 20px rgba(255,255,255,0.4), 0 4px 30px rgba(0,0,0,0.2)",
              }}
            >
              CHEESECAKES
            </h1>
          </div>
          <p
            className="text-base md:text-2xl text-[#3f210c]/90 font-medium px-2"
            style={{
              fontFamily: "var(--font-hero), 'Playfair Display', Georgia, serif",
              opacity: subheaderOpacity,
              transform: `translateY(${10 * (1 - subheaderOpacity)}px)`,
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            {t("hero.subheader")}
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce"
        style={{
          fontFamily: "var(--font-hero), 'Playfair Display', Georgia, serif",
          animationDuration: "1.2s",
        }}
        aria-hidden
      >
        <p className="text-xs text-[#3f210c] uppercase tracking-wider">
          {t("hero.scroll")}
        </p>
        <span className="text-[#3f210c]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </section>
  )
}
