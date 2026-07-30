"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { FALLBACK_SERVICES, ServiceDetail } from "./services-data";
import {
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Droplet,
  Coffee
} from "lucide-react";

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

export default function ServicesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No session");
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    fetch("http://localhost:3001/api/services")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .catch((e) => {
        console.warn("Could not fetch API services, using detailed static services.", e);
      });
  }, []);

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

  // Group services by category for our alternating layout
  const categories = ["Massage Therapy", "Skin Care", "Holistic Wellness"];

  // Helper to map our fallback or API list dynamically
  const getServicesByCategory = (category: string): ServiceDetail[] => {
    return FALLBACK_SERVICES.filter(s => s.category.toLowerCase() === category.toLowerCase());
  };

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
            <Link href="/" className="hover:text-brand-primary transition-colors py-2 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link href="/services" className="text-brand-primary transition-colors py-2 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link href="/booking" className="hover:text-brand-primary transition-colors py-2 relative group">
              Book Session
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
                className="text-xs uppercase tracking-widest font-sans font-bold hover:text-brand-primary transition-colors text-brand-charcoal/85"
              >
                Sign In
              </Link>
            )}

            <Button asChild variant="default" className="text-xs uppercase tracking-[0.15em] bg-brand-primary text-white border border-brand-primary px-7 py-5 hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-full font-medium">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>

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
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Home</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Services</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Book Session</span>
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
            <Button asChild className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary text-white py-6 rounded-full hover:bg-brand-primary-hover shadow-md">
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* TOP HEADER HERO BRANDING */}
      <section className="py-16 md:py-24 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <span className="text-xs tracking-[0.3em] font-sans text-brand-primary uppercase font-bold block mb-4 animate-fade-in">
          OUR OFFERINGS
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-wide mb-6 font-light animate-fade-in-up">
          Curated Wellness Experiences
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-brand-charcoal/70 max-w-2xl mx-auto font-sans font-light tracking-wide leading-relaxed animate-fade-in-up">
          Discover a sanctuary of rejuvenation. Our tailored treatments blend ancient techniques with modern therapeutic practices to restore your natural balance.
        </p>
      </section>

      {/* ALTERNATING CATEGORIES OF OFFERINGS */}
      <section className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 md:space-y-40">
        {categories.map((category, catIdx) => {
          const isImageLeft = catIdx % 2 === 0;
          const servicesInCategory = getServicesByCategory(category);
          const firstServiceImage = servicesInCategory[0]?.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000";

          return (
            <div
              key={category}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start"
            >
              {/* IMAGE COLUMN (Responsive: image top in mobile, alternating on desktop) */}
              <div
                className={`lg:col-span-5 relative aspect-3/4 rounded-2xl overflow-hidden shadow-sm h-[380px] sm:h-[480px] lg:h-[620px] w-full ${
                  isImageLeft ? "lg:order-1" : "lg:order-2"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firstServiceImage}
                  alt={category}
                  className="absolute inset-0 w-full h-full object-cover object-center scale-101 hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-brand-charcoal/5"></div>
              </div>

              {/* DETAILS / SERVICE LIST COLUMN */}
              <div
                className={`lg:col-span-7 space-y-8 ${
                  isImageLeft ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="space-y-3.5">
                  <h2 className="text-3xl sm:text-4xl font-serif text-brand-charcoal tracking-wide">
                    {category}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-charcoal/65 font-sans font-light leading-relaxed max-w-xl">
                    {category === "Massage Therapy" &&
                      "Release tension and restore vitality through our expertly crafted massage therapies, designed to soothe both mind and body."}
                    {category === "Skin Care" &&
                      "Reveal your natural luminosity with our bespoke facial treatments, utilizing premium botanical ingredients and advanced techniques."}
                    {category === "Holistic Wellness" &&
                      "Integrative therapies aimed at aligning your energy and promoting comprehensive wellbeing from within."}
                  </p>
                </div>

                {/* Vertical list of beautiful cards */}
                <div className="space-y-5">
                  {servicesInCategory.map((service) => (
                    <Card
                      key={service.id}
                      className="bg-[#faf6f0] border border-brand-border/50 hover:border-brand-primary/20 p-6 rounded-xl shadow-xs transition-all duration-300 hover:scale-[1.005] hover:shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <h3 className="text-lg sm:text-xl font-serif text-brand-charcoal hover:text-brand-primary transition-colors font-medium">
                            <Link href={`/services/${service.id}`}>{service.name}</Link>
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] tracking-wider text-brand-charcoal/50 uppercase font-sans font-bold">
                            <span>{service.duration} Min</span>
                            <span>•</span>
                            <span>
                              {service.priceOptions
                                ? service.priceOptions.map((o) => `$${o.price}`).join(" / ")
                                : `$${service.price}`}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/booking?service=${service.id}`}
                          className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-sans font-bold text-brand-charcoal hover:text-brand-primary inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 group"
                        >
                          <span>Book</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                      <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                        {service.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* AMENITIES & FEATURES */}
      <section className="bg-brand-card-cream/30 border-y border-brand-border/60 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-xs mx-auto lg:mx-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif text-brand-charcoal">Licensed Experts</h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
              Every single therapist on our roster holds full certifications, specializing in restorative physical therapies and customized skincare.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-xs mx-auto lg:mx-0">
              <Droplet className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif text-brand-charcoal">Botanical Blends</h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
              Our organic skincare range is blended daily using pure cold-pressed botanicals, ensuring the highest active ingredient concentrations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-xs mx-auto lg:mx-0">
              <Coffee className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif text-brand-charcoal">Post-Ritual Lounge</h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
              Conclude your session in our sound-filtered relaxation room with seasonal wellness herbal infusions and custom relaxation bites.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-card-cream/60 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            <div className="lg:col-span-4 space-y-6">
              <span className="font-serif text-2xl tracking-[0.2em] text-brand-primary block font-semibold">
                AURA WELLNESS
              </span>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-sm">
                Elevating human consciousness and state of physical being through highly mindful organic therapies and quiet luxury care.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all bg-white"><InstagramIcon /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all bg-white"><FacebookIcon /></a>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">EXPLORE</h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li><Link href="/" className="hover:text-brand-primary transition-colors">Home Sanctuary</Link></li>
                <li><Link href="/services" className="hover:text-brand-primary transition-colors">Our Treatments</Link></li>
                <li><Link href="/booking" className="hover:text-brand-primary transition-colors">Book Experience</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">SANCTUARY DETAILS</h4>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                123 Serene Lane, Wellness District, Beverly Hills, CA 90210
              </p>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                Open Daily: 9:00 AM — 9:00 PM
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-charcoal/55 font-sans tracking-wider">
            <span>© 2024 Aura Luxury Wellness Sanctuary. All rights reserved.</span>
            <span className="italic font-serif">Designed with Intent</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
