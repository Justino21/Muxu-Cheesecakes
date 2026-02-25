"use client"

import { LogoScaler } from "@/components/logo-scaler"
import { NavigationHeader } from "@/components/navigation-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useLocale } from "@/contexts/locale-context"

export default function CheckoutPage() {
  const { t } = useLocale()
  return (
    <>
      <LogoScaler />
      <NavigationHeader />

      <main className="min-h-screen pt-24 pb-16 px-4 bg-[#fdebea]">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-center text-[#3f210c]">
            {t("checkout.pageTitle")}
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-[#3f210c]/5 border border-[#3f210c]/10 p-6 rounded-2xl shadow-sm">
                <h2 className="font-serif text-2xl font-bold mb-6 text-[#3f210c]">{t("checkout.shippingTitle")}</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.firstName")}</label>
                      <Input placeholder="Juan" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.lastName")}</label>
                      <Input placeholder="García" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.email")}</label>
                    <Input type="email" placeholder="juan@ejemplo.com" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.address")}</label>
                    <Input placeholder="Calle, número" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.city")}</label>
                      <Input placeholder="Madrid" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.state")}</label>
                      <Input placeholder="Madrid" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#3f210c]">{t("checkout.zip")}</label>
                      <Input placeholder="28001" className="border-[#3f210c]/20 bg-white/80 text-[#3f210c]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#3f210c]/5 border border-[#3f210c]/10 p-6 rounded-2xl shadow-sm">
                <h2 className="font-serif text-2xl font-bold mb-6 text-[#3f210c]">{t("checkout.paymentTitle")}</h2>
                <p className="text-[#3f210c]/80 mb-4">
                  {t("checkout.paymentNote")}
                </p>
                <Link href="/">
                  <Button size="lg" className="w-full rounded-full py-6 bg-[#3f210c] text-[#fdebea] hover:bg-[#3f210c]/90">
                    {t("checkout.goHome")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-[#3f210c]/5 border border-[#3f210c]/10 p-6 rounded-2xl shadow-sm sticky top-24">
                <h2 className="font-serif text-2xl font-bold mb-6 text-[#3f210c]">{t("checkout.orderSummary")}</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-[#3f210c]">
                    <span>{t("cart.subtotal")}</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#3f210c]/80">
                    <span>{t("checkout.shipping")}</span>
                    <span>{t("checkout.shippingAtCheckout")}</span>
                  </div>
                  <div className="border-t border-[#3f210c]/15 pt-4">
                    <div className="flex justify-between font-bold text-lg text-[#3f210c]">
                      <span>{t("checkout.total")}</span>
                      <span>—</span>
                    </div>
                  </div>
                </div>
                <Link href="/">
                  <Button variant="outline" className="w-full rounded-full border-[#3f210c]/30 text-[#3f210c] hover:bg-[#3f210c]/10">
                    {t("checkout.continueShopping")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
