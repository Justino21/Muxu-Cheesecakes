"use client"

/**
 * Creates a Shopify checkout and returns the checkout URL
 * @param variantId - Shopify variant GID (e.g., "gid://shopify/ProductVariant/1234567890")
 * @param quantity - Quantity to add to cart (default: 1)
 * @returns Promise<string> - The checkout URL
 * @throws Error if checkout creation fails
 */
export async function createCheckout(variantId: string, quantity: number = 1): Promise<string> {
  if (!variantId) {
    throw new Error("variantId is required")
  }

  try {
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variantId,
        quantity,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))

      // Provide helpful error messages
      if (response.status === 500 && errorData.error?.includes("Shopify configuration")) {
        throw new Error(
          "Configuración de Shopify faltante. Por favor, añade SHOPIFY_DOMAIN y SHOPIFY_STOREFRONT_TOKEN a tu archivo .env.local. Consulta SHOPIFY_SETUP.md para más información.",
        )
      }

      throw new Error(errorData.error || `Error HTTP: ${response.status}`)
    }

    const data = await response.json()

    if (!data.checkoutUrl) {
      throw new Error("No checkout URL returned from server")
    }

    return data.checkoutUrl
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create checkout")
  }
}

/**
 * Creates a Shopify checkout from cart items and returns the checkout URL
 * @param items - Array of cart items with productId, size, and quantity
 * @returns Promise<string> - The checkout URL
 * @throws Error if checkout creation fails
 */
export async function createCartCheckout(
  items: Array<{ productId: string; size: string; quantity: number }>,
): Promise<string> {
  if (!items || items.length === 0) {
    throw new Error("Cart items are required")
  }

  try {
    const response = await fetch("/api/create-cart-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))

      // Provide helpful error messages
      if (response.status === 500 && errorData.error?.includes("Shopify configuration")) {
        throw new Error(
          "Configuración de Shopify faltante. Por favor, añade SHOPIFY_DOMAIN y SHOPIFY_STOREFRONT_TOKEN a tu archivo .env.local. Consulta SHOPIFY_SETUP.md para más información.",
        )
      }

      throw new Error(errorData.error || `Error HTTP: ${response.status}`)
    }

    const data = await response.json()

    if (!data.checkoutUrl) {
      throw new Error("No checkout URL returned from server")
    }

    return data.checkoutUrl
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create cart checkout")
  }
}

