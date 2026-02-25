"use client"

import { useRef, useState, useEffect } from "react"
import { useLenis } from "@/components/lenis-provider"
import { useLocale } from "@/contexts/locale-context"

const DEFAULT_FRAME_COUNT = 439
const PRELOAD_AHEAD = 80
const PRELOAD_INITIAL = 150

function frameUrlFor(max: number, i: number) {
  return `/hero-frames/frame_${String(Math.min(max, Math.max(0, i))).padStart(4, "0")}.jpg`
}

export function CinematicWarmHero() {
  const lenis = useLenis()
  const { t } = useLocale()
  const [frameCount, setFrameCount] = useState(DEFAULT_FRAME_COUNT)
  const [frameIndex, setFrameIndex] = useState(0)
  const [heroReady, setHeroReady] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastFrameRef = useRef(-1)

  const useFrames = frameCount > 0
  const maxFrame = Math.max(0, (frameCount || 1) - 1)

  // Scroll-driven frame: map scroll position to frame index (smooth scroll, no automated animation)
  useEffect(() => {
    const scrollRange = typeof window !== "undefined" ? window.innerHeight : 1080
    const updateFrame = (y: number) => {
      const progress = Math.min(1, Math.max(0, y / scrollRange))
      const newFrame = Math.round(progress * maxFrame)
      const clamped = Math.min(maxFrame, Math.max(0, newFrame))
      if (clamped !== lastFrameRef.current) {
        lastFrameRef.current = clamped
        setFrameIndex(clamped)
      }
    }

    if (lenis) {
      const unsub = lenis.on("scroll", () => updateFrame(lenis.scroll))
      updateFrame(lenis.scroll)
      return () => unsub()
    }
    const onScroll = () => updateFrame(window.scrollY)
    updateFrame(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [maxFrame, lenis])

  // Load meta and preload first frame before showing
  useEffect(() => {
    const preloadLink = document.createElement("link")
    preloadLink.rel = "preload"
    preloadLink.as = "image"
    preloadLink.href = "/hero-frames/frame_0000.jpg"
    document.head.appendChild(preloadLink)

    const metaPromise = fetch("/hero-frames/meta.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.frameCount ?? DEFAULT_FRAME_COUNT)

    const decodeFrame0 = new Promise<number>((resolve, reject) => {
      const img = new Image()
      img.onload = () => img.decode().then(() => resolve(0)).catch(reject)
      img.onerror = reject
      img.src = "/hero-frames/frame_0000.jpg"
    })

    const img1 = new Image()
    img1.src = "/hero-frames/frame_0001.jpg"

    Promise.all([metaPromise, decodeFrame0])
      .then(([count]) => {
        setFrameCount(count)
        setHeroReady(true)
        const preload = Math.min(PRELOAD_INITIAL, count)
        for (let k = 2; k < preload; k++) {
          const img = new Image()
          img.src = frameUrlFor(count - 1, k)
        }
      })
      .catch(() => setHeroReady(true))
  }, [])

  // Preload frames around current scroll-driven frame
  useEffect(() => {
    if (!useFrames || frameCount <= 0) return
    const max = frameCount - 1
    for (let k = 1; k <= PRELOAD_AHEAD; k++) {
      const next = frameIndex + k
      if (next <= max) {
        const img = new Image()
        img.src = frameUrlFor(max, next)
      }
      const prev = frameIndex - k
      if (prev >= 0) {
        const img = new Image()
        img.src = frameUrlFor(max, prev)
      }
    }
  }, [useFrames, frameCount, frameIndex])

  // Video fallback progress
  useEffect(() => {
    if (useFrames) return
    const video = videoRef.current
    if (!video) return
    const onTimeUpdate = () => {
      const d = video.duration
      if (d && Number.isFinite(d)) setVideoProgress(video.currentTime / d)
    }
    const onLoadedMetadata = () => {
      const d = video.duration
      if (d && Number.isFinite(d)) setVideoProgress(video.currentTime / d)
    }
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("loadedmetadata", onLoadedMetadata)
    onLoadedMetadata()
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
    }
  }, [useFrames])

  const progress = useFrames
    ? frameIndex / Math.max(1, maxFrame)
    : videoProgress
  const titleOpacity = progress < 0.06 ? 0 : progress > 0.18 ? 1 : (progress - 0.06) / 0.12
  const subheaderOpacity = progress < 0.12 ? 0 : progress > 0.26 ? 1 : (progress - 0.12) / 0.14

  const showFirst = frameIndex % 2 === 0
  const src0 = showFirst ? frameUrlFor(maxFrame, frameIndex) : frameUrlFor(maxFrame, frameIndex + 1)
  const src1 = showFirst ? frameUrlFor(maxFrame, frameIndex + 1) : frameUrlFor(maxFrame, frameIndex)

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: "200vh" }}>
      {/* Sticky viewport: hero stays fixed while user scrolls through the section */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {useFrames ? (
          heroReady ? (
            <>
              <img
                src={src0}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: showFirst ? 1 : 0,
                  zIndex: showFirst ? 1 : 0,
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
                fetchPriority="high"
                draggable={false}
              />
              <img
                src={src1}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: showFirst ? 0 : 1,
                  zIndex: showFirst ? 0 : 1,
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
                fetchPriority="high"
                draggable={false}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-black" aria-hidden />
          )
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={(e) => {
              e.currentTarget.playbackRate = 0.85
              e.currentTarget.play().catch(() => {})
            }}
          >
            <source src="/Muxu_new_hero2.mp4" type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 flex items-center justify-center text-center px-5 sm:px-6 pointer-events-none">
          <div className="space-y-3 md:space-y-4">
            <div
              className="space-y-0.5 md:space-y-1"
              style={{
                opacity: titleOpacity,
                transform: `translateY(${12 * (1 - titleOpacity)}px)`,
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
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
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
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
      </div>
    </section>
  )
}
