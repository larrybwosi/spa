"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import useSWR from "swr";
import { fetcherWithCredentials, defaultFetcher } from "../swr-fetcher";
import { FALLBACK_PRODUCTS, Product, slugify } from "./product-data";
import {
  X,
  Menu,
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

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function ProductsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Fetch session on load with SWR
  const { data: sessionData, mutate: mutateSession } = useSWR(
    "http://localhost:3001/api/auth/session",
    fetcherWithCredentials,
    { shouldRetryOnError: false },
  );
  const user = sessionData?.user || null;

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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }
    mutateSession(null, { revalidate: false });
  };

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
      <header className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-brand-primary group-hover:text-brand-primary-hover transition-colors font-semibold">
              AURA WELLNESS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium uppercase text-brand-charcoal/80">
            <Link
              href="/"
              className="hover:text-brand-primary transition-colors py-2 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link
              href="/services"
              className="hover:text-brand-primary transition-colors py-2 relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link
              href="/products"
              className="text-brand-primary transition-colors py-2 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link
              href="/booking"
              className="hover:text-brand-primary transition-colors py-2 relative group"
            >
              Booking
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 border-r pr-6 border-brand-border/60">
                <span className="text-[10px] uppercase tracking-widest font-sans text-brand-charcoal/70 font-semibold bg-brand-card-cream/50 px-3 py-1.5 rounded-full border border-brand-border">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors font-sans font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/booking"
                className="text-xs uppercase tracking-widest font-sans font-bold hover:text-brand-primary transition-colors text-brand-charcoal/85 cursor-pointer"
              >
                Sign In
              </Link>
            )}

            <Button
              asChild
              variant="default"
              className="text-xs uppercase tracking-[0.15em] bg-brand-primary text-white border border-brand-primary px-7 py-5 hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-lg font-medium"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-full hover:bg-brand-card-cream/40"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-30 bg-brand-cream/98 transition-all duration-500 ease-in-out transform lg:hidden ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        } pt-24 px-6 sm:px-12`}
      >
        <nav className="flex flex-col space-y-5 text-lg tracking-[0.15em] font-serif text-brand-charcoal">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Home Sanctuary</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Services Menu</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Bespoke Products</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Book Experience</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>

          {user ? (
            <div className="py-4 border-b border-brand-border/40 flex items-center justify-between font-sans">
              <span className="text-sm font-medium text-brand-charcoal/80 bg-brand-card-cream/50 px-3 py-1 rounded-full border border-brand-border">
                Hello, {user.name}
              </span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs uppercase tracking-widest text-red-500 font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-primary text-left font-serif transition-colors py-4 border-b border-brand-border/40 text-lg flex justify-between items-center"
            >
              <span>Sign In</span>
              <ChevronRight className="h-4 w-4 text-brand-primary" />
            </Link>
          )}

          <div className="pt-8">
            <Button
              asChild
              className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary text-white py-6 rounded-lg hover:bg-brand-primary-hover shadow-md"
            >
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                Book Now
              </Link>
            </Button>
          </div>
        </nav>
      </div>

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
      <footer className="bg-brand-card-cream/60 border-t border-brand-border/60 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            <div className="lg:col-span-4 space-y-6">
              <span className="font-serif text-2xl tracking-[0.2em] text-brand-primary block font-semibold">
                AURA WELLNESS
              </span>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-sm">
                Elevating human consciousness and state of physical being
                through highly mindful organic therapies and quiet luxury care.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all bg-white"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all bg-white"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                EXPLORE
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-primary transition-colors"
                  >
                    Home Sanctuary
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-primary transition-colors"
                  >
                    Our Treatments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-brand-primary transition-colors"
                  >
                    Bespoke Products
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                SANCTUARY DETAILS
              </h4>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                123 Serene Lane, Wellness District, Beverly Hills, CA 90210
              </p>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                Open Daily: 9:00 AM — 9:00 PM
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-charcoal/55 font-sans tracking-wider">
            <span>
              © 2024 Aura Luxury Wellness Sanctuary. All rights reserved.
            </span>
            <span className="italic font-serif">Designed with Intent</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
