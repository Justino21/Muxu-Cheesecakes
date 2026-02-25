"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutModalProps {
  productId: string | null
  onClose: () => void
}

export function CheckoutModal({ productId, onClose }: CheckoutModalProps) {
  const [isComplete, setIsComplete] = useState(false)

  const startCheckoutSessionForProduct = useCallback(() => {
    if (!productId) return Promise.reject("No product selected")
    return startCheckoutSession(productId)
  }, [productId])

  if (!productId) return null

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">Order Confirmed!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We'll start preparing your handcrafted cheesecake right away.
            </p>
            <Button onClick={onClose} className="w-full bg-primary text-primary-foreground rounded-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background rounded-2xl max-w-2xl w-full shadow-2xl my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Checkout */}
        <div className="p-6">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              fetchClientSecret: startCheckoutSessionForProduct,
              onComplete: () => setIsComplete(true),
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
