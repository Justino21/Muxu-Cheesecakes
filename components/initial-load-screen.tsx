"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "muxu_initial_load_done"
const LOAD_DURATION_MS = 5000
const PRELOAD_FRAMES = 200

function preloadHeroFrames() {
  for (let k = 0; k < PRELOAD_FRAMES; k++) {
    const img = new Image()
    img.src = `/hero-frames/frame_${String(k).padStart(4, "0")}.jpg`
  }
}

export function InitialLoadScreen({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const alreadyDone = localStorage.getItem(STORAGE_KEY)
    if (alreadyDone === "1") {
      setReady(true)
      return
    }

    const start = performance.now()
    preloadHeroFrames()

    const tick = () => {
      const elapsed = performance.now() - start
      if (elapsed >= LOAD_DURATION_MS) {
        localStorage.setItem(STORAGE_KEY, "1")
        setReady(true)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [mounted])

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f5e8d8]">
        <div className="flex flex-col items-center gap-6">
          <div className="h-12 w-24 animate-pulse rounded bg-[#3f210c]/10" />
          <p className="font-serif text-lg text-[#3f210c]/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f5e8d8] px-6">
        <div className="flex flex-col items-center gap-8">
          <img
            src="/Muxu_Logo.png"
            alt="Muxu"
            className="h-20 w-auto object-contain md:h-24"
          />
          <p
            className="font-serif text-xl text-[#3f210c]/80 md:text-2xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Preparing your experience...
          </p>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-[#3f210c]/10">
            <div className="initial-load-bar h-full w-0 rounded-full bg-[#3f210c]/30" />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
