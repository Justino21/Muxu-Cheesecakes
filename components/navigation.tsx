"use client"

import { useState, useEffect } from "react"
import { Menu, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLogoSmall, setIsLogoSmall] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY > 50) {
        setIsScrolled(true)
        setIsLogoSmall(true)
      } else {
        setIsScrolled(false)
        setIsLogoSmall(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo (shrinks on scroll) */}
          <Link href="/" className="transition-all duration-300">
            <span
              className={`font-serif font-bold text-primary transition-all duration-300 ${
                isLogoSmall ? "text-2xl" : "text-4xl md:text-5xl"
              }`}
            >
              MUXU
            </span>
          </Link>

          {/* Right side: Menu + Cart */}
          <div className="flex items-center gap-4">
            {/* Menu Button */}
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="gap-2">
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">Menu</span>
            </Button>

            {/* Cart Icon */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="max-w-md mx-auto p-8">
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-3xl font-bold text-primary">MUXU</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="space-y-6">
              <Link
                href="#products"
                className="block text-2xl font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Flavours
              </Link>
              <Link
                href="#about"
                className="block text-2xl font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className="block text-2xl font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
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
