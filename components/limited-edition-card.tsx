"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatPrice, type Product } from "@/lib/products"
import { PaymentRequestButton } from "@/components/payment-request-button"

interface LimitedEditionCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function LimitedEditionCard({ product, onAddToCart }: LimitedEditionCardProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
      style={{ backgroundColor: "#8A0F1F" }}
    >
      {/* Limited Edition Ribbon */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
          style={{
            backgroundColor: "#C9A227",
            color: "#1A0A0A",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Only for Christmas
        </span>
      </div>

      {/* Product Image */}
      <div className="relative h-64 md:h-72">
        <Image
          src={product.images?.[0] || "/placeholder.svg?height=400&width=600&query=holiday+cheesecake"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="eager"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#8A0F1F] via-[#8A0F1F]/30 to-transparent" />
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-4" style={{ color: "#FFF5E9" }}>
        <h3
          className="font-serif text-2xl md:text-3xl font-bold shimmer-gold"
          style={{
            color: "#C9A227",
            textShadow: "0 0 12px rgba(201, 162, 39, 0.4), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {product.name}
        </h3>

        <p className="text-sm md:text-base leading-relaxed" style={{ color: "#FFF5E9" }}>
          {product.description}
        </p>

        {/* Flavors */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.flavors.map((flavor) => (
              <span
                key={flavor}
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: "rgba(201, 162, 39, 0.15)",
                  borderColor: "#C9A227",
                  color: "#FFF5E9",
                }}
              >
                {flavor}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 pt-2">
          <span className="font-serif text-3xl md:text-4xl font-bold" style={{ color: "#C9A227" }}>
            {formatPrice(product.priceInCents)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <PaymentRequestButton productId={product.id} />
          <Button
            onClick={() => {
              onAddToCart(product.id)
              // Analytics tracking
              if (typeof window !== "undefined" && (window as any).gtag) {
                ;(window as any).gtag("event", "add_to_cart", {
                  items: [
                    {
                      item_id: product.id,
                      item_name: product.name,
                      price: product.priceInCents / 100,
                      quantity: 1,
                    },
                  ],
                  isLimited: true,
                })
              }
            }}
            size="lg"
            className="w-full py-6 text-base font-semibold rounded-full transition-all hover:scale-105 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #C9A227 0%, #B8942A 100%)",
              color: "#1A0A0A",
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
