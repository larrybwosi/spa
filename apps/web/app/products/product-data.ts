export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: {
    materials: string;
    dimensions: string;
    shipping: string;
  };
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-lavender-oil",
    name: "Therapeutic Lavender Essential Oil",
    slug: "therapeutic-lavender-oil",
    category: "Wellness",
    price: 15.99,
    stock: 50,
    rating: 4.8,
    reviewsCount: 24,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
    description: "100% pure organic therapeutic-grade lavender oil to calm the senses and support deep relaxation.",
    features: {
      materials: "Pure organic Lavandula angustifolia extract.",
      dimensions: "15ml cobalt blue glass bottle with dropper.",
      shipping: "Standard ground shipping. Free on orders over $50.",
    },
  },
  {
    id: "prod-clay-mask",
    name: "Restorative French Clay Mask",
    slug: "restorative-french-clay-mask",
    category: "Wellness",
    price: 25.0,
    stock: 15,
    rating: 4.9,
    reviewsCount: 18,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000",
    description: "Detoxifying and nourishing minerals designed to clarify skin tone and restore absolute suppleness.",
    features: {
      materials: "French green clay, organic aloe vera, botanical hydrosols.",
      dimensions: "60g luxury ceramic jar.",
      shipping: "Standard ground shipping. Free on orders over $50.",
    },
  },
  {
    id: "prod-bloom-rose",
    name: "Bloom Active Rose Facial Oil",
    slug: "bloom-rose-oil",
    category: "Wellness",
    price: 45.0,
    stock: 100,
    rating: 5.0,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000",
    description: "High-potency active rose botanical oil for hydration and cellular age-defying nourishment.",
    features: {
      materials: "Organic rosehip seed oil, damask rose absolute, vitamin E.",
      dimensions: "30ml frosted glass bottle with dropper.",
      shipping: "Standard ground shipping. Free on orders over $50.",
    },
  },
  {
    id: "prod-silk-robe",
    name: "Luxury Mulberry Silk Robe",
    slug: "luxury-mulberry-silk-robe",
    category: "Apparel",
    price: 180.0,
    stock: 8,
    rating: 4.9,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
    description: "Hand-crafted 100% mulberry silk robe. Lightweight, ultra-soft, and held with absolute comfort in mind.",
    features: {
      materials: "100% organic mulberry silk (22 momme).",
      dimensions: "One size fits most, adjustable waist tie.",
      shipping: "Complimentary signature gift box wrapping & express shipping.",
    },
  },
  {
    id: "prod-bamboo-slippers",
    name: "Bamboo Fiber Spa Slippers",
    slug: "bamboo-spa-slippers",
    category: "Footwear",
    price: 35.0,
    stock: 25,
    rating: 4.7,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000",
    description: "Eco-friendly, highly breathable spa slippers constructed with organic, moisture-wicking bamboo fibers.",
    features: {
      materials: "70% organic bamboo fiber, 30% recycled cotton, natural rubber sole.",
      dimensions: "Sizes available: S (37-38), M (39-40), L (41-42).",
      shipping: "Standard ground shipping. Free on orders over $50.",
    },
  },
  {
    id: "prod-sound-bowl",
    name: "Tibetan Quartz Singing Bowl",
    slug: "tibetan-quartz-singing-bowl",
    category: "Wellness",
    price: 120.0,
    stock: 12,
    rating: 4.9,
    reviewsCount: 14,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
    description: "Precision-tuned pure quartz crystal singing bowl tuned to 432Hz to clear spaces and harmonize body systems.",
    features: {
      materials: "99.9% pure quartz crystal, suede-wrapped wood mallet.",
      dimensions: "8-inch diameter bowl.",
      shipping: "Fragile-secure signature custom shipping.",
    },
  },
];
