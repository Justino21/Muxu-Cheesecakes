"use client"

/**
 * Creates a Stripe Checkout session and returns the checkout URL.
 * Uses Stripe Product ID + amount (price_data); no separate Price IDs needed.
 *
 * @param stripeProductId - Stripe Product ID (from getStripeProductId(productId, size))
 * @param quantity - Quantity (default 1)
 * @param unitAmountCents - Price in cents (e.g. 2900 for 29€)
 */
export async function createCheckout(
  stripeProductId: string,
  quantity: number = 1,
  unitAmountCents: number,
): Promise<string> {
  if (!stripeProductId) {
    throw new Error("stripeProductId is required")
  }
  if (unitAmountCents == null || unitAmountCents < 0) {
    throw new Error("unitAmountCents is required")
  }

  const response = await fetch("/api/create-stripe-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stripeProductId,
      quantity,
      unit_amount: unitAmountCents,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(data.error || `Error: ${response.status}`)
  }

  const data = await response.json()
  if (!data.checkoutUrl) {
    throw new Error("No checkout URL returned")
  }

  return data.checkoutUrl
}

/**
 * Creates a Stripe Checkout session for multiple cart items.
 *
 * @param items - Array of { stripeProductId, quantity, unit_amount } (unit_amount in cents)
 */
export async function createCartCheckout(
  items: Array<{ stripeProductId: string; quantity: number; unit_amount: number }>,
): Promise<string> {
  if (!items?.length) {
    throw new Error("Cart items are required")
  }

  const response = await fetch("/api/create-stripe-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lineItems: items.map((i) => ({
        stripeProductId: i.stripeProductId,
        quantity: i.quantity || 1,
        unit_amount: i.unit_amount,
      })),
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(data.error || `Error: ${response.status}`)
  }

  const data = await response.json()
  if (!data.checkoutUrl) {
    throw new Error("No checkout URL returned")
  }

  return data.checkoutUrl
}
