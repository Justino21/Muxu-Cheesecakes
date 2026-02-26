"use client"

import { useState, useEffect } from "react"
import { useLocale } from "@/contexts/locale-context"

const STORAGE_KEY = "muxu_consent_accepted"

const PDF_LINKS = [
  { href: "/Muxu_Terms_of_Use.pdf", key: "termsTitle" as const },
  { href: "/Muxu_Privacy_Policy.pdf", key: "privacyTitle" as const },
  { href: "/Muxu_Cookie_Policy.pdf", key: "cookiesTitle" as const },
]

export function ConsentBanner() {
  const { t } = useLocale()
  const [accepted, setAccepted] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    setAccepted(localStorage.getItem(STORAGE_KEY) === "true")
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setAccepted(true)
  }

  if (accepted === null || accepted) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3f210c]/85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="bg-[#F0E2D0] rounded-xl shadow-lg max-w-sm w-full p-5 text-center">
        <h2 id="consent-title" className="font-serif text-lg font-bold text-[#3f210c] mb-2">
          {t("legal.consentTitle")}
        </h2>
        <p className="text-sm text-[#3f210c]/80 mb-4">
          {t("legal.consentMessageShort")}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
          {PDF_LINKS.map(({ href, key }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#3f210c] hover:no-underline"
            >
              {t(`legal.${key}`)}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAccept}
          className="w-full py-2.5 rounded-full bg-[#fdebea] text-[#3f210c] text-sm font-medium border border-[#3f210c]/20 hover:opacity-90 transition-opacity"
        >
          {t("legal.consentAccept")}
        </button>
      </div>
    </div>
  )
}
