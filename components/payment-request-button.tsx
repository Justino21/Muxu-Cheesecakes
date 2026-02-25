"use client"

import { useEffect, useState } from "react"
import { loadStripe, type PaymentRequest } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentRequestButtonProps {
  productId: string
  amount: number // in cents
  label: string
  className?: string
}

export function PaymentRequestButton({ productId, amount, label, className }: PaymentRequestButtonProps) {
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)

  useEffect(() => {
    const initPaymentRequest = async () => {
      const stripe = await stripePromise
      if (!stripe) return

      const pr = stripe.paymentRequest({
        country: "ES",
        currency: "eur",
        total: {
          label: label,
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      const canPay = await pr.canMakePayment()
      if (canPay) {
        setPaymentRequest(pr)
        setCanMakePayment(true)

        // Handle the payment
        pr.on("paymentmethod", async (event) => {
          // Track click
          if (typeof window !== "undefined" && (window as any).gtag) {
            ;(window as any).gtag("event", "click_buy_now", {
              product_id: productId,
              value: amount / 100,
            })
          }

          // Here you would create a payment intent on your server
          // For now, we'll show success
          event.complete("success")
        })
      }
    }

    initPaymentRequest()
  }, [productId, amount, label])

  if (!canMakePayment || !paymentRequest) {
    return null
  }

  return (
    <button
      className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-base transition-all hover:scale-[1.03] hover:shadow-lg ${className || ""}`}
      style={{
        backgroundColor: "#000",
        color: "#fff",
      }}
      onClick={() => {
        if (paymentRequest) {
          paymentRequest.show()
        }
      }}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      Buy Now with Apple Pay
    </button>
  )
}
