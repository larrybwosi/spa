"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@repo/ui/input";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../swr-fetcher";
import { FALLBACK_PRODUCTS, Product, slugify } from "./product-data";
import {
  Sparkles,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

interface ApiProduct {
  id: string;
  name: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
}

const productsNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Booking", href: "/booking" },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Fetch products with SWR
  const { data: apiProducts } = useSWR(
    "http://localhost:3001/api/products",
    defaultFetcher,
  );

  console.log(apiProducts);

  const products = useMemo(() => {
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      // Map backend products to include frontend details, or use if already detailed
      const mapped: Product[] = apiProducts.map((apiProd: ApiProduct) => {
        const fallbackMatch = FALLBACK_PRODUCTS.find(
          (fp) =>
            fp.id === apiProd.id ||
            fp.name.toLowerCase() === apiProd.name.toLowerCase(),
        );
        return {
          id: apiProd.id,
          name: apiProd.name,
          slug: apiProd.slug || fallbackMatch?.slug || slugify(apiProd.name),
          category: fallbackMatch?.category || "Wellness",
          price: typeof apiProd.price === "number" ? apiProd.price : 45.0,
          stock: typeof apiProd.stock === "number" ? apiProd.stock : 100,
          rating: fallbackMatch?.rating || 4.8,
          reviewsCount: fallbackMatch?.reviewsCount || 12,
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
        };
      });

      // Add any fallback products that are not present in backend products so we have a rich catalogs list
      const uniqueFallbacks = FALLBACK_PRODUCTS.filter(
        (fp) =>
          !mapped.some((m) => m.name.toLowerCase() === fp.name.toLowerCase()),
      );

      return [...mapped, ...uniqueFallbacks];
    }
    return FALLBACK_PRODUCTS;
  }, [apiProducts]);

  // Filter & sort logic
  const filteredProducts = products
    .filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // Default Featured
    });

  const categories = ["All", "Wellness", "Footwear", "Apparel"];

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">
      {/* HEADER / NAVIGATION */}
      <Navbar navLinks={productsNavLinks} activeHref="/products" />

      {/* HERO / HEADER AREA */}
      <section className="relative bg-brand-card-cream/30 border-b border-brand-border/50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 mb-4 sm:mb-6 shadow-sm">
            <Sparkles className="h-3 w-3 text-brand-primary" />
            <span className="text-[10px] tracking-[0.25em] font-sans text-brand-primary uppercase font-bold">
              THE AURA APOTHECARY & APPAREL
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-brand-charcoal tracking-wide mb-6">
            Bespoke Product Collection
          </h1>
          <p className="text-sm sm:text-base text-brand-charcoal/70 max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Nourish your skin, elevate your style, and restore body wellness.
            Explore our intentionally curated selection of luxurious lifestyle
            additions.
          </p>
        </div>
      </section>

      {/* CONTROLS (Search, Filter, Sort) */}
      <section className="py-8 bg-brand-cream border-b border-brand-border/40 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Search & Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-charcoal/40" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white border-brand-border/80 focus:border-brand-primary/60 rounded-lg text-sm shadow-xs"
                />
              </div>

              {/* Categories Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold border transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-brand-primary border-brand-primary text-white shadow-xs"
                        : "bg-white border-brand-border/70 text-brand-charcoal/70 hover:border-brand-primary/45 hover:text-brand-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Sorting Select */}
            <div className="flex items-center gap-2 md:self-end">
              <SlidersHorizontal className="h-4 w-4 text-brand-charcoal/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-brand-border/80 text-brand-charcoal/80 text-xs uppercase tracking-wider font-semibold rounded-lg px-3 py-2.5 outline-none focus:border-brand-primary/50 cursor-pointer shadow-xs"
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
      <main className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/40 border border-brand-border/60 rounded-xl max-w-xl mx-auto shadow-sm">
            <h3 className="font-serif text-2xl text-brand-charcoal/75 mb-3">
              No Products Found
            </h3>
            <p className="text-sm text-brand-charcoal/60 font-sans font-light">
              We couldn&apos;t find any products matching your search criteria.
              Try a different query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-brand-border/65 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-primary/30"
              >
                {/* Product Image container */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full bg-brand-cream/30 overflow-hidden block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-brand-border/60 px-2.5 py-1 rounded-md text-[9px] font-sans font-bold uppercase tracking-widest text-brand-primary shadow-xs">
                    {product.category}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Stars / Reviews */}
                  <div className="flex items-center gap-1 mb-2.5">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-amber-500"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-sans text-brand-charcoal/50 font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div className="block flex-1 group-hover:text-brand-primary transition-colors">
                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="font-serif text-lg text-brand-charcoal font-medium line-clamp-1 mb-1 tracking-wide leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-brand-charcoal/60 font-sans font-light line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between mt-auto">
                    <span className="font-serif text-base sm:text-lg text-brand-charcoal font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-primary font-bold hover:text-brand-primary-hover flex items-center gap-1 group/btn"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
