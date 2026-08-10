"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../../swr-fetcher";
import {
  FALLBACK_PRODUCTS,
  Product,
  MOCK_REVIEWS,
  slugify,
} from "../product-data";
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
  const [openSection, setOpenSection] = useState<string | null>("materials");

  const {
    data: apiProducts,
    error: productsError,
    isLoading: productsLoading,
  } = useSWR("http://localhost:3001/products", defaultFetcher);

  const product = useMemo(() => {
    if (Array.isArray(apiProducts)) {
      const apiProd = apiProducts.find(
        (p: ApiProduct) => p.slug === slug || slugify(p.name) === slug,
      );
      if (apiProd) {
        const fallbackMatch = FALLBACK_PRODUCTS.find(
          (fp) =>
            fp.id === apiProd.id ||
            fp.name.toLowerCase() === apiProd.name.toLowerCase(),
        );
        return {
          id: apiProd.id,
          name: apiProd.name,
          slug: slug,
          category: fallbackMatch?.category || "Wellness",
          price: typeof apiProd.price === "number" ? apiProd.price : 45.0,
          stock: typeof apiProd.stock === "number" ? apiProd.stock : 100,
          rating: fallbackMatch?.rating || 4.8,
          reviewsCount: fallbackMatch?.reviewsCount || 15,
          image:
            fallbackMatch?.image ||
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
          description:
            apiProd.description ||
            fallbackMatch?.description ||
            "Bespoke Aura Luxury product.",
          features: fallbackMatch?.features || {
            materials:
              "Premium organic ingredients and/or sustainable luxury composites.",
            dimensions: "Standard retail packaging.",
            shipping:
              "Complimentary premium shipping. Processed within 24 hours.",
          },
        } as Product;
      }
    }

    if (productsError || (!productsLoading && !apiProducts)) {
      return FALLBACK_PRODUCTS.find((fp) => fp.slug === slug) || null;
    }

    return null;
  }, [apiProducts, productsError, productsLoading, slug]);

  const loading = productsLoading && !apiProducts && !productsError;

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    setAddedToCartToast(true);
    setTimeout(() => {
      setAddedToCartToast(false);
    }, 4000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1ECE1] text-[#1C1B18] flex items-center justify-center font-sans">
        {fontStyles}
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#A9784F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[11px] font-label uppercase tracking-widest text-[#1C1B18]/50 font-semibold">
            Loading your sanctuary experience
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F1ECE1] text-[#1C1B18] flex flex-col items-center justify-center font-sans px-4">
        {fontStyles}
        <h2 className="font-display text-3xl sm:text-4xl text-[#1C1B18] mb-4">
          Product not found
        </h2>
        <p className="text-sm text-[#1C1B18]/55 font-body font-light mb-8 text-center max-w-md">
          This product isn't in our catalog, or may be temporarily out of stock.
        </p>
        <Button
          asChild
          className="bg-[#1C1B18] text-[#F1ECE1] hover:bg-[#1C1B18]/85 px-8 py-5 text-xs font-label uppercase tracking-widest rounded-none"
        >
          <Link href="/products">Back to Collection</Link>
        </Button>
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

      {/* REVIEWS */}
      <section className="bg-[#3F4F41] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-3">
              Client Testimonials
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#F1ECE1] leading-tight mb-10">
              Honest feedback from our sanctuary
            </h2>

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
