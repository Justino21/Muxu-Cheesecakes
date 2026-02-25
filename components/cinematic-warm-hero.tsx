"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useLenis } from "@/components/lenis-provider"
import { useLocale } from "@/contexts/locale-context"

const DEFAULT_FRAME_COUNT = 439
const TARGET_DURATION_MS = 3200 // full sequence in 3.2 seconds
const PRELOAD_AHEAD = 40 // preload this many frames ahead
const PRELOAD_INITIAL = 80 // preload first N frames on mount for smooth start

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
  const hasScrolledPastRef = useRef(false)
  const programmaticScrollRef = useRef(false)
  const img0Ref = useRef<HTMLImageElement>(null)
  const img1Ref = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subheaderRef = useRef<HTMLParagraphElement>(null)
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
    setIsAnimating(true)
    const startTime = performance.now()
    const remaining = max - startFrame
    const duration = TARGET_DURATION_MS * (remaining / max)
    const run = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const i = Math.min(max, startFrame + Math.floor(progress * (remaining + 1)))
      frameIndexRef.current = i
      const img0 = img0Ref.current
      const img1 = img1Ref.current
      const titleEl = titleRef.current
      const subEl = subheaderRef.current
      if (img0 && img1) {
        const showFirst = i % 2 === 0
        const url = frameUrlFor(max, i)
        const urlNext = frameUrlFor(max, i + 1)
        if (showFirst) {
          img0.src = url
          img1.src = urlNext
          img0.style.opacity = "1"
          img1.style.opacity = "0"
          img0.style.zIndex = "1"
          img1.style.zIndex = "0"
        } else {
          img0.src = urlNext
          img1.src = url
          img0.style.opacity = "0"
          img1.style.opacity = "1"
          img0.style.zIndex = "0"
          img1.style.zIndex = "1"
        }
      }
      const prog = i / Math.max(1, max)
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
    setIsAnimating(true)
    const startTime = performance.now()
    const duration = TARGET_DURATION_MS * (startFrame / max)
    const run = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const i = Math.max(0, startFrame - Math.floor(progress * (startFrame + 1)))
      frameIndexRef.current = i
      const img0 = img0Ref.current
      const img1 = img1Ref.current
      const titleEl = titleRef.current
      const subEl = subheaderRef.current
      if (img0 && img1) {
        const showFirst = i % 2 === 0
        const url = frameUrlFor(max, i)
        const urlNext = frameUrlFor(max, i + 1)
        if (showFirst) {
          img0.src = url
          img1.src = urlNext
          img0.style.opacity = "1"
          img1.style.opacity = "0"
          img0.style.zIndex = "1"
          img1.style.zIndex = "0"
        } else {
          img0.src = urlNext
          img1.src = url
          img0.style.opacity = "0"
          img1.style.opacity = "1"
          img0.style.zIndex = "0"
          img1.style.zIndex = "1"
        }
      }
      const prog = i / Math.max(1, max)
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
      if (i <= 0) {
        setFrameIndex(0)
        setIsAnimating(false)
        if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        return
      }
      rafRef.current = requestAnimationFrame(run)
    }
    rafRef.current = requestAnimationFrame(run)
  }, [frameCount, stopPlayback])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

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

  // Stop Lenis so hero can capture wheel events for the frame animation.
  // When at the very top or in hero zone, stop Lenis to allow custom scroll handling.
  useEffect(() => {
    if (!lenis) return
    const onScroll = () => {
      const y = window.scrollY
      // At very top - reset state and stop Lenis
      if (y < 10 && !programmaticScrollRef.current) {
        hasScrolledPastRef.current = false
        lenis.stop()
      } 
      // In hero zone (< 80px) - stop Lenis if we're locked (returned to hero)
      else if (y < 80 && locked) {
        lenis.stop()
      } 
      // Outside hero zone - let Lenis handle scrolling
      else {
        lenis.start()
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lenis, locked])

  // Cold load: preload frame 0 in head, then decode frame 0 (and 1) before showing hero
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
      img.onload = () => {
        img.decode().then(() => resolve(0)).catch(reject)
      }
      img.onerror = reject
      img.src = "/hero-frames/frame_0000.jpg"
    })

    // Preload frame 1 in parallel (don't block hero on it)
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
      .catch(() => {
        setHeroReady(true)
      })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!locked && window.scrollY < 80) {
        setLocked(true)
        // Keep the frame at the last position - rewind will happen when user scrolls up
        setFrameIndex(Math.max(0, (frameCount || 1) - 1))
      }
      // When we reach the very top, reset frame to start
      if (window.scrollY === 0 && frameIndex === 0) {
        hasScrolledPastRef.current = false
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [locked, frameCount, frameIndex])

  const onWheel = useCallback(
    (e: WheelEvent) => {
      // Only capture wheel when near the top of the page
      if (window.scrollY > 100) return
      if (!locked) return
      
      const n = frameCount || 1
      const max = n - 1
      
      // Scrolling down
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
      } 
      // Scrolling up - rewind the video
      else if (e.deltaY < 0) {
        if (isAnimating) {
          e.preventDefault()
          return
        }
        if (frameIndex > 0) {
          e.preventDefault()
          playToStart()
        } else if (window.scrollY > 0) {
          // Frame is at 0, allow scrolling to top of page
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
      // Only capture touch when near the top of the page
      if (window.scrollY > 100) return
      if (!locked) return
      
      const n = frameCount || 1
      const max = n - 1
      const dy = touchY.current - e.touches[0].clientY
      touchY.current = e.touches[0].clientY
      
      // Require minimum swipe distance (reduced for better mobile responsiveness)
      if (Math.abs(dy) < 15) return
      
      // Swiping up (scrolling down) - play forward
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
      } 
      // Swiping down (scrolling up) - rewind
      else if (dy < 0) {
        if (isAnimating) {
          e.preventDefault()
          return
        }
        if (frameIndex > 0) {
          e.preventDefault()
          playToStart()
        } else if (window.scrollY > 0) {
          // Frame is at 0, allow scrolling to top of page
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

  // Preload nearby frames when idle (not during animation)
  useEffect(() => {
    if (!useFrames || frameCount <= 0 || isAnimating) return
    const max = frameCount - 1
    for (let k = 1; k <= PRELOAD_AHEAD; k++) {
      const next = frameIndex + k
      if (next > max) break
      const img = new Image()
      img.src = frameUrlFor(max, next)
    }
    for (let k = 1; k <= PRELOAD_AHEAD; k++) {
      const prev = frameIndex - k
      if (prev < 0) break
      const img = new Image()
      img.src = frameUrlFor(max, prev)
    }
  }, [useFrames, frameCount, frameIndex, isAnimating])

  // Video progress 0..1 for text transition (when using video fallback)
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
              className="absolute inset-0 w-full h-full object-cover"
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
              className="absolute inset-0 w-full h-full object-cover"
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
          className="absolute inset-0 w-full h-full object-cover"
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
              fontFamily:
                "var(--font-hero), 'Playfair Display', Georgia, serif",
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
