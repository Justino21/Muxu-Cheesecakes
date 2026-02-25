"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { toast } from "sonner"
import { CartDrawer } from "@/components/cart-drawer"
import { useLocale } from "@/contexts/locale-context"

export interface CartItem {
  productId: string
  size: string
  unitPrice: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (productId: string, size: string, unitPrice: number) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { t } = useLocale()
  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addToCart = useCallback(
    (productId: string, size: string, unitPrice: number) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.productId === productId && item.size === size)
        if (existing) {
          return prev.map((item) =>
            item.productId === productId && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
          )
        }
        return [...prev, { productId, size, unitPrice, quantity: 1 }]
      })
      toast.success(t("toast.addedToCart"), {
        duration: 2000,
      })
    },
    [t],
  )

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size)
        return
      }
      setItems((prev) =>
        prev.map((item) => (item.productId === productId && item.size === size ? { ...item, quantity } : item)),
      )
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

