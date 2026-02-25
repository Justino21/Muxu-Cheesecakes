"use client"

import { PRODUCTS } from "@/lib/products"
import { PaymentRequestButton } from "@/components/payment-request-button"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function LimitedEditionModule() {
  const limitedProducts = PRODUCTS.filter(
    (p) => p.isLimitedEdition && (p.id === "turron-cheesecake" || p.id === "suchard-cheesecake"),
  )

  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (productId: string) => {
    // Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "add_to_cart", {
        currency: "EUR",
        value: limitedProducts.find((p) => p.id === productId)?.price || 0,
        items: [
          {
            item_id: productId,
            item_name: limitedProducts.find((p) => p.id === productId)?.name,
            price: limitedProducts.find((p) => p.id === productId)?.price,
          },
        ],
        isLimited: true,
      })
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`py-8 md:py-12 px-4 bg-[#8A0F1F] relative overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* Subtle shimmer effect - respects prefers-reduced-motion */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none motion-reduce:hidden"
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(201, 162, 39, 0.3) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: "shimmer 8s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2
            className="font-serif text-3xl md:text-5xl font-bold mb-2 motion-reduce:animate-none"
            style={{
              color: "#C9A227",
              textShadow: "0 1px 3px rgba(0,0,0,0.5), 0 0 20px rgba(201,162,39,0.3)",
              animation: "shimmer-gold 4s ease-in-out infinite",
            }}
          >
            Limited Edition for Christmas
          </h2>
          <p className="text-[#FFF5E9] text-lg">Only available this holiday season</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {limitedProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-[#FFF5E9] rounded-lg overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(201,162,39,0.4)] transition-all duration-300 hover:scale-[1.02]"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Ribbon */}
              <div className="relative">
                <div className="absolute top-4 right-4 z-10 bg-[#C9A227] text-[#3f210c] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Only for Christmas
                </div>
                <div className="relative h-64 md:h-80">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#3f210c] mb-2">{product.name}</h3>
                <p className="text-[#3f210c]/70 text-lg italic mb-4">{product.tagline}</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-serif text-3xl font-bold text-[#8A0F1F]">€{product.price.toFixed(2)}</span>
                  <span className="text-sm text-[#3f210c]/60">per cheesecake</span>
                </div>

                <div className="space-y-3">
                  <PaymentRequestButton
                    productId={product.id}
                    amount={product.price * 100}
                    label={product.name}
                    className="w-full"
                  />
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-[#8A0F1F] hover:bg-[#6B0C18] text-white transition-all hover:scale-[1.03] hover:shadow-lg"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
