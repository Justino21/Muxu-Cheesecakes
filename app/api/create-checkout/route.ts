import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { variantId, quantity } = await request.json()

    if (!variantId) {
      return NextResponse.json({ error: "variantId is required" }, { status: 400 })
    }

    const shopifyDomain = process.env.SHOPIFY_DOMAIN
    const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN

    if (!shopifyDomain || !storefrontToken) {
      return NextResponse.json(
        { error: "Shopify configuration missing. Please check SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_TOKEN." },
        { status: 500 },
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
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            message
            field
          }
        }
      }
    `

    const variables = {
      lines: [
        {
          merchandiseId: variantId,
          quantity: quantity || 1,
        },
      ],
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
    const cartLines = cart.lines?.edges || []
    if (cartLines.length === 0) {
      console.error("Cart created but has no items:", cart)
      return NextResponse.json({ error: "Cart was created but has no items. Please check the variant ID." }, { status: 400 })
    }

    // Extract cart ID from the GID (format: gid://shopify/Cart/abc123)
    const cartId = cart.id.split("/").pop()

    // Use the checkoutUrl directly from Shopify API
    // IMPORTANT: Shopify returns a cart URL (/cart/c/...) which automatically redirects to checkout
    // DO NOT convert it - use it as-is
    let checkoutUrl = cart.checkoutUrl

    // If checkoutUrl is null or empty, construct the cart URL
    if (!checkoutUrl || checkoutUrl.trim() === "") {
      checkoutUrl = `https://${shopifyDomain}/cart/c/${cartId}`
    } else {
      // Use the URL exactly as Shopify returns it
      // Ensure it's absolute
      if (!checkoutUrl.startsWith("http")) {
        checkoutUrl = `https://${shopifyDomain}${checkoutUrl}`
      }
    }

    // DO NOT convert cart URLs to checkout URLs - Shopify handles the redirect automatically

    // Log for debugging
    console.log("Cart created:", {
      cartId: cart.id,
      extractedCartId: cartId,
      checkoutUrlFromAPI: cart.checkoutUrl,
      finalCheckoutUrl: checkoutUrl,
      cartItems: cartLines.length,
      items: cartLines.map((edge: any) => ({
        quantity: edge.node.quantity,
        variant: edge.node.merchandise?.title || edge.node.merchandise?.id,
      })),
    })

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error("Error creating checkout:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 })
  }
}

