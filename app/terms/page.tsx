"use client"

import { useEffect } from "react"
import HeaderWithLogo from "@/components/header-with-logo"
import { CinematicFooter } from "@/components/cinematic-footer"
import { useLenis } from "@/components/lenis-provider"
import { useLocale } from "@/contexts/locale-context"

const PDF_URL = "/Muxu_Terms_of_Use.pdf"

export default function TermsPage() {
  const lenis = useLenis()
  const { t } = useLocale()

  useEffect(() => {
    if (lenis) lenis.start()
  }, [lenis])

  return (
    <>
      <HeaderWithLogo />
      <main className="min-h-screen pt-20 md:pt-24 pb-12 bg-[#F0E2D0]">
        <div className="max-w-xl mx-auto px-5 sm:px-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#3f210c] mb-3">
            {t("legal.termsTitle")}
          </h1>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#3f210c] font-medium underline hover:no-underline"
          >
            {t("legal.openInNewTab")}
          </a>
        </div>
      </main>
      <CinematicFooter />
    </>
  )
}
