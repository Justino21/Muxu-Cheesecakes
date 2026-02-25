import { NextRequest, NextResponse } from "next/server"
import { getShopifyVariantId } from "@/lib/shopify/variant-mapping"

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 })
    }

    const shopifyDomain = process.env.SHOPIFY_DOMAIN
    const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN

    if (!shopifyDomain || !storefrontToken) {
      return NextResponse.json(
        { error: "Shopify configuration missing. Please check SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_TOKEN." },
        { status: 500 },
      )
    }

    // Convert cart items to Shopify cart lines
    const cartLines = []
    for (const item of items) {
      const variantId = getShopifyVariantId(item.productId, item.size)

      if (!variantId) {
        console.warn(`No Shopify variant found for product ${item.productId} size ${item.size}, skipping`)
        continue
      }

      cartLines.push({
        merchandiseId: variantId,
        quantity: item.quantity || 1,
      })
    }

    if (cartLines.length === 0) {
      return NextResponse.json(
        { error: "No valid products found in cart. Please ensure all products have Shopify variant IDs configured." },
        { status: 400 },
      )
    }

    const shopifyUrl = `https://${shopifyDomain}/api/2024-01/graphql.json`

    const mutation = `
      mutation CreateCart($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                }
              }
            }
          }
          userErrors {
            message
          }
        }
      }
    `

    const variables = {
      lines: cartLines,
    }

    const response = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Shopify API error:", errorText)
      return NextResponse.json({ error: `Shopify API error: ${response.statusText}` }, { status: response.status })
    }

    const data = await response.json()

    if (data.errors) {
      console.error("GraphQL errors:", data.errors)
      return NextResponse.json({ error: data.errors[0]?.message || "GraphQL error occurred" }, { status: 400 })
    }

    const { cart, userErrors } = data.data.cartCreate

    if (userErrors && userErrors.length > 0) {
      console.error("Shopify user errors:", userErrors)
      return NextResponse.json({ error: userErrors[0]?.message || "Error creating cart" }, { status: 400 })
    }

    if (!cart || !cart.id) {
      return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
    }

    // Verify cart has items
    const cartLinesResult = cart.lines?.edges || []
    if (cartLinesResult.length === 0) {
      console.error("Cart created but has no items:", cart)
      return NextResponse.json({ error: "Cart was created but has no items. Please check the variant IDs." }, { status: 400 })
    }

    // Use the checkoutUrl directly from Shopify API
    let checkoutUrl = cart.checkoutUrl

    // If checkoutUrl is null or empty, construct the cart URL
    if (!checkoutUrl || checkoutUrl.trim() === "") {
      const cartId = cart.id.split("/").pop()
      checkoutUrl = `https://${shopifyDomain}/cart/c/${cartId}`
    } else {
      // Ensure it's absolute
      if (!checkoutUrl.startsWith("http")) {
        checkoutUrl = `https://${shopifyDomain}${checkoutUrl}`
      }
    }

    console.log("Cart checkout created:", {
      cartId: cart.id,
      itemsCount: cartLinesResult.length,
      checkoutUrl,
    })

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error("Error creating cart checkout:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 })
  }
}

