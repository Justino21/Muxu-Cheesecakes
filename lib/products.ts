export interface Product {
  id: string
  name: string
  description: string
  fullDescription?: string
  tagline?: string
  priceInCents: number
  price: number
  image?: string
  images?: string[]
  isLimitedEdition?: boolean
  isBestseller?: boolean
  flavors?: string[]
  slug?: string
}

export const PRODUCTS: Product[] = [
  // Limited Edition Christmas Kisscakes
  {
    id: "turron-cheesecake",
    name: "Christmas Kisscake · Turrón de Xixona",
    slug: "turron-cheesecake",
    tagline: "El turrón de siempre, en un bocado suave y cremoso",
    description: "Un abrazo de Navidad en cada bocado.",
    fullDescription:
      "Un abrazo de Navidad en cada bocado. Nuestra cheesecake más cremosa se fusiona con el inconfundible sabor del turrón blando de Xixona para crear un postre suave, cálido y profundamente navideño.",
    priceInCents: 3300,
    price: 33.0,
    image: "/turron-preview.jpeg",
    images: ["/turron-preview.jpeg", "/turron-2.jpeg", "/turron-3.jpeg", "/turron-4.jpeg"],
    isLimitedEdition: true,
    flavors: ["Almond Turrón", "Honey", "Citrus"],
  },
  {
    id: "suchard-cheesecake",
    name: "Christmas Kisscake · Suchard",
    slug: "suchard-cheesecake",
    tagline: "Chocolate Suchard convertido en cheesecake cremoso",
    description: "Chocolate Suchard convertido en cheesecake cremoso.",
    fullDescription:
      "Chocolate Suchard convertido en cheesecake cremoso. El sabor inconfundible del chocolate suizo se funde con nuestra base de cheesecake más delicada para crear un postre navideño intenso, sedoso y profundamente reconfortante.",
    priceInCents: 3300,
    price: 33.0,
    image: "/suchard-5.jpeg",
    images: ["/suchard-5.jpeg", "/suchard-preview.jpeg", "/suchard-2.jpeg", "/suchard-3.jpeg", "/suchard-4.jpeg"],
    isLimitedEdition: true,
    flavors: ["Swiss Chocolate", "Cocoa", "Cream"],
  },
  // Regular Flavours
  {
    id: "classic-new-york",
    name: "Original",
    slug: "original",
    tagline: "Clásico, suave y perfecto para todos",
    description: "Clásico, suave y perfecto para todos.",
    fullDescription:
      "Clásico, suave y perfecto para todos. Nuestra receta original, horneada con la tradición de siempre. Un sabor que nunca pasa de moda, cremoso y delicado, perfecto para compartir en cualquier momento.",
    priceInCents: 2900,
    price: 29.0,
    image: "/original-3.jpeg",
    images: ["/original-3.jpeg", "/original-preview.jpeg", "/original-2.jpeg", "/original-4.jpeg", "/original-5.jpeg"],
    isBestseller: true,
    flavors: ["Original"],
  },
  {
    id: "white-chocolate",
    name: "Chocolate blanco",
    slug: "chocolate-blanco",
    tagline: "Cremoso y delicado",
    description: "Cremoso y delicado.",
    fullDescription:
      "Cremoso y delicado. El chocolate blanco más suave se encuentra con nuestra base de cheesecake para crear una experiencia dulce y elegante. Perfecto para los amantes de los sabores sutiles y refinados.",
    priceInCents: 2900,
    price: 29.0,
    image: "/chocolate-blanco-1.png",
    images: ["/chocolate-blanco-1.png", "/chocolate-blanco-2.png", "/chocolate-blanco-3.png"],
    flavors: ["White Chocolate"],
  },
  {
    id: "lotus",
    name: "Lotus",
    slug: "lotus",
    tagline: "Dulce y especiado",
    description: "Dulce y especiado.",
    fullDescription:
      "Dulce y especiado. La galleta Lotus más icónica se transforma en una cheesecake irresistible. Caramelo, canela y especias se funden en cada bocado, creando un sabor único que despierta los sentidos.",
    priceInCents: 2900,
    price: 29.0,
    image: "/lotus-1.jpeg",
    images: ["/lotus-1.jpeg", "/lotus-2.jpeg", "/lotus-3.jpeg"],
    flavors: ["Lotus", "Caramel"],
  },
  {
    id: "oreo",
    name: "Oreo",
    slug: "oreo",
    tagline: "Nostalgia en cada bocado",
    description: "Nostalgia en cada bocado.",
    fullDescription:
      "Nostalgia en cada bocado. Las galletas Oreo más queridas se convierten en una cheesecake cremosa y deliciosa. Chocolate y vainilla se unen para recordarnos los sabores de la infancia, con un toque elegante y sofisticado.",
    priceInCents: 2900,
    price: 29.0,
    image: "/oreo-1.png",
    images: ["/oreo-1.png"],
    flavors: ["Oreo", "Chocolate"],
  },
  {
    id: "pistachio",
    name: "Pistaccio",
    slug: "pistachio",
    tagline: "Elegante y único",
    description: "Elegante y único.",
    fullDescription:
      "Elegante y único. El sabor distintivo del pistacho se combina con nuestra cheesecake más refinada. Un postre sofisticado que sorprende con su textura cremosa y su sabor intenso, perfecto para ocasiones especiales.",
    priceInCents: 3300,
    price: 33.0,
    image: "/pistaccio-1.jpeg",
    images: ["/pistaccio-1.jpeg", "/pistaccio-2.jpeg", "/pistaccio-3.jpeg", "/pistaccio-4.jpeg"],
    flavors: ["Pistachio", "Cream"],
  },
]

export function formatPrice(priceInCents: number): string {
  const euros = Math.round(priceInCents / 100)
  return `${euros}€`
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export interface SizeOption {
  size: string
  subtitle: string
  priceLabel: string
  priceInCents: number
}

export function getProductPricingOptions(product: Product): SizeOption[] {
  // Special pricing for Pistaccio
  if (product.id === "pistachio") {
    return [
      { size: "Mediana", subtitle: "8 trozos", priceLabel: "33€", priceInCents: 3300 },
      { size: "Grande", subtitle: "12 trozos", priceLabel: "38€", priceInCents: 3800 },
    ]
  }

  // Special pricing for Lotus
  if (product.id === "lotus") {
    return [
      { size: "Mediana", subtitle: "8 trozos", priceLabel: "29€", priceInCents: 2900 },
      { size: "Grande", subtitle: "12 trozos", priceLabel: "34€", priceInCents: 3400 },
    ]
  }

  // Special pricing for Original
  if (product.id === "classic-new-york") {
    return [
      { size: "Mediana", subtitle: "8 trozos", priceLabel: "29€", priceInCents: 2900 },
      { size: "Grande", subtitle: "12 trozos", priceLabel: "34€", priceInCents: 3400 },
    ]
  }

  // Special pricing for Chocolate blanco
  if (product.id === "white-chocolate") {
    return [
      { size: "Mediana", subtitle: "8 trozos", priceLabel: "29€", priceInCents: 2900 },
      { size: "Grande", subtitle: "12 trozos", priceLabel: "34€", priceInCents: 3400 },
    ]
  }

  // Special pricing for Oreo
  if (product.id === "oreo") {
    return [
      { size: "Mediana", subtitle: "8 trozos", priceLabel: "29€", priceInCents: 2900 },
      { size: "Grande", subtitle: "12 trozos", priceLabel: "34€", priceInCents: 3400 },
    ]
  }

  // Limited edition pricing
  if (product.isLimitedEdition) {
    return [
      { size: "Mediana", subtitle: "8 trozos", priceLabel: "33€", priceInCents: 3300 },
      { size: "Grande", subtitle: "12 trozos", priceLabel: "38€", priceInCents: 3800 },
    ]
  }

  // Regular pricing
  return [
    { size: "Mediana", subtitle: "8 trozos", priceLabel: "30€", priceInCents: 3000 },
    { size: "Grande", subtitle: "12 trozos", priceLabel: "34€", priceInCents: 3400 },
  ]
}
