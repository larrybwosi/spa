"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Sparkles,
  Compass,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Heart,
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

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: string;
}

export default function ServicesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Fallback services in case API is not running or doesn't return
    const fallbackServices: Service[] = [
      {
        id: "s1",
        name: "Therapeutic Massage",
        description: "Release deep muscular tension, soothe stress, and restore physical equilibrium with custom blended essential oils and signature deep tissue or Swedish techniques.",
        price: 120,
        duration: 60,
        category: "Body Therapy"
      },
      {
        id: "s4",
        name: "Rejuvenating Facial",
        description: "Organic, cold-pressed nutrient-rich botanicals applied with expert facial massage flow to lift, clarify, and unveil your inner natural radiance.",
        price: 145,
        duration: 60,
        category: "Skin Therapy"
      },
      {
        id: "s3",
        name: "Wellness Consultation",
        description: "Receive an exhaustive, individual holistic assessment with nutrition and mindfulness planning designed to bring harmony into your fast-paced daily schedule.",
        price: 95,
        duration: 45,
        category: "Holistic Health"
      },
      {
        id: "s2",
        name: "Aromatherapy Ritual",
        description: "A deeply sensory experience combining light to medium touch massage with ultra-premium certified organic floral extracts tailored to your emotional state.",
        price: 135,
        duration: 75,
        category: "Body Therapy"
      }
    ];

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
      .then((data) => setServices(data))
      .catch((e) => {
        console.warn("Could not fetch services, using fallbacks.", e);
        setServices(fallbackServices);
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

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "body therapy":
        return <Heart className="h-5 w-5" />;
      case "skin therapy":
        return <Droplet className="h-5 w-5" />;
      case "holistic health":
        return <Compass className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
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

      {/* HERO SECTION */}
      <section className="relative bg-brand-charcoal text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070"
            alt="Spa Background"
            className="w-full h-full object-cover brightness-40 scale-105"
          />
          <div className="absolute inset-0 bg-brand-charcoal/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs tracking-[0.3em] font-sans text-brand-sage uppercase font-bold block mb-4">
            SANCTUARY SERVICES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extralight tracking-wide mb-6">
            Bespoke <span className="italic text-brand-sage font-normal">Treatments</span> & Rituals
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-brand-cream/90 max-w-2xl mx-auto font-light font-sans tracking-wide leading-relaxed">
            Elevating physical well-being and inner consciousness through premium, custom-curated organic massage, skincare, and mindfulness consultations.
          </p>
        </div>
      </section>

      {/* SERVICES DISPLAY */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase block mb-3 font-bold">
            EXPERIENCE EXCELLENCE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-charcoal mb-4">
            Our Treatment Menu
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-primary/40 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="bg-brand-card-cream/50 border border-brand-border/60 hover:border-brand-primary/30 rounded-xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-white border border-brand-border/60 flex items-center justify-center text-brand-primary shadow-xs">
                    {getCategoryIcon(service.category)}
                  </div>
                  <span className="text-[10px] tracking-widest font-sans font-bold uppercase text-brand-primary/80 bg-brand-cream px-3 py-1 rounded-full border border-brand-border/40">
                    {service.category || "Treatment"}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-serif text-brand-charcoal tracking-wide leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-brand-border/50 mt-8">
                <div className="space-y-1">
                  <span className="block text-[10px] tracking-wider text-brand-charcoal/50 uppercase font-sans font-bold">
                    INVESTMENT & TIME
                  </span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-charcoal font-sans uppercase">
                    <span>{service.duration} Mins</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/30"></span>
                    <span>${service.price}</span>
                  </div>
                </div>

                <Button asChild variant="outline" className="rounded-full px-5 hover:bg-brand-primary hover:text-white group border-brand-border h-9 text-xs uppercase tracking-wider font-semibold">
                  <Link href={`/booking?service=${service.id}`} className="inline-flex items-center gap-1.5">
                    <span>Book</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
