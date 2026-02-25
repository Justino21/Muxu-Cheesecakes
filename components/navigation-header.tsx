"use client"

import { useState, useEffect } from "react"
import { Menu, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Header becomes sticky after first minimal scroll
      setIsSticky(window.scrollY > 30)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Header - becomes sticky after scroll */}
      <header
        className={cn(
          "fixed top-0 right-0 z-50 transition-all duration-500",
          isSticky
            ? "bg-background/95 backdrop-blur-sm shadow-md py-3 px-4 left-0"
            : "bg-transparent py-4 px-4 left-auto",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <div className={cn("flex items-center gap-3", isSticky ? "max-w-7xl mx-auto justify-end" : "justify-end")}>
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="gap-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline">Menu</span>
          </Button>

          {/* Cart Icon */}
          <Button variant="ghost" size="icon" className="relative" aria-label={`Shopping cart with ${cartCount} items`}>
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="max-w-md mx-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-3xl font-bold text-primary">MUXU</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="space-y-6" role="navigation" aria-label="Main navigation">
              <Link
                href="/flavours"
                className="block text-2xl font-medium hover:text-primary transition-colors focus:text-primary focus:outline-none"
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                All Flavours
              </Link>
              <Link
                href="/about"
                className="block text-2xl font-medium hover:text-primary transition-colors focus:text-primary focus:outline-none"
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-2xl font-medium hover:text-primary transition-colors focus:text-primary focus:outline-none"
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
