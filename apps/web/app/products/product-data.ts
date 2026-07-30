export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  slug: string;
  features: {
    materials: string;
    dimensions: string;
    shipping: string;
  };
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "p1-sneak",
    name: "Awesome Sneaker",
    slug: "awesome-sneaker",
    category: "Footwear",
    price: 120.00,
    stock: 45,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    description: "A perfect blend of luxury, comfort, and peak athletic performance. Designed for everyday versatility with an breathable knit mesh upper and ultra-responsive cushioning.",
    features: {
      materials: "Premium lightweight recycled knit mesh upper, durable high-rebound rubber outsole, and luxury ortholite sockliner.",
      dimensions: "Fits true to size. Available in standard US Men's sizes 7 through 13.",
      shipping: "Complimentary premium shipping. Processed within 24 hours. Delivered in our signature eco-luxury dust bags."
    }
  },
  {
    id: "p2-hood",
    name: "Cozy Hoodie",
    slug: "cozy-hoodie",
    category: "Apparel",
    price: 75.00,
    stock: 60,
    rating: 4.7,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
    description: "Indulge in absolute comfort with our signature heavyweight premium French terry cotton hoodie. Featuring a drop-shoulder minimalist silhouette and cozy double-lined hood.",
    features: {
      materials: "100% GOTS certified organic heavyweight cotton. Pre-shrunk and vintage washed with organic botanicals.",
      dimensions: "Relaxed, slightly oversized fit. Model is 6'1\" wearing size Medium.",
      shipping: "Standard delivery: 3-5 business days. Ships in a recycled minimalist box."
    }
  },
  {
    id: "p3-shoe",
    name: "Men's Shoes",
    slug: "mens-shoes",
    category: "Footwear",
    price: 95.00,
    stock: 30,
    rating: 4.6,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=1000",
    description: "Timeless classical dress shoes meticulously crafted from rich full-grain calfskin leather. Engineered with an ergonomic cork footbed that molds to your unique stride over time.",
    features: {
      materials: "Premium full-grain Italian leather, genuine leather lining, and hand-stitched Goodyear welted construction.",
      dimensions: "Runs slightly large. We recommend ordering a half-size down from your usual sneakers.",
      shipping: "Includes complimentary cedar shoe trees and protective storage pouches. Shipping 2-3 business days."
    }
  },
  {
    id: "p1",
    name: "Bloom Rose Oil",
    slug: "bloom-rose-oil",
    category: "Wellness",
    price: 49.00,
    stock: 100,
    rating: 4.9,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
    description: "Bespoke botanical rose oil formulated for the ultimate skin glow and deep cellular hydration. Sourced from organic Damask roses, cold-pressed to preserve active nutrients.",
    features: {
      materials: "100% pure organic Damask Rose oil, Jojoba carrier oil, infused with vitamin E and botanical extracts.",
      dimensions: "50ml violet glass dropper bottle to protect the botanical integrity from light degradation.",
      shipping: "In stock. Ships immediately within 1-2 business days with eco-luxury protective padding."
    }
  },
  {
    id: "p2",
    name: "Argan Oil",
    slug: "argan-oil",
    category: "Wellness",
    price: 69.00,
    stock: 100,
    rating: 4.8,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=1000",
    description: "Premium cold-pressed Moroccan argan oil for hair and body wellness. Restores vibrant shine, repairs split ends, and deeply nourishes dry skin without heavy residue.",
    features: {
      materials: "100% pure cold-pressed organic Argania Spinosa kernel oil. Free from hexanes, parabens, and synthetic fragrances.",
      dimensions: "100ml amber glass bottle with premium pump dispenser.",
      shipping: "Available. Ships next business day with carbon-neutral delivery."
    }
  },
  {
    id: "p3",
    name: "Swedish Massage Oil",
    slug: "swedish-massage-oil",
    category: "Wellness",
    price: 59.00,
    stock: 100,
    rating: 4.9,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000",
    description: "An ultra-fine restorative oil specifically engineered for muscle release. Infused with therapeutic grade lavender and eucalyptus to induce absolute state of rest.",
    features: {
      materials: "Organic Sweet Almond oil base, Lavender essential oil, Eucalyptus globulus, and chamomile extract.",
      dimensions: "250ml professional glass bottle with leak-proof cap.",
      shipping: "Complimentary wellness guide booklet included. Ships in 1-2 business days."
    }
  },
  {
    id: "p4",
    name: "Hot Stone Set",
    slug: "hot-stone-set",
    category: "Wellness",
    price: 89.00,
    stock: 50,
    rating: 4.7,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1000",
    description: "Bespoke high-density volcanic basalt hot stones. Hand-polished to a velvety finish, retaining heat exceptionally well for targeted deep thermal therapy at home.",
    features: {
      materials: "12 natural volcanic basalt stones: 4 large, 4 medium, 4 small accent stones.",
      dimensions: "Set includes dedicated bamboo storage box and full ritual instructions.",
      shipping: "Heavy item weight surcharge waived. Delivered in 3-5 business days."
    }
  },
  {
    id: "p5",
    name: "Citrus Body Scrub",
    slug: "citrus-body-scrub",
    category: "Wellness",
    price: 39.00,
    stock: 100,
    rating: 4.8,
    reviewsCount: 167,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000",
    description: "Invigorating organic citrus body scrub for polished, glowing skin. Real sugar crystals gently slough away dry cells, while sweet orange and grapefruit oils refresh your spirits.",
    features: {
      materials: "Fine organic sugar crystals, virgin coconut oil, citrus aurantium dulcis peel oil, and organic shea butter.",
      dimensions: "200g wide-mouth recyclable jar.",
      shipping: "Eco-friendly shipping within 1-2 business days."
    }
  }
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .trim()
    .replace(/ +/g, "-");
}

export const MOCK_REVIEWS = [
  {
    id: "r1",
    author: "Elena Rostova",
    rating: 5,
    date: "2 weeks ago",
    comment: "This is an absolutely exquisite product. The quality completely exceeded my expectations. Packaging is luxurious, and the attention to detail is visible immediately. Highly recommend to anyone seeking quiet luxury."
  },
  {
    id: "r2",
    author: "Marcus Vance",
    rating: 5,
    date: "1 month ago",
    comment: "Simply stunning. From the texture to the functional design, everything is perfect. Ordering was seamless, and the delivery was exceptionally prompt. Aura Wellness continues to define modern elegant standard."
  },
  {
    id: "r3",
    author: "Sophia L.",
    rating: 4,
    date: "1 month ago",
    comment: "Beautifully made and extremely satisfying to use. The materials feel premium and durable. Only minor downside was the outer box had a slight dent on arrival, but the product inside was perfectly preserved."
  }
];
