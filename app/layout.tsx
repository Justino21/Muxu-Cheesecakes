import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/google-analytics"
import AppProviders from "@/components/app-providers"
import { LenisProvider } from "@/components/lenis-provider"
import "./globals.css"

// <CHANGE> Luxury display font for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

// <CHANGE> Clean sans-serif for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Muxu Cheesecake | Handcrafted Holiday Indulgence",
  description:
    "Premium handcrafted cheesecakes made with love. Limited edition holiday flavors available now. Experience the warmth of homemade luxury.",
  generator: "v0.app",
  keywords: ["cheesecake", "holiday dessert", "premium", "handcrafted", "Christmas", "gift"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Muxu Cheesecake | Handcrafted Holiday Indulgence",
    description: "Premium handcrafted cheesecakes made with love",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppProviders>
          <LenisProvider>{children}</LenisProvider>
        </AppProviders>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
