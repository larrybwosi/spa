"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  CheckCircle,
  Mail,
  ChevronRight,
  PhoneCall,
  Clock,
  ShieldCheck,
  Star
} from "lucide-react";
import { FALLBACK_SERVICES } from "./services/services-data";
import { FALLBACK_PRODUCTS } from "./products/product-data";

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

export default function Home() {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // User session state
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // Fetch session on load
  useEffect(() => {
    fetch("http://localhost:3001/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No session");
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setEmail("");
      }, 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-brand-primary group-hover:text-brand-primary-hover transition-colors font-semibold">
              AURA WELLNESS
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium uppercase text-brand-charcoal/80">
            <a href="#about" className="hover:text-brand-primary transition-colors py-2 relative group">
              About
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <Link href="/services" className="hover:text-brand-primary transition-colors py-2 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link href="/products" className="hover:text-brand-primary transition-colors py-2 relative group">
              Products
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <a href="#philosophy" className="hover:text-brand-primary transition-colors py-2 relative group">
              Philosophy
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#location" className="hover:text-brand-primary transition-colors py-2 relative group">
              Location
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          </nav>

          {/* Book Now CTA / Auth */}
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

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-full hover:bg-brand-card-cream/40"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-30 bg-brand-cream/98 transition-all duration-500 ease-in-out transform lg:hidden ${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        } pt-24 px-6 sm:px-12`}
      >
        <nav className="flex flex-col space-y-5 text-lg tracking-[0.15em] font-serif text-brand-charcoal">
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>About</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Services</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Products</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <a
            href="#philosophy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Philosophy</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>
          <a
            href="#location"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Location</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>

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
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] lg:min-h-screen flex items-center justify-center pt-24 pb-28 md:py-0 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070"
            alt="Luxury Spa thermal pool background"
            className="w-full h-full object-cover object-center brightness-50 scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-cream via-brand-cream/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6 sm:mb-8 animate-fade-in shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-brand-sage animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-[0.3em] font-sans text-brand-cream/90 uppercase font-semibold">
              BESPOKE RITUALS & SERENITY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none font-serif tracking-normal mb-8 max-w-4xl mx-auto font-extralight text-brand-cream drop-shadow-sm animate-fade-in-up">
            Sanctuary of <br/>
            <span className="font-serif italic font-normal text-brand-sage">Quiet Luxury</span>
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-xl mx-auto">
            <span className="px-4 py-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md text-[10px] tracking-[0.15em] uppercase font-medium text-brand-cream flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="h-3 w-3 text-brand-sage" />
              Easy Access
            </span>
            <span className="px-4 py-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md text-[10px] tracking-[0.15em] uppercase font-medium text-brand-cream flex items-center gap-1.5 shadow-sm">
              <PhoneCall className="h-3 w-3 text-brand-sage" />
              Instant Support
            </span>
            <span className="px-4 py-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md text-[10px] tracking-[0.15em] uppercase font-medium text-brand-cream flex items-center gap-1.5 shadow-sm">
              <Clock className="h-3 w-3 text-brand-sage" />
              Dedicated Booking
            </span>
          </div>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-brand-cream/90 max-w-2xl mx-auto font-sans font-light leading-relaxed mb-12 tracking-wide">
            Escape the noise. Immerse yourself in a beautifully crafted wellness experience tailored intentionally to harmonize your body, mind, and spirit.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Button
              asChild
              className="w-full sm:w-auto text-xs uppercase tracking-[0.2em] px-10 py-6 bg-brand-primary hover:bg-brand-primary-hover border border-brand-primary text-white shadow-lg transition-transform hover:scale-[1.03] duration-300 rounded-lg font-medium"
            >
              <Link href="/booking">Book a Session</Link>
            </Button>
            <Link
              href="/services"
              className="w-full sm:w-auto text-xs uppercase tracking-[0.2em] px-10 py-3.5 border border-white/35 bg-white/5 hover:bg-white/10 text-white transition-all rounded-lg font-medium inline-flex items-center justify-center gap-2 hover:border-white/60"
            >
              <span>Explore Treatments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES SECTION */}
      <section className="py-20 bg-brand-card-cream/30 border-t border-brand-border/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block mb-3">
              RECOMMENDED TREATMENT RITUALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-charcoal tracking-wide mb-4">
              Featured Sanctuary Services
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-primary/40 mx-auto mb-6"></div>
            <p className="text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
              Indulge in a carefully selected menu of physical and mental renewal experiences curated to alleviate stressors and align structural harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FALLBACK_SERVICES.slice(0, 3).map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-brand-border/40 hover:border-brand-primary/20 transition-all duration-300"
              >
                {/* Image Container with Hover scale zoom */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-charcoal/5 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                {/* Card Info */}
                <div className="flex flex-col flex-1 p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-brand-primary/80">
                      {service.category}
                    </span>
                    <span className="text-xs font-sans text-brand-charcoal/50 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration} mins
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif text-brand-charcoal group-hover:text-brand-primary transition-colors duration-300 leading-tight font-medium font-semibold">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed flex-1 line-clamp-2">
                    {service.description}
                  </p>

                  {/* View details footer CTA */}
                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between">
                    <span className="font-serif text-sm sm:text-base text-brand-charcoal font-semibold">
                      from ${service.price}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-sans font-bold text-brand-charcoal/80 group-hover:text-brand-primary transition-colors duration-300">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="rounded-lg h-11 px-8 uppercase tracking-widest font-semibold text-xs border-brand-border hover:bg-brand-primary hover:text-white transition-all">
              <Link href="/services">View All Sanctuary Treatments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-20 bg-brand-cream border-t border-brand-border/45 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block mb-3">
              THE AURA APOTHECARY & WELLNESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-charcoal tracking-wide mb-4">
              Featured Luxury Products
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-primary/40 mx-auto mb-6"></div>
            <p className="text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
              Bring the serene experience of our sanctuary to your daily rituals. Explore our handpicked bespoke formulations and wellness additions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FALLBACK_PRODUCTS.slice(3, 6).map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-brand-border/65 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-primary/30"
              >
                {/* Product Image container */}
                <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-brand-cream/30 overflow-hidden block">
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
                            i < Math.floor(product.rating) ? "fill-amber-500" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-sans text-brand-charcoal/50 font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="block flex-1">
                    <Link href={`/products/${product.slug}`} className="block group-hover:text-brand-primary transition-colors">
                      <h3 className="font-serif text-lg text-brand-charcoal font-medium line-clamp-1 mb-1 tracking-wide leading-tight font-semibold">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-brand-charcoal/60 font-sans font-light line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
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

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="rounded-lg h-11 px-8 uppercase tracking-widest font-semibold text-xs border-brand-border hover:bg-brand-primary hover:text-white transition-all">
              <Link href="/products">Explore Entire Apothecary Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-brand-card-cream/30 border-t border-brand-border/45 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block mb-3">
              CLIENT REFLECTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-charcoal tracking-wide mb-4">
              Sanctuary Testimonials
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-primary/40 mx-auto mb-6"></div>
            <p className="text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
              Discover the transformative physical and sensory journeys experienced by our esteemed guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-brand-border/60 rounded-xl p-8 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-brand-charcoal/80 font-sans font-light leading-relaxed italic mb-6">
                  &ldquo;Aura Wellness is an absolute sanctuary. The Signature Swedish treatment completely melted away my physical strain. Every detail, from the botanical oil aroma selection to the peaceful lounge, is crafted with pure intentional luxury.&rdquo;
                </p>
              </div>
              <div className="border-t border-brand-border/40 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center font-serif text-brand-primary font-bold">
                  AM
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Alex Mercer</h4>
                  <span className="text-[10px] tracking-wider uppercase font-sans text-brand-primary font-bold">Verified Sanctuary Guest</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-border/60 rounded-xl p-8 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-brand-charcoal/80 font-sans font-light leading-relaxed italic mb-6">
                  &ldquo;Their custom-blended Bloom Rose Oil is a miracle formulation. It hydrates deeply and has completely restored my skin glow without feeling heavy. I appreciate their commitment to 100% pure organic botanical active nutrients.&rdquo;
                </p>
              </div>
              <div className="border-t border-brand-border/40 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center font-serif text-brand-primary font-bold">
                  SL
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Sophia Laurent</h4>
                  <span className="text-[10px] tracking-wider uppercase font-sans text-brand-primary font-bold">Verified Sanctuary Guest</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-border/60 rounded-xl p-8 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-brand-charcoal/80 font-sans font-light leading-relaxed italic mb-6">
                  &ldquo;A magnificent experience. The therapists are remarkably skilled, and the location provides absolute filter from metropolitan noise. The post-ritual relaxation bites and herbal infusions are sublime. A masterpiece of wellness.&rdquo;
                </p>
              </div>
              <div className="border-t border-brand-border/40 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center font-serif text-brand-primary font-bold">
                  JD
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Julian Drake</h4>
                  <span className="text-[10px] tracking-wider uppercase font-sans text-brand-primary font-bold">Verified Sanctuary Guest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED INTRO SECTION */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase block mb-4 font-bold">
            WELCOME TO AURA
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-charcoal mb-6">
            Bespoke Serenity & Quiet Luxury
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-primary/40 mx-auto mb-6"></div>
          <p className="text-sm sm:text-base text-brand-charcoal/70 leading-relaxed font-sans font-light max-w-2xl mx-auto mb-10">
            Aura Wellness is designed as a sanctuary. We operate at the intersection of restorative physical therapy and quiet indulgence, ensuring that every touch is intentional and every ritual deeply transformative.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="rounded-lg h-10 px-6 uppercase tracking-wider font-semibold text-xs border-brand-border hover:bg-brand-primary hover:text-white transition-all">
              <Link href="/services">Our Treatments Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* OUR PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-20 sm:py-28 md:py-36 bg-brand-card-cream/50 border-y border-brand-border/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Elegant Vertical Image */}
          <div className="lg:col-span-5 relative aspect-3/4 rounded-xl overflow-hidden shadow-md h-[450px] sm:h-[550px] lg:h-[650px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
              alt="Luxury Spa reception"
              className="absolute inset-0 w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-brand-charcoal/5"></div>
          </div>

          {/* Right Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-6">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal leading-tight font-normal tracking-wide">
                Art of Healing
              </h2>
              <div className="w-16 h-[1.5px] bg-brand-primary/40 mt-4"></div>
            </div>

            <div className="space-y-6 text-sm sm:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-2xl">
              <p>
                At Aura Wellness, we hold that true health stems from profound, uncompromised inner peace. Our sanctuaries are meticulously sculpted to filter out the noise of modern life, offering an atmosphere where silence is celebrated and rejuvenation is treated as an art.
              </p>
              <p className="italic font-serif text-brand-primary text-base sm:text-lg pl-4 border-l-2 border-brand-primary/40 my-6">
                &ldquo;Our touch is intentional. Our therapies are grounded in time-honored rituals. Every second at Aura is curated with you at the center.&rdquo;
              </p>
              <p>
                We source only the finest globally certified organic ingredients and partner exclusively with licensed practitioners who are absolute masters of their crafts, ensuring that every touch is intentional and every ritual is deeply transformative.
              </p>
            </div>

            {/* Statistics */}
            <div className="pt-8 border-t border-brand-border/60 flex flex-wrap items-center gap-10 sm:gap-16">
              <div>
                <span className="block text-4xl sm:text-5xl font-serif text-brand-primary mb-1 font-semibold">
                  15<span className="text-2xl sm:text-3xl font-light text-brand-primary/75">+</span>
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-brand-charcoal/60 font-bold uppercase">
                  Years of Sanctuary
                </span>
              </div>
              <div>
                <span className="block text-4xl sm:text-5xl font-serif text-brand-primary mb-1 font-semibold">
                  100%
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-brand-charcoal/60 font-bold uppercase">
                  Organic & Botanical
                </span>
              </div>
              <div>
                <span className="block text-4xl sm:text-5xl font-serif text-brand-primary mb-1 font-semibold">
                  25k<span className="text-2xl sm:text-3xl font-light text-brand-primary/75">+</span>
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-brand-charcoal/60 font-bold uppercase">
                  Restored Spirits
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LOCATION & SANCTUARY SECTION */}
      <section id="location" className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Location Details */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                LOCATION
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-charcoal leading-tight font-normal tracking-wide">
                Visit Our Sanctuary
              </h2>
              <div className="w-16 h-[1.5px] bg-brand-primary/40 mt-4"></div>
              <p className="text-sm sm:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed pt-2">
                Situated inside the quiet corridors of the Wellness District, our sanctuary acts as an escape from the metropolis. Begin your retreat with us.
              </p>
            </div>

            {/* Address box */}
            <div className="flex items-start gap-4 p-6 rounded-lg bg-brand-card-cream/50 border border-brand-border/60 max-w-md shadow-xs">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-brand-charcoal font-medium">Aura Wellness Sanctuary</h4>
                <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light">
                  123 Serene Lane, Wellness District, Beverly Hills, CA 90210
                </p>
                <span className="inline-block text-[10px] text-brand-primary uppercase font-bold tracking-wider pt-1">
                  Complimentary valet parking included
                </span>
              </div>
            </div>

            {/* Directions Button */}
            <div>
              <Button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] bg-brand-primary text-white border border-brand-primary hover:bg-brand-primary-hover px-8 py-5 rounded-lg transition-transform hover:scale-[1.02] shadow-md cursor-pointer"
              >
                <span>Get Directions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Monochrome/Muted Spa Setup Image */}
          <div className="lg:col-span-7 relative aspect-4/3 rounded-xl overflow-hidden shadow-md h-[300px] sm:h-[450px] w-full order-1 lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000"
              alt="Grayscale aesthetic spa product setup"
              className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-105 scale-102 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-card-cream/60 border-t border-brand-border/60 pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">

            {/* Brand column */}
            <div className="lg:col-span-4 space-y-6">
              <span className="font-serif text-2xl tracking-[0.2em] text-brand-primary block font-semibold">
                AURA WELLNESS
              </span>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-sm">
                Elevating human consciousness and state of physical being through highly mindful organic therapies and quiet luxury care.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs bg-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs bg-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* Explore column */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                EXPLORE
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li>
                  <a href="#about" className="hover:text-brand-primary transition-colors">About Us</a>
                </li>
                <li>
                  <Link href="/services" className="hover:text-brand-primary transition-colors">Treatments Menu</Link>
                </li>
                <li>
                  <a href="#philosophy" className="hover:text-brand-primary transition-colors">Philosophy</a>
                </li>
                <li>
                  <a href="#location" className="hover:text-brand-primary transition-colors">Directions</a>
                </li>
              </ul>
            </div>

            {/* Legal column */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                LEGAL
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">Spa Etiquette</a>
                </li>
              </ul>
            </div>

            {/* Newsletter column */}
            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                NEWSLETTER
              </h4>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed mb-4">
                Subscribe to receive seasonal wellness insights, ritual announcements, and priority sanctuary bookings.
              </p>

              {newsletterSubmitted ? (
                <div className="flex items-center gap-3 p-4 bg-brand-sage/40 rounded-lg border border-brand-sage/60 text-brand-sage-dark text-xs sm:text-sm animate-fade-in shadow-xs">
                  <CheckCircle className="h-5 w-5 text-brand-sage-dark shrink-0" />
                  <span>Thank you. Your email was successfully registered.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2.5">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white border-brand-border text-brand-charcoal rounded-lg pl-11 py-5 h-11 focus-visible:ring-brand-primary/50 text-xs sm:text-sm shadow-inner"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white border border-brand-primary py-5 rounded-lg shadow-md font-semibold cursor-pointer"
                  >
                    SUBSCRIBE
                  </Button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom metadata */}
          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-charcoal/55 font-sans tracking-wider">
            <span>© 2024 Aura Luxury Wellness Sanctuary. All rights reserved.</span>
            <span className="italic font-serif">Designed with Intent</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
