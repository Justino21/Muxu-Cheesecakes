"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { type Product, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bestseller Badge */}
      {product.isBestseller && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          Bestseller
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-64 md:h-80 overflow-hidden bg-muted cursor-pointer">
          <Image
            src={product.images?.[0] || "/placeholder.svg?height=400&width=400&query=cheesecake"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-2xl font-bold mb-2 text-balance hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Flavors */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.flavors.slice(0, 3).map((flavor) => (
              <span key={flavor} className="text-xs px-3 py-1 bg-secondary/30 text-secondary-foreground rounded-full">
                {flavor}
              </span>
            ))}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-6">
          <span className="font-serif text-3xl font-bold">{formatPrice(product.priceInCents)}</span>
          <Button
            onClick={() => {
              onAddToCart(product.id)
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
                  isLimited: product.isLimitedEdition || false,
                })
              }
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 font-medium transition-all hover:scale-105"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
