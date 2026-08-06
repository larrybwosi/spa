"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
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
  Calendar,
  Sparkles,
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

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const {
    data: apiSvc,
    error: serviceError,
    isLoading: serviceLoading,
  } = useSWR(
    id ? `http://localhost:3001/api/services/${id}` : null,
    defaultFetcher,
  );

  const service = useMemo(() => {
    if (apiSvc) {
      const localMeta = getServiceById(apiSvc.id) || getServiceById(id);
      const price =
        typeof apiSvc.price === "number"
          ? apiSvc.price
          : localMeta?.price || 120;
      const duration =
        typeof apiSvc.duration === "number"
          ? apiSvc.duration
          : localMeta?.duration || 60;

      return {
        id: apiSvc.id,
        name: apiSvc.name || localMeta?.name || "Bespoke Treatment",
        category: localMeta?.category || "Specialty Ritual",
        description:
          apiSvc.description ||
          localMeta?.description ||
          "An exclusive luxury therapy.",
        longDescription:
          localMeta?.longDescription ||
          apiSvc.description ||
          "Indulge in a premium, beautifully tailored therapeutic sanctuary experience designed to align your physical and mental wellbeing.",
        price,
        duration,
        priceOptions:
          localMeta?.priceOptions ||
          (localMeta ? undefined : [{ duration, price }]),
        image:
          localMeta?.image ||
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
        benefits: localMeta?.benefits || [
          "Restores metabolic and energy balance",
          "Relieves localized muscle and tissue soreness",
          "Promotes absolute mindfulness and physical calm",
        ],
        steps: localMeta?.steps || [
          "Sensory and dietary profiling",
          "Targeted luxury body massage flow",
          "Closing hot herbal compress",
        ],
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
      <div className="min-h-screen bg-brand-cream text-brand-charcoal font-sans">
        <Navbar navLinks={serviceDetailNavLinks} activeHref="/services" />

        {/* Breadcrumbs Skeleton */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <Skeleton className="h-4 w-64" />
        </nav>

        {/* Main Content Skeleton */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-20 items-start">
            {/* Image Skeleton */}
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              <Skeleton className="aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl" />
            </div>

            {/* Details Skeleton */}
            <div className="lg:col-span-6 space-y-7 sm:space-y-8">
              <div className="space-y-3 sm:space-y-3.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <div className="flex items-center gap-4 sm:gap-6 pt-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>

              <Skeleton className="h-px w-16" />

              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>

              {/* Package Selector Skeleton */}
              <div className="space-y-3 sm:space-y-3.5 pt-2">
                <Skeleton className="h-4 w-40" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                </div>
              </div>

              {/* CTA Button Skeleton */}
              <Skeleton className="h-14 w-full rounded-full" />

              {/* Quality Seal Skeleton */}
              <div className="flex items-start gap-3 pt-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Benefits & Steps Section Skeleton */}
        <section className="relative bg-brand-card-cream/30 border-t border-brand-border/60 py-14 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
              {/* Benefits Skeleton */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-px w-12" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Skeleton */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-px w-12" />
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                      <Skeleton className="h-4 flex-1 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col items-center justify-center font-sans px-6 text-center">
        <Sparkles className="h-8 w-8 text-brand-primary/40 mb-5" />
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal mb-4 tracking-tight">
          Treatment Not Found
        </h2>
        <p className="text-sm text-brand-charcoal/55 font-light mb-8 max-w-md leading-relaxed">
          The requested luxury treatment does not exist in our catalog or might
          be temporarily unavailable.
        </p>
        <Button
          asChild
          className="bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-5 text-xs uppercase tracking-widest rounded-full"
        >
          <Link href="/services">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  const activeDuration = service.priceOptions
    ? service.priceOptions[selectedOptionIndex]?.duration || service.duration
    : service.duration;

  const activePrice = service.priceOptions
    ? service.priceOptions[selectedOptionIndex]?.price || service.price
    : service.price;

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">
      {/* AMBIENT BACKGROUND ACCENTS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-primary/[0.06] blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-[24rem] h-[24rem] rounded-full bg-brand-primary/[0.04] blur-3xl"></div>
      </div>

      <Navbar navLinks={serviceDetailNavLinks} activeHref="/services" />

      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-brand-charcoal/50 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link
          href="/services"
          className="hover:text-brand-primary transition-colors"
        >
          Services
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-brand-charcoal/85 truncate font-semibold">
          {service.name}
        </span>
      </nav>

      {/* DETAIL GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-20 items-start">
          {/* LEFT: PREMIUM HERO IMAGE */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="group relative aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f4efeb] border border-brand-border/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary shadow-sm border border-white/60">
                {service.category}
              </div>

              <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" />
                Signature
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS, DESCRIPTION, PACKAGES & CTAs */}
          <div className="lg:col-span-6 space-y-7 sm:space-y-8">
            <div className="space-y-3 sm:space-y-3.5">
              <span className="text-[10px] sm:text-xs tracking-[0.25em] text-brand-primary uppercase font-bold block">
                Therapeutic Ritual
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-serif text-brand-charcoal tracking-tight leading-[1.05]">
                {service.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-brand-primary/65" />
                  <span className="text-sm font-semibold text-brand-charcoal/80">
                    {activeDuration} Minutes
                  </span>
                </div>
                <div className="h-4 w-px bg-brand-border/80"></div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-brand-primary/65" />
                  <span className="text-lg sm:text-xl font-bold text-brand-charcoal">
                    ${activePrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-brand-primary/50 to-transparent"></div>

            <div className="space-y-4 text-sm sm:text-base text-brand-charcoal/70 font-light leading-relaxed">
              <p className="font-serif italic text-lg sm:text-xl text-brand-charcoal/90 not-italic">
                {service.description}
              </p>
              <p>{service.longDescription}</p>
            </div>

            {/* DURATION / PACKAGE SELECTORS */}
            {service.priceOptions && service.priceOptions.length > 1 && (
              <div className="space-y-3 sm:space-y-3.5 pt-2">
                <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/50 block">
                  Choose Ritual Duration
                </span>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                  {service.priceOptions.map((opt, optIdx) => (
                    <button
                      key={opt.duration}
                      onClick={() => setSelectedOptionIndex(optIdx)}
                      className={`sm:flex-1 sm:min-w-[120px] p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        selectedOptionIndex === optIdx
                          ? "bg-brand-primary/5 border-brand-primary text-brand-primary shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)]"
                          : "bg-white border-brand-border/80 hover:border-brand-primary/40 text-brand-charcoal/75"
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
            <div className="pt-2 sm:pt-4">
              <Button
                asChild
                className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-6 rounded-full shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 font-semibold"
              >
                <Link
                  href={`/booking?service=${service.id}`}
                  className="flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Reserve This Ritual</span>
                </Link>
              </Button>
            </div>

            {/* QUALITY SEALS */}
            <div className="flex items-start sm:items-center gap-3 pt-4 border-t border-brand-border/60">
              <ShieldCheck className="h-5 w-5 text-brand-primary shrink-0 mt-0.5 sm:mt-0" />
              <div className="space-y-0.5">
                <h5 className="text-[10px] tracking-wider uppercase font-bold text-brand-charcoal/80">
                  Guaranteed Serenity
                </h5>
                <p className="text-[11px] text-brand-charcoal/50 leading-relaxed">
                  Full service customizations with licensed practitioners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ADDITIONAL DETAILS SECTION */}
      <section className="relative bg-brand-card-cream/30 border-t border-brand-border/60 py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
            {/* BENEFITS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block">
                  Therapeutic Impact
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-charcoal tracking-tight">
                  Key Ritual Benefits
                </h2>
              </div>
              <div className="w-12 h-px bg-brand-primary/40"></div>
              <ul className="space-y-4 text-sm text-brand-charcoal/70 font-light">
                {service.benefits?.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-primary/75 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* THE JOURNEY STEPS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block">
                  The Experience
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-charcoal tracking-tight">
                  Your Sanctuary Journey
                </h2>
              </div>
              <div className="w-12 h-px bg-brand-primary/40"></div>
              <div className="space-y-5">
                {service.steps?.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary/5 border border-brand-primary/15 text-[11px] font-bold text-brand-primary shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-brand-charcoal/75 font-light leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
