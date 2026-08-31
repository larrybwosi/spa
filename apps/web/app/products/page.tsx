"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@repo/ui/input";
import { Skeleton } from "@repo/ui/skeleton";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { EmptyState } from "../../components/EmptyState";
import useSWR from "swr";
import { defaultFetcher } from "../swr-fetcher";
import { API_ENDPOINTS } from "../../lib/api";
import { Search, SlidersHorizontal, ShoppingBag } from "lucide-react";
import { ProductCard } from "../../components/ProductCard";
import slugify from "slugify";

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

const productsNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Booking", href: "/booking" },
];

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-[#1C1B18]/10 overflow-hidden p-6 space-y-4">
      <Skeleton className="aspect-square w-full rounded-none" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-10 w-full" />
      <div className="pt-5 border-t border-[#1C1B18]/10 flex items-center justify-between mt-auto">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");

  const {
    data: apiProducts,
    error,
    isLoading,
  } = useSWR(API_ENDPOINTS.products(), defaultFetcher);

  const products = useMemo(() => {
    const productsArray = Array.isArray(apiProducts?.data)
      ? apiProducts.data
      : Array.isArray(apiProducts)
        ? apiProducts
        : null;

    if (productsArray) {
      return productsArray.map((apiProd: ApiProduct) => {
        const catName =
          typeof apiProd.category === "object" && apiProd.category !== null
            ? apiProd.category.name
            : typeof apiProd.category === "string"
              ? apiProd.category
              : "Wellness";

        return {
          id: apiProd.id,
          name: apiProd.name,
          slug: apiProd.slug || slugify(apiProd.name, { lower: true, strict: true }),
          category: catName,
          price: typeof apiProd.price === "number" ? apiProd.price : 45.0,
          stock: typeof apiProd.stock === "number" ? apiProd.stock : 100,
          rating: apiProd.rating || 4.8,
          reviewsCount: apiProd.reviewsCount || 12,
          image: apiProd.image || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
          description: apiProd.description || "Bespoke Aura Luxury product.",
          features: apiProd.features || {
            materials: "Premium organic ingredients and/or sustainable luxury composites.",
            dimensions: "Standard retail packaging.",
            shipping: "Complimentary premium shipping. Processed within 24 hours.",
          },
        } as Product;
      });
    }
    return [];
  }, [apiProducts]);

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = products
    .filter((prod: Product) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a: Product, b: Product) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const fontStyles = (
    <style jsx global>{`
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

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
        {fontStyles}
        <Navbar navLinks={productsNavLinks} activeHref="/products" />

        {/* HERO */}
        <section className="relative bg-[#1C1B18] py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-5">
              The Apothecary &amp; Apparel
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F1ECE1] leading-tight mb-6">
              Bring the sanctuary
              <br />
              <span className="italic text-[#DCD3C2]/80">into daily life</span>
            </h1>
          </div>
        </section>

        {/* SKELETON GRID */}
        <main className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
        {fontStyles}
        <Navbar navLinks={productsNavLinks} activeHref="/products" />

        {/* HERO */}
        <section className="relative bg-[#1C1B18] py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-5">
              The Apothecary &amp; Apparel
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F1ECE1] leading-tight mb-6">
              Bring the sanctuary
              <br />
              <span className="italic text-[#DCD3C2]/80">into daily life</span>
            </h1>
          </div>
        </section>

        {/* EMPTY / ERROR STATE */}
        <main className="py-24 sm:py-32 max-w-xl mx-auto px-4">
          <EmptyState
            title={error ? "Catalog Unavailable" : "No Products Found"}
            description={
              error
                ? "We are currently unable to load the apothecary collection. Please check your network connection or try again later."
                : "There are currently no items available in our apothecary collection."
            }
            icon={ShoppingBag}
            actionLabel="Retry Connection"
            onAction={() => window.location.reload()}
          />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
      {fontStyles}

      <Navbar navLinks={productsNavLinks} activeHref="/products" />

      {/* HERO */}
      <section className="relative bg-[#1C1B18] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-5">
            The Apothecary &amp; Apparel
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F1ECE1] leading-tight mb-6">
            Bring the sanctuary
            <br />
            <span className="italic text-[#DCD3C2]/80">into daily life</span>
          </h1>
          <p className="text-sm sm:text-base text-[#DCD3C2]/70 max-w-2xl mx-auto font-body font-light leading-relaxed">
            Formulations we use in treatment rooms, and the few objects we'd put
            our name behind. Nothing incidental, nothing filler.
          </p>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="py-7 bg-[#F1ECE1] border-b border-[#1C1B18]/10 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1C1B18]/40" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white border-[#1C1B18]/15 focus:border-[#A9784F]/60 rounded-none text-sm font-body"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-[11px] font-label uppercase tracking-wider font-semibold border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#1C1B18] border-[#1C1B18] text-[#F1ECE1]"
                        : "bg-white border-[#1C1B18]/15 text-[#1C1B18]/65 hover:border-[#A9784F]/50 hover:text-[#A9784F]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 md:self-end">
              <SlidersHorizontal className="h-4 w-4 text-[#1C1B18]/45" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#1C1B18]/15 text-[#1C1B18]/80 text-[11px] font-label uppercase tracking-wider font-semibold px-3 py-2.5 outline-none focus:border-[#A9784F]/50 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <main className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No Matching Products"
            description="We couldn't find anything matching your search query or filter selection. Try clearing your filters."
            icon={Search}
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
