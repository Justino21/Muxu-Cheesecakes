import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

/**
 * Creates a Stripe Checkout Session and returns the session URL.
 * Body (single item with Stripe Product ID + amount):
 *   { stripeProductId: string, quantity?: number, unit_amount: number }  (unit_amount in cents)
 * Or legacy: { priceId: string, quantity?: number }
 * Or cart: { lineItems: Array<{ priceId } | { stripeProductId, quantity, unit_amount }> }
 */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local" },
        { status: 500 },
      )
    }

    const stripe = new Stripe(secret)
    const body = await request.json()

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      (request.headers.get("x-forwarded-host")
        ? `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host")}`
        : "http://localhost:3000")

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (body.lineItems && Array.isArray(body.lineItems) && body.lineItems.length > 0) {
      lineItems = body.lineItems.map((item: { priceId?: string; stripeProductId?: string; quantity?: number; unit_amount?: number }) => {
        const qty = Math.max(1, Number(item.quantity) || 1)
        if (item.priceId) {
          return { price: item.priceId, quantity: qty }
        }
        if (item.stripeProductId && item.unit_amount != null) {
          return {
            price_data: {
              currency: "eur",
              product: item.stripeProductId,
              unit_amount: Math.round(Number(item.unit_amount)),
            },
            quantity: qty,
          }
        }
        throw new Error("Each line item needs priceId or (stripeProductId + unit_amount)")
      })
    } else if (body.stripeProductId && body.unit_amount != null) {
      lineItems = [
        {
          price_data: {
            currency: "eur",
            product: body.stripeProductId,
            unit_amount: Math.round(Number(body.unit_amount)),
          },
          quantity: Math.max(1, Number(body.quantity) || 1),
        },
      ]
    } else if (body.priceId) {
      lineItems = [
        {
          price: body.priceId,
          quantity: Math.max(1, Number(body.quantity) || 1),
        },
      ]
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "stripeProductId + unit_amount, or priceId, or lineItems required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/?checkout=success`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
    })

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 500 })
    }

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
