"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../../swr-fetcher";
import { FALLBACK_PRODUCTS, Product, MOCK_REVIEWS, slugify } from "../product-data";
import {
  X,
  ChevronRight,
  Star,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  ShoppingBag,
  ChevronDown
} from "lucide-react";

interface ApiProduct {
  id: string;
  name: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
}

const productDetailNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Booking", href: "/booking" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [quantity, setQuantity] = useState(1);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = useState<string | null>("materials");

  // Fetch products with SWR
  const { data: apiProducts, error: productsError, isLoading: productsLoading } = useSWR(
    "http://localhost:3001/products",
    defaultFetcher
  );

  const product = useMemo(() => {
    if (Array.isArray(apiProducts)) {
      // Find matching product
      const apiProd = apiProducts.find((p: ApiProduct) => p.slug === slug || slugify(p.name) === slug);
      if (apiProd) {
        const fallbackMatch = FALLBACK_PRODUCTS.find(
          (fp) => fp.id === apiProd.id || fp.name.toLowerCase() === apiProd.name.toLowerCase()
        );
        return {
          id: apiProd.id,
          name: apiProd.name,
          slug: slug,
          category: fallbackMatch?.category || "Wellness",
          price: typeof apiProd.price === "number" ? apiProd.price : 45.00,
          stock: typeof apiProd.stock === "number" ? apiProd.stock : 100,
          rating: fallbackMatch?.rating || 4.8,
          reviewsCount: fallbackMatch?.reviewsCount || 15,
          image: fallbackMatch?.image || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
          description: apiProd.description || fallbackMatch?.description || "Bespoke Aura Luxury product.",
          features: fallbackMatch?.features || {
            materials: "Premium organic ingredients and/or sustainable luxury composites.",
            dimensions: "Standard retail packaging.",
            shipping: "Complimentary premium shipping. Processed within 24 hours."
          }
        } as Product;
      }
    }

    if (productsError || (!productsLoading && !apiProducts)) {
      // Fetch offline or API fallback
      return FALLBACK_PRODUCTS.find((fp) => fp.slug === slug) || null;
    }

    return null;
  }, [apiProducts, productsError, productsLoading, slug]);

  const loading = productsLoading && !apiProducts && !productsError;

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    setAddedToCartToast(true);
    setTimeout(() => {
      setAddedToCartToast(false);
    }, 4000);
  };

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-brand-charcoal/60 font-semibold">
            Loading Bespoke Sanctuary Experience...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col items-center justify-center font-sans px-4">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal mb-4">Product Not Found</h2>
        <p className="text-sm text-brand-charcoal/60 font-light mb-8 text-center max-w-md">
          The requested luxury product does not exist in our catalog or might be temporarily out of stock.
        </p>
        <Button asChild className="bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-5 text-xs uppercase tracking-widest rounded-lg">
          <Link href="/products">Back to Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">

      {/* HEADER / NAVIGATION */}
      <Navbar navLinks={productDetailNavLinks} activeHref="/products" />

      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-brand-charcoal/50 flex items-center gap-1.5 font-sans">
        <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-brand-primary transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-charcoal/80 truncate font-semibold">{product.name}</span>
      </nav>

      {/* PRODUCT DISPLAY GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Product Image (4-5 columns) */}
          <div className="lg:col-span-6 relative aspect-square w-full rounded-2xl overflow-hidden bg-brand-card-cream/30 border border-brand-border/60 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center scale-101 hover:scale-104 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase tracking-widest text-brand-primary shadow-xs">
              {product.category}
            </div>
          </div>

          {/* Right Column: Details & Actions (6-7 columns) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Title / Badges */}
            <div className="space-y-3.5">
              <span className="text-[10px] sm:text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                INTENTIONALLY CURATED
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-charcoal tracking-wide leading-tight">
                {product.name}
              </h1>

              {/* Price & Star Rating */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                <span className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold">
                  ${product.price.toFixed(2)}
                </span>
                <div className="h-5 w-[1px] bg-brand-border/80 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-amber-500" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-sans font-medium text-brand-charcoal/70">
                    {product.rating} / 5.0
                  </span>
                  <span className="text-xs text-brand-charcoal/40 font-light">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="w-16 h-[1.5px] bg-brand-primary/40"></div>

            {/* Description */}
            <p className="text-sm sm:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Selector & Checkout CTAs */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

                {/* Quantity Controls */}
                <div className="flex items-center justify-between bg-white border border-brand-border/90 rounded-lg px-4 py-3 sm:w-36 shadow-xs">
                  <button
                    onClick={decrementQuantity}
                    className="p-1 text-brand-charcoal/60 hover:text-brand-primary active:scale-95 transition-all cursor-pointer bg-transparent border-0"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-sans font-bold text-sm text-brand-charcoal w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-1 text-brand-charcoal/60 hover:text-brand-primary active:scale-95 transition-all cursor-pointer bg-transparent border-0"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white border border-brand-primary py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-bold"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Inventory details */}
              <div className="flex items-center gap-2 text-xs font-sans text-brand-charcoal/60 pl-1">
                <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                <span>
                  {product.stock > 0 ? `In stock (Only ${product.stock} left — ships immediately)` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Features Accordion Group */}
            <div className="border-t border-brand-border/80 pt-6 space-y-4">
              <h3 className="font-serif text-lg text-brand-charcoal/90 font-medium tracking-wide">
                Product Information
              </h3>

              <div className="space-y-2">
                {/* Materials Section */}
                <div className="border border-brand-border/60 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleSection("materials")}
                    className="w-full flex items-center justify-between p-4 text-left font-serif text-sm tracking-wide text-brand-charcoal hover:bg-brand-cream/40 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <span className="font-medium">Materials & Formulation</span>
                    <ChevronDown className={`h-4 w-4 text-brand-primary transition-transform duration-300 ${openSection === "materials" ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === "materials" && (
                    <div className="p-4 pt-0 border-t border-brand-border/40 text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed animate-scale-in">
                      {product.features.materials}
                    </div>
                  )}
                </div>

                {/* Dimensions Section */}
                <div className="border border-brand-border/60 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleSection("dimensions")}
                    className="w-full flex items-center justify-between p-4 text-left font-serif text-sm tracking-wide text-brand-charcoal hover:bg-brand-cream/40 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <span className="font-medium">Sizing & Specifications</span>
                    <ChevronDown className={`h-4 w-4 text-brand-primary transition-transform duration-300 ${openSection === "dimensions" ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === "dimensions" && (
                    <div className="p-4 pt-0 border-t border-brand-border/40 text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed animate-scale-in">
                      {product.features.dimensions}
                    </div>
                  )}
                </div>

                {/* Shipping Section */}
                <div className="border border-brand-border/60 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleSection("shipping")}
                    className="w-full flex items-center justify-between p-4 text-left font-serif text-sm tracking-wide text-brand-charcoal hover:bg-brand-cream/40 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <span className="font-medium">Luxury Shipping & Returns</span>
                    <ChevronDown className={`h-4 w-4 text-brand-primary transition-transform duration-300 ${openSection === "shipping" ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === "shipping" && (
                    <div className="p-4 pt-0 border-t border-brand-border/40 text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed animate-scale-in">
                      {product.features.shipping}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60 font-sans">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-brand-primary shrink-0" />
                <div className="space-y-0.5">
                  <h5 className="font-serif text-xs text-brand-charcoal font-semibold uppercase tracking-wider">Free Shipping</h5>
                  <p className="text-[10px] text-brand-charcoal/50">On all contiguous orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-brand-primary shrink-0" />
                <div className="space-y-0.5">
                  <h5 className="font-serif text-xs text-brand-charcoal font-semibold uppercase tracking-wider">Mindful Care</h5>
                  <p className="text-[10px] text-brand-charcoal/50">100% organic & secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-brand-primary shrink-0" />
                <div className="space-y-0.5">
                  <h5 className="font-serif text-xs text-brand-charcoal font-semibold uppercase tracking-wider">Easy Exchange</h5>
                  <p className="text-[10px] text-brand-charcoal/50">30-day premium return</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* REVIEWS SECTION */}
      <section className="bg-brand-card-cream/30 border-t border-brand-border/60 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block mb-3">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-brand-charcoal tracking-wide mb-10">
              Honest Feedback from our Sanctuary
            </h2>

            <div className="space-y-8 divide-y divide-brand-border/60">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="pt-8 first:pt-0">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm sm:text-base text-brand-charcoal font-semibold">
                        {review.author}
                      </h4>
                      <span className="text-[10px] text-brand-charcoal/40 font-light block">
                        Verified Sanctuary Client • {review.date}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-charcoal/75 font-sans font-light leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADDED TO CART TOAST NOTIFICATION */}
      {addedToCartToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 bg-brand-charcoal text-white border border-white/10 px-5 py-4 rounded-xl shadow-2xl animate-scale-in max-w-sm">
          <CheckCircle className="h-5 w-5 text-brand-sage shrink-0" />
          <div className="flex-1 space-y-0.5 font-sans">
            <p className="text-xs font-sans font-bold uppercase tracking-wider text-brand-cream">
              Added to Cart
            </p>
            <p className="text-[11px] text-white/70 font-sans font-light">
              {quantity}x {product.name} successfully added to your local cart.
            </p>
          </div>
          <button
            onClick={() => setAddedToCartToast(false)}
            className="text-white/40 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-widest font-bold pl-2 bg-transparent border-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
