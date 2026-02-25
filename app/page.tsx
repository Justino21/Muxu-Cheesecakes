"use client"

import { useEffect } from "react"
import { TopBrandBar } from "@/components/top-brand-bar"
import HeaderWithLogo from "@/components/header-with-logo"
import { CinematicWarmHeroCanvas } from "@/components/cinematic-warm-hero-canvas"
import { CinematicHolidayGallery } from "@/components/cinematic-holiday-gallery"
import { CinematicPremiumFlavours } from "@/components/cinematic-premium-flavours"
import { CinematicVocesNavidad } from "@/components/cinematic-voces-navidad"
import { CinematicComoFunciona } from "@/components/cinematic-como-funciona"
import { CinematicFooter } from "@/components/cinematic-footer"

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "view_home", {
        page_title: "Muxu Cheesecake Home",
        page_location: window.location.href,
      })
    }
  }, [])

  return (
    <>
      <TopBrandBar />
      <HeaderWithLogo />

      <main className="min-h-screen">
        {/* 1. Hero - Cinematic Warm Christmas Film */}
        <CinematicWarmHeroCanvas />

        {/* 2. Momentos Muxu - Cinematic Holiday Gallery */}
        <CinematicHolidayGallery />

        {/* 3. Nuestros Sabores - Cozy Editorial Grid */}
        <CinematicPremiumFlavours />

        {/* 4. Voces de Navidad - Emotional Quotes */}
        <CinematicVocesNavidad />

        {/* 5. Cómo funciona - Minimal Warm Flow */}
        <CinematicComoFunciona />
      </main>

      {/* 6. Footer - Cozy & Elegant */}
      <CinematicFooter />
    </>
  )
}
