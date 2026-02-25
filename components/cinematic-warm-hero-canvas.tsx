"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useLenis } from "@/components/lenis-provider"
import { useLocale } from "@/contexts/locale-context"

const DEFAULT_FRAME_COUNT = 439
const TARGET_DURATION_MS = 3200
const CACHE_SIZE = 80
const LOAD_AHEAD = 45

function frameUrl(max: number, i: number) {
  return `/hero-frames/frame_${String(Math.min(max, Math.max(0, i))).padStart(4, "0")}.jpg`
}

export function CinematicWarmHeroCanvas() {
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
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const frameIndexRef = useRef(0)
  const hasScrolledPastRef = useRef(false)
  const programmaticScrollRef = useRef(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const subheaderRef = useRef<HTMLParagraphElement>(null)
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map())
  const loadingRef = useRef<Set<number>>(new Set())
  const animStartTimeRef = useRef(0)
  const animStartFrameRef = useRef(0)
  const animForwardRef = useRef(true)
  const isAnimatingRef = useRef(false)
  frameIndexRef.current = frameIndex
  isAnimatingRef.current = isAnimating

  const maxFrame = Math.max(0, (frameCount || 1) - 1)

  const stopPlayback = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    setIsAnimating(false)
  }, [])

  const playToEnd = useCallback(() => {
    stopPlayback()
    if (frameIndexRef.current >= maxFrame) return
    setIsAnimating(true)
    animStartTimeRef.current = performance.now()
    animStartFrameRef.current = frameIndexRef.current
    animForwardRef.current = true
  }, [frameCount, stopPlayback, maxFrame])

  const playToStart = useCallback(() => {
    stopPlayback()
    if (frameIndexRef.current <= 0) return
    setIsAnimating(true)
    animStartTimeRef.current = performance.now()
    animStartFrameRef.current = frameIndexRef.current
    animForwardRef.current = false
  }, [frameCount, stopPlayback, maxFrame])

  const scrollToNext = useCallback(() => {
    hasScrolledPastRef.current = true
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
      if (y < 10 && !programmaticScrollRef.current) {
        hasScrolledPastRef.current = false
        lenis.stop()
      } else if (y < 80 && locked) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lenis, locked])

  useEffect(() => {
    fetch("/hero-frames/meta.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const count = d?.frameCount ?? DEFAULT_FRAME_COUNT
        setFrameCount(count)
        setHeroReady(true)
      })
      .catch(() => setHeroReady(true))
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!isAnimating) frameIndexRef.current = frameIndex
  }, [frameIndex, isAnimating])

  useEffect(() => {
    const onScroll = () => {
      if (!locked && window.scrollY < 80) {
        setLocked(true)
        setFrameIndex(Math.max(0, (frameCount || 1) - 1))
      }
      if (window.scrollY === 0 && frameIndex === 0) {
        hasScrolledPastRef.current = false
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [locked, frameCount, frameIndex])

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

  useEffect(() => {
    if (!useFrames || !heroReady || maxFrame < 0) return
    const cache = cacheRef.current
    const loading = loadingRef.current

    function loadFrame(i: number) {
      if (i < 0 || i > maxFrame || cache.has(i) || loading.has(i)) return
      loading.add(i)
      const img = new Image()
      img.onload = () => {
        loading.delete(i)
        cache.set(i, img)
        while (cache.size > CACHE_SIZE) {
          const current = frameIndexRef.current
          let bestKey = -1
          let bestDist = -1
          cache.forEach((_, key) => {
            const dist = Math.abs(key - current)
            if (bestKey === -1 || dist > bestDist) {
              bestKey = key
              bestDist = dist
            }
          })
          if (bestKey >= 0) cache.delete(bestKey)
        }
      }
      img.onerror = () => loading.delete(i)
      img.src = frameUrl(maxFrame, i)
    }

    // Load first frames immediately so first paint isn't black
    loadFrame(0)
    loadFrame(1)
    const interval = setInterval(() => {
      const current = frameIndexRef.current
      for (let k = 0; k <= LOAD_AHEAD; k++) {
        loadFrame(current + k)
        if (current - k >= 0) loadFrame(current - k)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [useFrames, heroReady, maxFrame])

  useEffect(() => {
    if (!useFrames || !heroReady || maxFrame < 0) return
    const cache = cacheRef.current

    function getClosestFrame(want: number): number {
      if (cache.has(want)) return want
      for (let d = 1; d <= maxFrame; d++) {
        if (cache.has(want - d)) return want - d
        if (cache.has(want + d)) return want + d
      }
      return 0
    }

    function draw() {
      const container = containerRef.current
      const canvas = canvasRef.current
      if (!container || !canvas) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      if (w <= 0 || h <= 0) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      let current = frameIndexRef.current
      if (isAnimatingRef.current) {
        const elapsed = performance.now() - animStartTimeRef.current
        const start = animStartFrameRef.current
        if (animForwardRef.current) {
          const remaining = maxFrame - start
          const duration = TARGET_DURATION_MS * (remaining / maxFrame)
          const progress = Math.min(1, elapsed / duration)
          current = Math.min(maxFrame, start + Math.floor(progress * (remaining + 1)))
          frameIndexRef.current = current
          if (current >= maxFrame) {
            setFrameIndex(maxFrame)
            setIsAnimating(false)
          }
        } else {
          const duration = TARGET_DURATION_MS * (start / maxFrame)
          const progress = Math.min(1, elapsed / duration)
          current = Math.max(0, start - Math.floor(progress * (start + 1)))
          frameIndexRef.current = current
          if (current <= 0) {
            setFrameIndex(0)
            setIsAnimating(false)
            if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" })
          }
        }
      } else {
        current = frameIndexRef.current
      }

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, w, h)
        const img = cache.get(getClosestFrame(current))
        if (img && img.complete && img.naturalWidth) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"
          const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
          const sw = img.naturalWidth
          const sh = img.naturalHeight
          const sx = (sw - w / scale) / 2
          const sy = (sh - h / scale) / 2
          ctx.drawImage(img, sx, sy, w / scale, h / scale, 0, 0, w, h)
        }
      }

      const prog = current / Math.max(1, maxFrame)
      const to = prog < 0.06 ? 0 : prog > 0.18 ? 1 : (prog - 0.06) / 0.12
      const so = prog < 0.12 ? 0 : prog > 0.26 ? 1 : (prog - 0.12) / 0.14
      if (titleRef.current) {
        titleRef.current.style.opacity = String(to)
        titleRef.current.style.transform = `translateY(${12 * (1 - to)}px)`
      }
      if (subheaderRef.current) {
        subheaderRef.current.style.opacity = String(so)
        subheaderRef.current.style.transform = `translateY(${10 * (1 - so)}px)`
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [useFrames, heroReady, maxFrame, frameCount])

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
    <section
      ref={containerRef}
      className="relative h-dvh w-full overflow-hidden bg-black"
    >
      {useFrames ? (
        heroReady ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ display: "block" }}
          />
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
              transition: isAnimating ? "none" : "opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
              transition: isAnimating ? "none" : "opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
