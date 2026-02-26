"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLocale } from "@/contexts/locale-context"

const STORAGE_KEY = "muxu_consent_accepted"

export function ConsentBanner() {
  const { t } = useLocale()
  const [accepted, setAccepted] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(STORAGE_KEY)
    setAccepted(stored === "true")
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setAccepted(true)
  }

  if (accepted === null || accepted) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3f210c]/90"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="bg-[#F0E2D0] rounded-2xl shadow-xl max-w-lg w-full p-6 md:p-8 border border-[#3f210c]/20">
        <h2
          id="consent-title"
          className="font-serif text-xl md:text-2xl font-bold text-[#3f210c] mb-3"
        >
          {t("legal.consentTitle")}
        </h2>
        <p className="text-sm md:text-base text-[#3f210c]/85 leading-relaxed mb-5">
          {t("legal.consentMessage")}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-6 text-sm">
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#3f210c] hover:no-underline font-medium"
          >
            {t("legal.termsTitle")}
          </Link>
          <span className="text-[#3f210c]/60">·</span>
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#3f210c] hover:no-underline font-medium"
          >
            {t("legal.privacyTitle")}
          </Link>
          <span className="text-[#3f210c]/60">·</span>
          <Link
            href="/cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#3f210c] hover:no-underline font-medium"
          >
            {t("legal.cookiesTitle")}
          </Link>
        </div>
        <button
          type="button"
          onClick={handleAccept}
          className="w-full py-3 px-4 rounded-full bg-[#fdebea] text-[#3f210c] font-medium border-2 border-[#3f210c]/15 hover:opacity-90 transition-opacity"
        >
          {t("legal.consentAccept")}
        </button>
      </div>
    </div>
  )
}
