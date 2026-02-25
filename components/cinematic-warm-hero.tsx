"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useLenis } from "@/components/lenis-provider"
import { useLocale } from "@/contexts/locale-context"

const DEFAULT_FRAME_COUNT = 439
const TARGET_DURATION_MS = 3200
const PRELOAD_AHEAD = 60
const PRELOAD_INITIAL = 120

function frameUrlFor(max: number, i: number) {
  return `/hero-frames/frame_${String(Math.min(max, Math.max(0, i))).padStart(4, "0")}.jpg`
}

export function CinematicWarmHero() {
  const lenis = useLenis()
  const { t } = useLocale()
  const [frameCount, setFrameCount] = useState(DEFAULT_FRAME_COUNT)
  const [frameIndex, setFrameIndex] = useState(0)
  const [locked, setLocked] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const touchY = useRef(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number>(0)
  const frameIndexRef = useRef(0)
  const programmaticScrollRef = useRef(false)
  const img0Ref = useRef<HTMLImageElement>(null)
  const img1Ref = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subheaderRef = useRef<HTMLParagraphElement>(null)
  const lastDrawnFrameRef = useRef(-1)
  frameIndexRef.current = frameIndex

  const stopPlayback = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    setIsAnimating(false)
  }, [])

  const playToEnd = useCallback(() => {
    stopPlayback()
    const n = frameCount || 1
    const max = n - 1
    const startFrame = frameIndexRef.current
    if (startFrame >= max) return
    lastDrawnFrameRef.current = startFrame - 1
    setIsAnimating(true)
    const startTime = performance.now()
    const remaining = max - startFrame
    const duration = TARGET_DURATION_MS * (remaining / max)
    const run = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const i = Math.min(max, startFrame + Math.floor(progress * (remaining + 1)))
      frameIndexRef.current = i
      const maxStep = 2
      const step = Math.min(maxStep, Math.max(0, i - lastDrawnFrameRef.current))
      if (step > 0) {
        const drawFrame = lastDrawnFrameRef.current + step
        lastDrawnFrameRef.current = drawFrame
        const img0 = img0Ref.current
        const img1 = img1Ref.current
        const titleEl = titleRef.current
        const subEl = subheaderRef.current
        if (img0 && img1) {
          const showFirst = drawFrame % 2 === 0
          if (showFirst) {
            img0.style.opacity = "1"
            img1.style.opacity = "0"
            img0.style.zIndex = "1"
            img1.style.zIndex = "0"
            img0.src = frameUrlFor(max, drawFrame)
            img1.src = frameUrlFor(max, drawFrame + 1)
          } else {
            img0.style.opacity = "0"
            img1.style.opacity = "1"
            img0.style.zIndex = "0"
            img1.style.zIndex = "1"
            img0.src = frameUrlFor(max, drawFrame + 1)
            img1.src = frameUrlFor(max, drawFrame)
          }
        }
        const prog = drawFrame / Math.max(1, max)
        const to = prog < 0.06 ? 0 : prog > 0.18 ? 1 : (prog - 0.06) / 0.12
        const so = prog < 0.12 ? 0 : prog > 0.26 ? 1 : (prog - 0.12) / 0.14
        if (titleEl) {
          titleEl.style.opacity = String(to)
          titleEl.style.transform = `translateY(${12 * (1 - to)}px)`
        }
        if (subEl) {
          subEl.style.opacity = String(so)
          subEl.style.transform = `translateY(${10 * (1 - so)}px)`
        }
      }
      if (i >= max) {
        setFrameIndex(max)
        setIsAnimating(false)
        return
      }
      rafRef.current = requestAnimationFrame(run)
    }
    rafRef.current = requestAnimationFrame(run)
  }, [frameCount, stopPlayback])

  const playToStart = useCallback(() => {
    stopPlayback()
    const n = frameCount || 1
    const max = n - 1
    const startFrame = frameIndexRef.current
    if (startFrame <= 0) return
    lastDrawnFrameRef.current = startFrame + 1
    setIsAnimating(true)
    const startTime = performance.now()
    const duration = TARGET_DURATION_MS * (startFrame / max)
    const run = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const i = Math.max(0, startFrame - Math.floor(progress * (startFrame + 1)))
      frameIndexRef.current = i
      const maxStep = 2
      const step = Math.min(maxStep, Math.max(0, lastDrawnFrameRef.current - i))
      if (step > 0) {
        const drawFrame = lastDrawnFrameRef.current - step
        lastDrawnFrameRef.current = drawFrame
        const img0 = img0Ref.current
        const img1 = img1Ref.current
        const titleEl = titleRef.current
        const subEl = subheaderRef.current
        if (img0 && img1) {
          const showFirst = drawFrame % 2 === 0
          if (showFirst) {
            img0.style.opacity = "1"
            img1.style.opacity = "0"
            img0.style.zIndex = "1"
            img1.style.zIndex = "0"
            img0.src = frameUrlFor(max, drawFrame)
            img1.src = frameUrlFor(max, drawFrame + 1)
          } else {
            img0.style.opacity = "0"
            img1.style.opacity = "1"
            img0.style.zIndex = "0"
            img1.style.zIndex = "1"
            img0.src = frameUrlFor(max, drawFrame + 1)
            img1.src = frameUrlFor(max, drawFrame)
          }
        }
        const prog = drawFrame / Math.max(1, max)
        const to = prog < 0.06 ? 0 : prog > 0.18 ? 1 : (prog - 0.06) / 0.12
        const so = prog < 0.12 ? 0 : prog > 0.26 ? 1 : (prog - 0.12) / 0.14
        if (titleEl) {
          titleEl.style.opacity = String(to)
          titleEl.style.transform = `translateY(${12 * (1 - to)}px)`
        }
        if (subEl) {
          subEl.style.opacity = String(so)
          subEl.style.transform = `translateY(${10 * (1 - so)}px)`
        }
      }
      if (i <= 0) {
        setFrameIndex(0)
        setIsAnimating(false)
        if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      rafRef.current = requestAnimationFrame(run)
    }
    rafRef.current = requestAnimationFrame(run)
  }, [frameCount, stopPlayback])

  const scrollToNext = useCallback(() => {
    programmaticScrollRef.current = true
    const y = typeof window !== "undefined" ? window.innerHeight : 0
    if (lenis) {
      lenis.start()
      lenis.scrollTo(y, { lerp: 0.1 })
    } else {
      window.scrollTo({ top: y, behavior: "smooth" })
    }
    setTimeout(() => {
      programmaticScrollRef.current = false
    }, 600)
  }, [lenis])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    const onScroll = () => {
      const y = window.scrollY
      if (y < 10 && !programmaticScrollRef.current) lenis.stop()
      else if (y < 80 && locked) lenis.stop()
      else lenis.start()
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lenis, locked])

  useEffect(() => {
    const preloadLink = document.createElement("link")
    preloadLink.rel = "preload"
    preloadLink.as = "image"
    preloadLink.href = "/hero-frames/frame_0000.jpg"
    document.head.appendChild(preloadLink)

    fetch("/hero-frames/meta.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.frameCount ?? DEFAULT_FRAME_COUNT)
      .then((count) => {
        setFrameCount(count)
        setHeroReady(true)
        const preload = Math.min(PRELOAD_INITIAL, count)
        for (let k = 0; k < preload; k++) {
          const img = new Image()
          img.src = frameUrlFor(count - 1, k)
        }
      })
      .catch(() => setHeroReady(true))
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!locked && window.scrollY < 80) {
        setLocked(true)
        setFrameIndex(Math.max(0, (frameCount || 1) - 1))
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [locked, frameCount])

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (window.scrollY > 100) return
      if (!locked) return
      const max = (frameCount || 1) - 1
      if (e.deltaY > 0) {
        if (isAnimating) {
          e.preventDefault()
          return
        }
        if (frameIndex < max) {
          e.preventDefault()
          playToEnd()
        } else {
          e.preventDefault()
          setLocked(false)
          scrollToNext()
        }
      } else if (e.deltaY < 0) {
        if (isAnimating) {
          e.preventDefault()
          return
        }
        if (frameIndex > 0) {
          e.preventDefault()
          playToStart()
        } else if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }
    },
    [locked, frameIndex, frameCount, isAnimating, scrollToNext, playToEnd, playToStart]
  )

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchY.current = e.touches[0].clientY
  }, [])

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (window.scrollY > 100) return
      if (!locked) return
      const max = (frameCount || 1) - 1
      const dy = touchY.current - e.touches[0].clientY
      touchY.current = e.touches[0].clientY
      if (Math.abs(dy) < 15) return
      if (dy > 0) {
        if (isAnimating) {
          e.preventDefault()
          return
        }
        if (frameIndex < max) {
          e.preventDefault()
          playToEnd()
        } else {
          e.preventDefault()
          setLocked(false)
          scrollToNext()
        }
      } else if (dy < 0) {
        if (isAnimating) {
          e.preventDefault()
          return
        }
        if (frameIndex > 0) {
          e.preventDefault()
          playToStart()
        } else if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }
    },
    [locked, frameIndex, frameCount, isAnimating, scrollToNext, playToEnd, playToStart]
  )

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [onWheel])

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
    }
  }, [onTouchStart, onTouchMove])

  const useFrames = frameCount > 0
  const maxFrame = Math.max(0, (frameCount || 1) - 1)
  const showFirst = frameIndex % 2 === 0
  const src0 = showFirst ? frameUrlFor(maxFrame, frameIndex) : frameUrlFor(maxFrame, frameIndex + 1)
  const src1 = showFirst ? frameUrlFor(maxFrame, frameIndex + 1) : frameUrlFor(maxFrame, frameIndex)

  useEffect(() => {
    if (!useFrames || frameCount <= 0 || isAnimating) return
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
  }, [useFrames, frameCount, frameIndex, isAnimating])

  useEffect(() => {
    if (useFrames) return
    const video = videoRef.current
    if (!video) return
    const onTimeUpdate = () => {
      const d = video.duration
      if (d && Number.isFinite(d)) setVideoProgress(video.currentTime / d)
    }
    video.addEventListener("timeupdate", onTimeUpdate)
    return () => video.removeEventListener("timeupdate", onTimeUpdate)
  }, [useFrames])

  const progress = useFrames
    ? frameIndex / Math.max(1, frameCount - 1)
    : videoProgress
  const titleOpacity = progress < 0.06 ? 0 : progress > 0.18 ? 1 : (progress - 0.06) / 0.12
  const subheaderOpacity = progress < 0.12 ? 0 : progress > 0.26 ? 1 : (progress - 0.12) / 0.14

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      {useFrames ? (
        heroReady ? (
          <>
            <img
              ref={img0Ref}
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
              ref={img1Ref}
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
            ref={titleRef}
            className="space-y-0.5 md:space-y-1"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${12 * (1 - titleOpacity)}px)`,
              transition: isAnimating ? "none" : "opacity 0.7s ease, transform 0.7s ease",
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
            ref={subheaderRef}
            className="text-base md:text-2xl text-[#3f210c]/90 font-medium px-2"
            style={{
              fontFamily: "var(--font-hero), 'Playfair Display', Georgia, serif",
              opacity: subheaderOpacity,
              transform: `translateY(${10 * (1 - subheaderOpacity)}px)`,
              transition: isAnimating ? "none" : "opacity 0.7s ease, transform 0.7s ease",
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
