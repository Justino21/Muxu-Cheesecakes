"use client"

import { useEffect } from "react"
import HeaderWithLogo from "@/components/header-with-logo"
import { CinematicFooter } from "@/components/cinematic-footer"
import { useLocale } from "@/contexts/locale-context"
import { useLenis } from "@/components/lenis-provider"

export default function AboutPage() {
  const { t } = useLocale()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.start()
    }
  }, [lenis])

  return (
    <>
      <HeaderWithLogo />

      <main className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-5 sm:px-6 bg-[#F0E2D0]">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-5 md:space-y-8">
            {["paragraph1", "paragraph2", "paragraph3", "paragraph4"].map((key) => (
              <p
                key={key}
                className="text-sm md:text-lg text-[#3f210c]/85 leading-relaxed text-center"
                style={{ fontFamily: "var(--font-seanos), 'The Seanos', serif" }}
              >
                {t(`voces.${key}`)}
              </p>
            ))}
          </div>

          <div className="mt-10 md:mt-16 text-center">
            <p className="font-serif text-xl md:text-3xl text-[#3f210c] font-semibold mb-1.5 md:mb-2">
              {t("voces.brandName")}
            </p>
            <p className="text-xs md:text-base text-[#3f210c]/70 italic tracking-wide">
              {t("voces.tagline")}
            </p>
          </div>
        </div>
      </main>

      <CinematicFooter />
    </>
  )
}
