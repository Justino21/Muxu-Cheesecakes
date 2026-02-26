import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/google-analytics"
import { ConsentBanner } from "@/components/consent-banner"
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://muxucheesecakes.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Muxu Cheesecakes | Artisan Cheesecakes Made with Love",
  description:
    "Artisan cheesecakes made with love. Premium ingredients, family recipes, and home delivery. Order your Muxu cheesecake in Madrid or San Diego and enjoy the taste of homemade luxury.",
  generator: "v0.app",
  keywords: ["cheesecake", "artisan cheesecake", "Madrid", "San Diego", "home delivery", "handcrafted", "Muxu", "dessert"],
  icons: {
    icon: "/Muxu_Logo.png",
    apple: "/Muxu_Logo.png",
  },
  openGraph: {
    title: "Muxu Cheesecakes | Artisan Cheesecakes Made with Love",
    description: "Artisan cheesecakes made with love. Premium ingredients, family recipes, home delivery in Madrid & San Diego.",
    type: "website",
    images: [
      {
        url: "/Muxu_Logo.png",
        width: 1200,
        height: 630,
        alt: "Muxu Cheesecakes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muxu Cheesecakes | Artisan Cheesecakes Made with Love",
    description: "Artisan cheesecakes made with love. Premium ingredients, family recipes, home delivery in Madrid & San Diego.",
    images: ["/Muxu_Logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/Muxu_new_hero2.mp4" as="video" type="video/mp4" fetchPriority="high" />
        <link rel="preload" href="/hero-frames/frame_0000.jpg" as="image" fetchPriority="high" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppProviders>
          <>
            <LenisProvider>{children}</LenisProvider>
            <ConsentBanner />
          </>
        </AppProviders>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
