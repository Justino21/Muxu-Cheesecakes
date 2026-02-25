/**
 * Maps product IDs to Shopify variant GIDs
 *
 * IMPORTANT: Replace these placeholder GIDs with your actual Shopify variant IDs.
 * You can find variant IDs in your Shopify admin:
 * Products > [Product] > Variants > Copy variant ID
 *
 * Format: "gid://shopify/ProductVariant/1234567890"
 */
export const SHOPIFY_VARIANT_MAP: Record<string, { variantId: string; size?: string }[]> = {
  "turron-cheesecake": [
    {
      variantId: "gid://shopify/ProductVariant/62782335484253",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62782335517021",
      size: "Grande",
    },
  ],
  "suchard-cheesecake": [
    {
      variantId: "gid://shopify/ProductVariant/62783265145181",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62783265177949",
      size: "Grande",
    },
  ],
  "classic-new-york": [
    {
      variantId: "gid://shopify/ProductVariant/62783394021725",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62783394054493",
      size: "Grande",
    },
  ],
  "white-chocolate": [
    {
      variantId: "gid://shopify/ProductVariant/62800560619869",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62800560652637",
      size: "Grande",
    },
  ],
  "lotus": [
    {
      variantId: "gid://shopify/ProductVariant/62789588812125",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62789588844893",
      size: "Grande",
    },
  ],
  "oreo": [
    {
      variantId: "gid://shopify/ProductVariant/62800608985437",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62800609018205",
      size: "Grande",
    },
  ],
  "pistachio": [
    {
      variantId: "gid://shopify/ProductVariant/62789783093597",
      size: "Mediana",
    },
    {
      variantId: "gid://shopify/ProductVariant/62789783126365",
      size: "Grande",
    },
  ],
}

/**
 * Gets the Shopify variant ID for a product
 * @param productId - The product ID from our system
 * @param size - Optional size to get specific variant (defaults to first variant)
 * @returns Shopify variant GID or null if not found
 */
export function getShopifyVariantId(productId: string, size?: string): string | null {
  const variants = SHOPIFY_VARIANT_MAP[productId]
  if (!variants || variants.length === 0) {
    return null
  }

  if (size) {
    const variant = variants.find((v) => v.size === size)
    const variantId = variant?.variantId || null
    // Check if it's a placeholder
    if ((variantId && variantId.includes("YOUR_")) || variantId.includes("PLACEHOLDER")) {
      return null
    }
    return variantId
  }

  // Return first variant as default
  const variantId = variants[0]?.variantId || null
  // Check if it's a placeholder
  if (variantId && (variantId.includes("YOUR_") || variantId.includes("PLACEHOLDER"))) {
    return null
  }
  return variantId
}

