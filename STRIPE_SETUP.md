# Stripe checkout setup

Checkout now uses **Stripe** instead of Shopify. Follow these steps to go live.

## 1. Stripe keys

In `.env.local` add:

```env
STRIPE_SECRET_KEY=sk_test_xxxx   # or sk_live_xxxx for production
```

Get the key from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys).

Optional (for success/cancel URL when not on Vercel):

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 2. Create Products and Prices in Stripe

For each cheesecake flavour and size you sell:

1. In [Stripe Dashboard → Products](https://dashboard.stripe.com/products), create a **Product** (e.g. "Original – Mediana", "Original – Grande", or one product "Original" with two prices).
2. For each **Price**:
   - Set amount (e.g. 29€ = 2900 cents) and currency (EUR).
   - Copy the **Price ID** (starts with `price_`).

## 3. Map Price IDs in the app

Open **`lib/stripe/price-mapping.ts`** and replace each placeholder with your real Stripe Price IDs:

- `price_REPLACE_TURRON_MEDIANA` → your Turrón Mediana price ID  
- `price_REPLACE_TURRON_GRANDE` → your Turrón Grande price ID  
- … same for Suchard, Original, Chocolate blanco, Lotus, Oreo, Pistachio (Mediana + Grande each).

Product IDs and sizes must match what the app uses (e.g. `"classic-new-york"`, `"Mediana"`, `"Grande"`). See the comments in that file.

## 4. Test

1. Run `pnpm dev` and click “Comprar” / “Buy now” on a product.
2. You should be redirected to Stripe Checkout.
3. Use test card `4242 4242 4242 4242` and any future expiry/CVC.

## Summary

| Step | What to do |
|------|------------|
| 1 | Add `STRIPE_SECRET_KEY` to `.env.local` |
| 2 | Create Products/Prices in Stripe Dashboard (EUR, correct amounts) |
| 3 | Paste each Price ID into `lib/stripe/price-mapping.ts` |
| 4 | Test checkout with a test card |

The old Shopify code (`lib/shopify/`, `app/api/create-checkout`, `app/api/create-cart-checkout`) is still in the repo but no longer used by the “Buy now” flow. You can remove it later if you don’t need it.
