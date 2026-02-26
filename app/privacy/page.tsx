"use client"

import { useEffect } from "react"
import HeaderWithLogo from "@/components/header-with-logo"
import { CinematicFooter } from "@/components/cinematic-footer"
import { useLenis } from "@/components/lenis-provider"
import { useLocale } from "@/contexts/locale-context"

const PDF_URL = "/Muxu_Privacy_Policy.pdf"

export default function PrivacyPage() {
  const lenis = useLenis()
  const { t } = useLocale()

  useEffect(() => {
    if (lenis) lenis.start()
  }, [lenis])

  return (
    <>
      <HeaderWithLogo />
      <main className="min-h-screen pt-20 md:pt-24 pb-12 bg-[#F0E2D0]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#3f210c]">
              {t("legal.privacyTitle")}
            </h1>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#3f210c] underline hover:no-underline"
            >
              {t("legal.openInNewTab")}
            </a>
          </div>
          <div className="bg-white/80 rounded-lg border border-[#3f210c]/10 overflow-hidden shadow-sm">
            <iframe
              src={`${PDF_URL}#toolbar=1`}
              title={t("legal.privacyTitle")}
              className="w-full min-h-[70vh] md:min-h-[80vh]"
            />
          </div>
        </div>
      </main>
      <CinematicFooter />
    </>
  )
}
