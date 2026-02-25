"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PRODUCTS, formatPrice } from "@/lib/products"
import { PaymentRequestButton } from "@/components/payment-request-button"

export function LimitedEditionCards({ onOrderNow }: { onOrderNow: (productId: string) => void }) {
  const limitedProducts = PRODUCTS.filter((p) => p.isLimitedEdition)
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 34,
    seconds: 22,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (limitedProducts.length === 0) return null

  return (
    <section id="limited" className="py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-balance">Holiday Limited Editions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Only for Christmas. Limited batches.</p>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-3 mb-10">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="bg-muted border border-border rounded-lg p-3 min-w-[70px]">
                <div className="font-serif text-3xl font-bold text-foreground">{String(value).padStart(2, "0")}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {limitedProducts.map((product) => (
            <div
              key={product.id}
              className="relative rounded-2xl overflow-hidden shadow-xl"
              style={{ backgroundColor: "#8A0F1F" }}
            >
              {/* Limited Edition Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: "#C9A227", color: "#1A0A0A" }}
                >
                  Only for Christmas
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-80">
                <Image
                  src={product.images?.[0] || "/placeholder.svg?height=400&width=600&query=holiday+cheesecake"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#8A0F1F] to-transparent" />
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4" style={{ color: "#FFF5E9" }}>
                <h3
                  className="font-serif text-3xl font-bold shimmer-text"
                  style={{ color: "#C9A227", textShadow: "0 0 10px rgba(201, 162, 39, 0.3)" }}
                >
                  {product.name}
                </h3>

                <p className="text-base leading-relaxed" style={{ color: "#FFF5E9" }}>
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.flavors?.map((flavor) => (
                    <span
                      key={flavor}
                      className="px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: "rgba(201, 162, 39, 0.2)",
                        borderColor: "#C9A227",
                        color: "#FFF5E9",
                      }}
                    >
                      {flavor}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-4xl font-bold" style={{ color: "#C9A227" }}>
                    {formatPrice(product.priceInCents)}
                  </span>
                </div>

                <div className="space-y-3">
                  <PaymentRequestButton productId={product.id} />
                  <Button
                    onClick={() => onOrderNow(product.id)}
                    className="w-full py-6 text-lg font-semibold rounded-full transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #C9A227 0%, #8A0F1F 100%)",
                      color: "#FFF5E9",
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>

                <p className="text-sm text-center" style={{ color: "#FFF5E9", opacity: 0.8 }}>
                  Limited quantities available. Ships within 2-3 business days.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
