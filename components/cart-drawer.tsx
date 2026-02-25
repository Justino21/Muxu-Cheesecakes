"use client"

import { useState } from "react"
import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import { formatPrice, getProductById } from "@/lib/products"
import { getStripePriceId } from "@/lib/stripe/price-mapping"
import { createCartCheckout } from "@/lib/stripe/checkout"
import type { CartItem } from "@/contexts/cart-context"
import { useLocale } from "@/contexts/locale-context"
import { getTranslatedProductField } from "@/contexts/locale-context"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemoveItem: (productId: string, size: string) => void
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void
}

export function CartDrawer({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity }: CartDrawerProps) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const { t } = useLocale()

  const cartProducts = items
    .map((item) => ({
      ...item,
      product: getProductById(item.productId),
    }))
    .filter((item) => item.product !== undefined)

  const subtotal = cartProducts.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const handleProceedToCheckout = async () => {
    if (cartProducts.length === 0) return
    const lineItems: { stripeProductId: string; quantity: number; unit_amount: number }[] = []
    for (const item of cartProducts) {
      const stripeProductId = getStripePriceId(item.productId, item.size)
      if (!stripeProductId) {
        alert(t("errors.checkoutConfigProduct", { productName: item.product!.name, size: item.size }))
        return
      }
      lineItems.push({
        stripeProductId,
        quantity: item.quantity,
        unit_amount: item.unitPrice,
      })
    }
    setIsCheckoutLoading(true)
    try {
      const checkoutUrl = await createCartCheckout(lineItems)
      if (checkoutUrl) window.location.href = checkoutUrl
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : t("errors.checkoutFailed"))
      setIsCheckoutLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col bg-[#fdebea] border-[#3f210c]/10 px-5 sm:px-6 pt-6 pb-5 gap-0"
      >
        <SheetHeader className="pb-4 pr-8">
          <SheetTitle className="flex items-center gap-2 text-[#3f210c]">
            <ShoppingCart className="w-5 h-5" />
            {t("cart.titleWithCount", { count: items.reduce((sum, item) => sum + item.quantity, 0) })}
          </SheetTitle>
        </SheetHeader>

        {cartProducts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-2">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-[#3f210c]/50 mb-4" />
              <p className="text-[#3f210c]/70">{t("cart.empty")}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4 px-0.5">
              {cartProducts.map((item) => {
                const product = item.product!
                const itemKey = `${item.productId}-${item.size}`
                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 bg-[#3f210c]/5 p-4 rounded-lg border border-[#3f210c]/10"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images?.[0] || product.image || "/placeholder.svg"}
                        alt={getTranslatedProductField(t, product.id, "name", product.name)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate text-[#3f210c]">
                        {getTranslatedProductField(t, product.id, "name", product.name)}
                      </h4>
                      <p className="text-xs text-[#3f210c]/70 mb-1">
                        {item.size === "Mediana" ? t("common.sizeMediana") : item.size === "Grande" ? t("common.sizeGrande") : item.size}
                      </p>
                      <p className="text-sm text-[#3f210c]/80 mb-2">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-[#3f210c]/10 border-[#3f210c]/20 text-[#3f210c] hover:bg-[#3f210c]/20"
                          onClick={() => onUpdateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-8 text-center text-[#3f210c]">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-[#3f210c]/10 border-[#3f210c]/20 text-[#3f210c] hover:bg-[#3f210c]/20"
                          onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-[#3f210c] hover:bg-[#3f210c]/10"
                      onClick={() => onRemoveItem(item.productId, item.size)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#3f210c]/15 pt-4 mt-2 space-y-4">
              <div className="flex justify-between text-lg font-semibold text-[#3f210c]">
                <span>{t("cart.subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Button
                className="w-full py-6 text-lg font-semibold rounded-full bg-[#3f210c] text-[#fdebea] hover:bg-[#3f210c]/90"
                onClick={handleProceedToCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? t("cart.preparingCheckout") : t("cart.proceedToCheckout")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
