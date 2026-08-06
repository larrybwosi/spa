"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../../swr-fetcher";
import { getServiceById, ServiceDetail } from "../services-data";
import {
  ChevronRight,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from "lucide-react";

const serviceDetailNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Book Session", href: "/booking" },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // Active duration package option index (if options exist)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

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
      <Navbar navLinks={serviceDetailNavLinks} activeHref="/services" />

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
      <Footer />

    </div>
  );
}
