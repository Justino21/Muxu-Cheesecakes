/**
 * Maps product IDs + size to Stripe Product IDs.
 *
 * These are Stripe Product IDs (prod_...) used with price_data in checkout.
 */
export const STRIPE_PRODUCT_MAP: Record<string, { productId: string; size?: string }[]> = {
  "classic-new-york": [
    { productId: "prod_U0HHNXDULeXr1b", size: "Mediana" },
    { productId: "prod_U0HifPKFWdVVJh", size: "Grande" },
  ],
  "white-chocolate": [
    { productId: "prod_U0HkOsSXXldAoP", size: "Mediana" },
    { productId: "prod_U0HmFHVuXVUSJk", size: "Grande" },
  ],
  lotus: [
    { productId: "prod_U0HnHsBK0HmfDY", size: "Mediana" },
    { productId: "prod_U0HnRKZa3jjjBc", size: "Grande" },
  ],
  oreo: [
    { productId: "prod_U0HpZTONZrWEaT", size: "Mediana" },
    { productId: "prod_U0HqVmxHpcsHZw", size: "Grande" },
  ],
  pistachio: [
    { productId: "prod_U0HsrrZAeTWZ9G", size: "Mediana" },
    { productId: "prod_U0HsGAjt2FBKrb", size: "Grande" },
  ],
}

/**
 * Returns the Stripe Product ID for a product + size, or null if not configured.
 */
export function getStripePriceId(productId: string, size?: string): string | null {
  const products = STRIPE_PRODUCT_MAP[productId]
  if (!products || products.length === 0) return null

  if (size) {
    const row = products.find((p) => p.size === size)
    return row?.productId ?? null
  }

  return products[0]?.productId ?? null
}
