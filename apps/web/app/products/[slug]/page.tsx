"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../../swr-fetcher";
import { API_ENDPOINTS } from "../../../lib/api";
import slugify from "slugify";
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
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { scrymeClient } from "../../../lib/scryme";

interface ApiProduct {
  id: string;
  name: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  features?: {
    materials?: string;
    dimensions?: string;
    shipping?: string;
  };
}

interface Product {
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

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
}

const productDetailNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Booking", href: "/booking" },
];

// Mock reviews for demonstration - this would come from your API
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Sarah K.",
    date: "May 2026",
    rating: 5,
    comment: "Absolutely transformative. The quality is unmatched, and the attention to detail makes it feel truly bespoke. I've already recommended to my entire wellness circle.",
  },
  {
    id: "2",
    author: "James M.",
    date: "April 2026",
    rating: 5,
    comment: "The craftsmanship is exceptional. It's rare to find products that combine luxury with genuine sustainability. Worth every penny.",
  },
  {
    id: "3",
    author: "Elena R.",
    date: "March 2026",
    rating: 4,
    comment: "Beautiful design and thoughtful packaging. The product exceeded my expectations. Would love to see more color options in the future.",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [quantity, setQuantity] = useState(1);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("materials");

  const {
    data: apiProducts,
    error: productsError,
    isLoading: productsLoading,
  } = useSWR(API_ENDPOINTS.products(), defaultFetcher);

  const product = useMemo(() => {
    const productsArray = Array.isArray(apiProducts)
      ? apiProducts
      : apiProducts && Array.isArray(apiProducts.data)
        ? apiProducts.data
        : null;

    if (productsArray) {
      const apiProd = productsArray.find(
        (p: ApiProduct) => p.slug === slug || slugify(p.name, { lower: true, strict: true }) === slug,
      );
      if (apiProd) {
        return {
          id: apiProd.id,
          name: apiProd.name,
          slug: slug,
          category: apiProd.category.name || "Wellness",
          price: typeof apiProd.price === "number" ? apiProd.price : 45.0,
          stock: typeof apiProd.stock === "number" ? apiProd.stock : 100,
          rating: apiProd.rating || 4.8,
          reviewsCount: apiProd.reviewsCount || 15,
          image: apiProd.image || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
          description: apiProd.description || "Bespoke Aura Luxury product.",
          features: apiProd.features || {
            materials: "Premium organic ingredients and/or sustainable luxury composites.",
            dimensions: "Standard retail packaging.",
            shipping: "Complimentary premium shipping. Processed within 24 hours.",
          },
        } as Product;
      }
    }
    return null;
  }, [apiProducts, slug]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await scrymeClient.cart.add({
      quantity,
      productId,
    });
    console.log(res);
  };

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const fontStyles = (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap");

      .font-display {
        font-family: "Fraunces", serif;
        font-optical-sizing: auto;
      }
      .font-body {
        font-family: "Inter", sans-serif;
      }
      .font-label {
        font-family: "Space Grotesk", sans-serif;
      }
    `}</style>
  );

  if (productsLoading) {
    return (
      <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
        {fontStyles}
        <Navbar navLinks={productDetailNavLinks} activeHref="/products" />
        {/* Breadcrumbs Skeleton */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Skeleton className="h-4 w-64 rounded-none" />
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Image Skeleton */}
            <div className="lg:col-span-6 relative aspect-square w-full">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            {/* Details Skeleton */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3.5">
                <Skeleton className="h-4 w-32 rounded-none" />
                <Skeleton className="h-12 w-3/4 rounded-none" />
                <div className="flex items-center gap-4 pt-1">
                  <Skeleton className="h-8 w-24 rounded-none" />
                  <Skeleton className="h-6 w-32 rounded-none" />
                </div>
              </div>

              <Skeleton className="h-px w-16" />

              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-32 rounded-none" />
                  <Skeleton className="h-12 flex-1 rounded-none" />
                </div>
                <Skeleton className="h-4 w-64 rounded-none" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (productsError || !product) {
    return (
      <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
        {fontStyles}
        <Navbar navLinks={productDetailNavLinks} activeHref="/products" />
        <main className="py-24 sm:py-32 max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex w-16 h-16 bg-[#A9784F]/10 text-[#A9784F] rounded-full items-center justify-center font-semibold">
            <X className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1C1B18]">
            Product Unavailable
          </h2>
          <p className="text-sm text-[#1C1B18]/65 font-body font-light leading-relaxed">
            The requested luxury product is currently unavailable or doesn't exist in our collection.
          </p>
          <Button
            asChild
            className="text-xs font-label uppercase tracking-widest bg-[#1C1B18] text-[#F1ECE1] px-8 py-5 rounded-none hover:bg-[#1C1B18]/85 font-semibold"
          >
            <Link href="/products">Back to Collection</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
      {fontStyles}

      <Navbar navLinks={productDetailNavLinks} activeHref="/products" />

      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-[10px] sm:text-xs font-label uppercase tracking-[0.15em] font-medium text-[#1C1B18]/45 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#A9784F] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href="/products"
          className="hover:text-[#A9784F] transition-colors"
        >
          Products
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#1C1B18]/75 truncate font-semibold">
          {product.name}
        </span>
      </nav>

      {/* PRODUCT DISPLAY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className="lg:col-span-6 relative aspect-square w-full overflow-hidden bg-[#DCD3C2]/20 border border-[#1C1B18]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-[#1C1B18]/90 backdrop-blur-xs px-3.5 py-1.5 text-[10px] font-label font-semibold uppercase tracking-widest text-[#F1ECE1]">
              {product.category}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3.5">
              <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block">
                Intentionally Curated
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-[#1C1B18] leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                <span className="font-display text-2xl sm:text-3xl text-[#1C1B18]">
                  Ksh {product.price.toFixed(2)}
                </span>
                <div className="h-5 w-px bg-[#1C1B18]/15 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#A9784F]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-[#A9784F]"
                            : "text-[#1C1B18]/15"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-body font-medium text-[#1C1B18]/65">
                    {product.rating} / 5.0
                  </span>
                  <span className="text-xs text-[#1C1B18]/40 font-body font-light">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="w-16 h-px bg-[#A9784F]/50" />

            <p className="text-sm sm:text-base text-[#1C1B18]/65 font-body font-light leading-relaxed">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between bg-white border border-[#1C1B18]/15 px-4 py-3 sm:w-36">
                  <button
                    onClick={decrementQuantity}
                    className="p-1 text-[#1C1B18]/55 hover:text-[#A9784F] active:scale-95 transition-all cursor-pointer bg-transparent border-0"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-label font-bold text-sm text-[#1C1B18] w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-1 text-[#1C1B18]/55 hover:text-[#A9784F] active:scale-95 transition-all cursor-pointer bg-transparent border-0"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 text-xs font-label uppercase tracking-[0.2em] bg-[#1C1B18] hover:bg-[#1C1B18]/85 text-[#F1ECE1] border-none py-6 rounded-none font-semibold transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs font-body text-[#1C1B18]/55 pl-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 0 ? "bg-[#3F4F41]" : "bg-red-500"
                  }`}
                />
                <span>
                  {product.stock > 0
                    ? `In stock — only ${product.stock} left, ships immediately`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Accordion */}
            <div className="border-t border-[#1C1B18]/10 pt-6 space-y-4">
              <h3 className="font-display text-lg text-[#1C1B18]">
                Product Information
              </h3>

              <div className="space-y-px bg-[#1C1B18]/10">
                {[
                  {
                    key: "materials",
                    label: "Materials & Formulation",
                    value: product.features.materials,
                  },
                  {
                    key: "dimensions",
                    label: "Sizing & Specifications",
                    value: product.features.dimensions,
                  },
                  {
                    key: "shipping",
                    label: "Shipping & Returns",
                    value: product.features.shipping,
                  },
                ].map((section) => (
                  <div key={section.key} className="bg-white overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full flex items-center justify-between p-5 text-left font-body text-sm text-[#1C1B18] hover:bg-[#F1ECE1]/40 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <span className="font-medium">{section.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-[#A9784F] transition-transform duration-300 ${
                          openSection === section.key ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSection === section.key && (
                      <div className="px-5 pb-5 text-sm text-[#1C1B18]/60 font-body font-light leading-relaxed">
                        {section.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1C1B18]/10 font-body">
              {[
                {
                  icon: Truck,
                  title: "Free Shipping",
                  copy: "On all contiguous orders",
                },
                {
                  icon: Shield,
                  title: "Mindful Care",
                  copy: "100% organic & secure",
                },
                {
                  icon: RotateCcw,
                  title: "Easy Exchange",
                  copy: "30-day premium return",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-[#A9784F] shrink-0" />
                  <div className="space-y-0.5">
                    <h5 className="font-label text-[11px] text-[#1C1B18] font-semibold uppercase tracking-wider">
                      {title}
                    </h5>
                    <p className="text-[11px] text-[#1C1B18]/45">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* REVIEWS SECTION WITH EMPTY STATE */}
      <section className="bg-[#3F4F41] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-3">
              Client Testimonials
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#F1ECE1] leading-tight mb-10">
              Honest feedback from our sanctuary
            </h2>

            {MOCK_REVIEWS && MOCK_REVIEWS.length > 0 ? (
              <div className="space-y-8 divide-y divide-[#F1ECE1]/10">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="pt-8 first:pt-0">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="space-y-1">
                        <h4 className="font-display text-base text-[#F1ECE1]">
                          {review.author}
                        </h4>
                        <span className="text-[10px] text-[#DCD3C2]/45 font-body font-light block">
                          Verified Sanctuary Client · {review.date}
                        </span>
                      </div>
                      <div className="flex items-center text-[#A9784F] shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-[#A9784F]"
                                : "text-[#F1ECE1]/15"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#DCD3C2]/75 font-body font-light leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State for Reviews */
              <div className="bg-[#F1ECE1]/5 border border-[#F1ECE1]/10 p-12 text-center">
                <div className="inline-flex w-16 h-16 bg-[#A9784F]/10 text-[#A9784F] rounded-full items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl text-[#F1ECE1] mb-2">
                  No reviews yet
                </h3>
                <p className="text-sm text-[#DCD3C2]/60 font-body font-light max-w-md mx-auto">
                  Be the first to share your experience with this product. Your
                  feedback helps our community make informed choices.
                </p>
                <Button
                  className="mt-6 text-xs font-label uppercase tracking-widest bg-[#A9784F] hover:bg-[#A9784F]/85 text-[#1C1B18] px-8 py-4 rounded-none font-semibold transition-colors"
                >
                  Write a Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TOAST */}
      {addedToCartToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 bg-[#1C1B18] text-[#F1ECE1] border border-[#F1ECE1]/10 px-5 py-4 shadow-2xl max-w-sm">
          <CheckCircle className="h-5 w-5 text-[#A9784F] shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="text-xs font-label font-bold uppercase tracking-wider">
              Added to cart
            </p>
            <p className="text-[11px] text-[#DCD3C2]/70 font-body font-light">
              {quantity}× {product.name} added to your cart.
            </p>
          </div>
          <button
            onClick={() => setAddedToCartToast(false)}
            className="text-[#DCD3C2]/40 hover:text-[#F1ECE1] transition-colors cursor-pointer pl-2 bg-transparent border-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
