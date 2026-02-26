"use client"

import { Instagram } from "lucide-react"
import { useLocale } from "@/contexts/locale-context"
import { getLegalPdfUrl } from "@/lib/legal-pdfs"

export function CinematicFooter() {
  const { t, locale } = useLocale()
  return (
    <footer className="relative bg-[#fdebea] border-t border-[#3f210c]/15 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3f210c]/20 to-transparent"
        aria-hidden
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 md:py-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center">
          {/* Left: Logo + Tagline */}
          <div>
            <h3 className="font-serif text-lg md:text-xl font-semibold mb-0.5 text-[#3f210c]">MUXU</h3>
            <p className="text-xs text-[#3f210c]/80">{t("footer.tagline")}</p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-5">
            <nav className="flex flex-wrap gap-4 md:gap-5">
              <a href="/about" className="text-xs text-[#3f210c]/90 hover:text-[#3f210c] transition-colors font-serif">
                {t("footer.aboutUs")}
              </a>
              <a
                href="/contact"
                className="text-xs text-[#3f210c]/90 hover:text-[#3f210c] transition-colors font-serif"
              >
                {t("footer.contact")}
              </a>
            </nav>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.instagram.com/muxu.cheesecakes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#3f210c]/10 hover:bg-[#3f210c]/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3 h-3 text-[#3f210c]" />
              </a>
              <a
                href="https://www.tiktok.com/@muxu.cheesecakes?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#3f210c]/10 hover:bg-[#3f210c]/20 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-3 h-3 text-[#3f210c]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/16192476644"
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 px-2 rounded-full bg-[#3f210c]/10 hover:bg-[#3f210c]/20 flex items-center gap-1 transition-colors"
                aria-label="WhatsApp USA"
              >
                <svg className="w-3 h-3 text-[#3f210c]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span className="text-[9px] font-medium text-[#3f210c]">USA</span>
              </a>
              <a
                href="https://wa.me/34603042080"
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 px-2 rounded-full bg-[#3f210c]/10 hover:bg-[#3f210c]/20 flex items-center gap-1 transition-colors"
                aria-label="WhatsApp España"
              >
                <svg className="w-3 h-3 text-[#3f210c]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span className="text-[9px] font-medium text-[#3f210c]">ES</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-[#3f210c]/15 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[#3f210c]/70">{t("footer.copyright")}</p>
          <nav className="flex gap-3">
            <a href={getLegalPdfUrl("terms", locale)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#3f210c]/70 hover:text-[#3f210c] transition-colors">
              {t("footer.terms")}
            </a>
            <a href={getLegalPdfUrl("privacy", locale)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#3f210c]/70 hover:text-[#3f210c] transition-colors">
              {t("footer.privacy")}
            </a>
            <a href={getLegalPdfUrl("cookies", locale)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#3f210c]/70 hover:text-[#3f210c] transition-colors">
              {t("footer.cookies")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

