"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import useSWR from "swr";
import { fetcherWithCredentials, defaultFetcher } from "../../swr-fetcher";
import { getServiceById, ServiceDetail } from "../services-data";
import {
  ChevronRight,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Menu
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

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active duration package option index (if options exist)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  // User session with SWR
  const { data: sessionData, mutate: mutateSession } = useSWR(
    "http://localhost:3001/api/auth/session",
    fetcherWithCredentials,
    { shouldRetryOnError: false }
  );
  const user = sessionData?.user || null;

  // Single service data with SWR
  const { data: apiSvc, error: serviceError, isLoading: serviceLoading } = useSWR(
    id ? `http://localhost:3001/api/services/${id}` : null,
    defaultFetcher
  );

  const service = useMemo(() => {
    if (apiSvc) {
      const localMeta = getServiceById(apiSvc.id) || getServiceById(id);
      const price = typeof apiSvc.price === "number" ? apiSvc.price : (localMeta?.price || 120);
      const duration = typeof apiSvc.duration === "number" ? apiSvc.duration : (localMeta?.duration || 60);

      return {
        id: apiSvc.id,
        name: apiSvc.name || localMeta?.name || "Bespoke Treatment",
        category: localMeta?.category || "Specialty Ritual",
        description: apiSvc.description || localMeta?.description || "An exclusive luxury therapy.",
        longDescription: localMeta?.longDescription || apiSvc.description || "Indulge in a premium, beautifully tailored therapeutic sanctuary experience designed to align your physical and mental wellbeing.",
        price: price,
        duration: duration,
        priceOptions: localMeta?.priceOptions || (localMeta ? undefined : [{ duration, price }]),
        image: localMeta?.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
        benefits: localMeta?.benefits || [
          "Restores metabolic and energy balance",
          "Relieves localized muscle and tissue soreness",
          "Promotes absolute mindfulness and physical calm"
        ],
        steps: localMeta?.steps || [
          "Sensory and dietary profiling",
          "Targeted luxury body massage flow",
          "Closing hot herbal compress"
        ]
      } as ServiceDetail;
    }

    if (serviceError || (!serviceLoading && !apiSvc)) {
      return getServiceById(id) || null;
    }

    return null;
  }, [apiSvc, serviceError, serviceLoading, id]);

  const loading = serviceLoading && !apiSvc && !serviceError;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-brand-charcoal/60 font-semibold">
            Preparing Ritual Details...
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col items-center justify-center font-sans px-4">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal mb-4">Treatment Not Found</h2>
        <p className="text-sm text-brand-charcoal/60 font-light mb-8 text-center max-w-md font-sans">
          The requested luxury treatment does not exist in our catalog or might be temporarily unavailable.
        </p>
        <Button asChild className="bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-5 text-xs uppercase tracking-widest rounded-full">
          <Link href="/services">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  // Get current active price & duration option
  const activeDuration = service.priceOptions
    ? service.priceOptions[selectedOptionIndex]?.duration || service.duration
    : service.duration;

  const activePrice = service.priceOptions
    ? service.priceOptions[selectedOptionIndex]?.price || service.price
    : service.price;

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
            <Link href="/products" className="hover:text-brand-primary transition-colors py-2 relative group">
              Products
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
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
            className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-full hover:bg-brand-card-cream/40 lg:hidden"
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
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Products</span>
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

      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-brand-charcoal/50 flex items-center gap-1.5 font-sans">
        <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/services" className="hover:text-brand-primary transition-colors">Services</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-charcoal/85 truncate font-semibold">{service.name}</span>
      </nav>

      {/* DETAIL GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* LEFT: PREMIUM HERO IMAGE */}
          <div className="lg:col-span-6 relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4efeb] border border-brand-border/60 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover object-center scale-101 hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-brand-primary shadow-xs">
              {service.category}
            </div>
          </div>

          {/* RIGHT: DETAILS, DESCRIPTION, PACKAGES & CTAs */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] sm:text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                THERAPEUTIC RITUAL
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-charcoal tracking-wide leading-tight font-light font-medium">
                {service.name}
              </h1>

              {/* Price & Duration Indicators */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1 font-sans">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-brand-primary/65" />
                  <span className="text-sm font-semibold text-brand-charcoal/80">
                    {activeDuration} Minutes
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-brand-border/80"></div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4.5 w-4.5 text-brand-primary/65" />
                  <span className="text-lg font-bold text-brand-charcoal">
                    ${activePrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-16 h-[1.5px] bg-brand-primary/40"></div>

            <div className="space-y-4 font-sans text-sm sm:text-base text-brand-charcoal/70 font-light leading-relaxed">
              <p className="font-medium text-brand-charcoal/85 font-serif text-lg italic font-normal">
                {service.description}
              </p>
              <p>
                {service.longDescription}
              </p>
            </div>

            {/* DURATION / PACKAGE SELECTORS (If multiple pricing tiers exist) */}
            {service.priceOptions && service.priceOptions.length > 1 && (
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/50 font-sans block">
                  CHOOSE RITUAL DURATION
                </span>
                <div className="flex flex-wrap gap-3">
                  {service.priceOptions.map((opt, optIdx) => (
                    <button
                      key={opt.duration}
                      onClick={() => setSelectedOptionIndex(optIdx)}
                      className={`flex-1 min-w-[120px] p-4 rounded-xl border text-left transition-all duration-300 font-sans cursor-pointer ${
                        selectedOptionIndex === optIdx
                          ? "bg-brand-primary/5 border-brand-primary text-brand-primary shadow-xs"
                          : "bg-white border-brand-border/80 hover:border-brand-primary/30 text-brand-charcoal/75"
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider mb-1">
                        {opt.duration} Mins
                      </span>
                      <span className="text-sm font-semibold">
                        ${opt.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DIRECT BOOKING CTA */}
            <div className="pt-4">
              <Button
                asChild
                className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <Link href={`/booking?service=${service.id}`} className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Reserve This Ritual</span>
                </Link>
              </Button>
            </div>

            {/* QUALITY SEALS */}
            <div className="flex items-center gap-3 pt-4 border-t border-brand-border/60 font-sans">
              <ShieldCheck className="h-5 w-5 text-brand-primary shrink-0" />
              <div className="space-y-0.5">
                <h5 className="text-[10px] tracking-wider uppercase font-bold text-brand-charcoal/80">Guaranteed Serenity</h5>
                <p className="text-[11px] text-brand-charcoal/50">Full service customizations with licensed practitioners.</p>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ADDITIONAL DETAILS SECTION: Benefits & Journey */}
      <section className="bg-brand-card-cream/30 border-t border-brand-border/60 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* BENEFITS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block font-sans">
                  THERAPEUTIC IMPACT
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-charcoal font-light">
                  Key Ritual Benefits
                </h2>
              </div>
              <div className="w-12 h-[1px] bg-brand-primary/40"></div>
              <ul className="space-y-4 font-sans text-sm text-brand-charcoal/70 font-light">
                {service.benefits?.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-primary/75 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* THE JOURNEY STEPS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block font-sans">
                  THE EXPERIENCE
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-charcoal font-light font-serif">
                  Your Sanctuary Journey
                </h2>
              </div>
              <div className="w-12 h-[1px] bg-brand-primary/40"></div>
              <div className="space-y-5 font-sans">
                {service.steps?.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-[11px] font-bold text-brand-primary shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-brand-charcoal/75 font-light leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-card-cream/60 border-t border-brand-border/60 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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
