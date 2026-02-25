"use client"

import HeaderWithLogo from "@/components/header-with-logo"
import { CinematicFooter } from "@/components/cinematic-footer"
import { AllFlavoursGrid } from "@/components/all-flavours-grid"
import { useLocale } from "@/contexts/locale-context"

export default function FlavoursPage() {
  const { t } = useLocale()
  return (
    <>
      <HeaderWithLogo />

      <main className="min-h-screen">
        <div className="pt-32 pb-16">
          <div className="text-center mb-1 px-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-balance text-[#3f210c]">
              {t("flavours.pageTitle")}
            </h1>
            <div className="mx-auto h-[1px] w-64 md:w-96 bg-[#3A0215]/20 mb-4" />
            <p className="text-lg text-[#3f210c]/70 max-w-2xl mx-auto">
              {t("flavours.pageSubtitle")}
            </p>
          </div>

          {/* All Products Container */}
          <section className="py-16 md:py-24 px-4 bg-[#F5E8D8]">
            <div className="max-w-7xl mx-auto">
              <AllFlavoursGrid />
            </div>
          </section>
        </div>
      </main>

      <CinematicFooter />
    </>
  )
}
