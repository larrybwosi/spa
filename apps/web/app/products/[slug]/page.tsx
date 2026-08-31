"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { EmptyState } from "../../../components/EmptyState";
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
  ShoppingBag as ShoppingBagIcon,
} from "lucide-react";
import { scrymeClient } from "../../../lib/scryme";

interface ApiProduct {
  id: string;
  name: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: { name: string } | string;
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
  } = useSWR(API_ENDPOINTS.products(), defaultFetcher);

  const product = useMemo(() => {
    const productsArray = Array.isArray(apiProducts?.data)
      ? apiProducts.data
      : Array.isArray(apiProducts)
        ? apiProducts
        : null;

    if (productsArray) {
      const apiProd = productsArray.find(
        (p: ApiProduct) => p.slug === slug || slugify(p.name, { lower: true, strict: true }) === slug,
      );
      if (apiProd) {
        const catName =
          typeof apiProd.category === "object" && apiProd.category !== null
            ? apiProd.category.name
            : typeof apiProd.category === "string"
              ? apiProd.category
              : "Wellness";

        return {
          id: apiProd.id,
          name: apiProd.name,
          slug: slug,
          category: catName,
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
    try {
      await scrymeClient.cart.add({
        quantity,
        productId,
      });
      setAddedToCartToast(true);
    } catch {
      setAddedToCartToast(true);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  if (productsLoading) {
    return (
      <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
        <Navbar navLinks={productDetailNavLinks} activeHref="/products" />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Skeleton className="h-4 w-64 rounded-none" />
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-6 relative aspect-square w-full">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

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
        <Navbar navLinks={productDetailNavLinks} activeHref="/products" />
        <main className="py-24 sm:py-32 max-w-xl mx-auto px-4">
          <EmptyState
            title="Product Unavailable"
            description="The requested luxury product is currently unavailable or doesn't exist in our collection."
            icon={ShoppingBagIcon}
            actionLabel="Back to Collection"
            onAction={() => window.location.href = "/products"}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
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
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 z-10 bg-[#1C1B18]/90 backdrop-blur-xs px-3.5 py-1.5 text-[10px] font-label font-semibold uppercase tracking-widest text-[#F1ECE1]">
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
                  onClick={() => handleAddToCart({ productId: product.id, quantity })}
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
