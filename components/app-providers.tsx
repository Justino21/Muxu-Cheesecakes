"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/contexts/locale-context"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/sonner"

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} enableColorScheme={false}>
      <LocaleProvider>
        <CartProvider>{children}</CartProvider>
        <Toaster />
      </LocaleProvider>
    </ThemeProvider>
  )
}

export default AppProviders

