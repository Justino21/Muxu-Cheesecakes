/**
 * Maps product IDs + size to Stripe Product IDs.
 *
 * These are Stripe Product IDs (prod_...) used with price_data in checkout.
 */
export const STRIPE_PRODUCT_MAP: Record<string, { productId: string; size?: string }[]> = {
  "classic-new-york": [
    { productId: "prod_U3CTfVp0gjSTLs", size: "Mediana" },
    { productId: "prod_U3CTQOCjPtTfaM", size: "Grande" },
  ],
  "white-chocolate": [
    { productId: "prod_U3CTpXysUJ23E8", size: "Mediana" },
    { productId: "prod_U3CTVy2b6NbQrR", size: "Grande" },
  ],
  lotus: [
    { productId: "prod_U3CT5CEeKeV0Al", size: "Mediana" },
    { productId: "prod_U3CT1AGp3qNKvV", size: "Grande" },
  ],
  oreo: [
    { productId: "prod_U3CTKwyTz3EUD2", size: "Mediana" },
    { productId: "prod_U3CTuvwLLzhV8J", size: "Grande" },
  ],
  pistachio: [
    { productId: "prod_U3CTVB7LeOCfBu", size: "Mediana" },
    { productId: "prod_U3CT4BjSskoLSb", size: "Grande" },
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
