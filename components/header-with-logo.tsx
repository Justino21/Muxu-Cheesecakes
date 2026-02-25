"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useLocale } from "@/contexts/locale-context"
import LanguageSelector from "@/components/language-selector"

function HeaderWithLogo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const { getTotalItems, openCart } = useCart()
  const { t } = useLocale()
  const cartCount = getTotalItems()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 30)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,padding] duration-500",
        isSticky ? "bg-[#F5E8D8] py-3 px-3 sm:px-4" : "bg-transparent py-4 px-3 sm:px-4",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Spacer for balance */}
        <div className="w-20 md:w-24" />

        {/* Centered MUXU */}
        <Link
          href="/"
          className="absolute left-1/2 transform -translate-x-1/2 font-serif text-2xl md:text-3xl font-bold text-[#3f210c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f210c] rounded px-2"
        >
          MUXU
        </Link>

        {/* Right side: Language + Menu + Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector />

          {/* Menu with dropdown */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="gap-2 text-[#3f210c] hover:text-[#3f210c]/70 hover:bg-[#EAD8C8]/20"
              aria-label={t("header.openMenu")}
              aria-expanded={isMenuOpen}
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">{t("header.menu")}</span>
            </Button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-[#fdebea] border border-[#3f210c]/15 rounded-xl shadow-lg overflow-hidden"
                role="menu"
              >
                <nav className="py-2" role="navigation" aria-label="Main navigation">
                  <Link
                    href="/"
                    className="block px-4 py-2.5 text-sm font-medium text-[#3f210c] hover:bg-[#3f210c]/10 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    {t("header.home")}
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2.5 text-sm font-medium text-[#3f210c] hover:bg-[#3f210c]/10 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    {t("header.aboutUs")}
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2.5 text-sm font-medium text-[#3f210c] hover:bg-[#3f210c]/10 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    {t("header.contact")}
                  </Link>
                </nav>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-[#3f210c] hover:text-[#3f210c]/70 hover:bg-[#EAD8C8]/20"
            aria-label={t("header.cartWithCount", { count: cartCount })}
            onClick={openCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3f210c] text-[#fdebea] text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default HeaderWithLogo
