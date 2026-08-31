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
import { ServiceDetail } from "../services-data";
import { API_ENDPOINTS } from "../../../lib/api";
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
    id ? API_ENDPOINTS.serviceDetail(id) : null,
    defaultFetcher,
  );

  const service = useMemo(() => {
    const rawData = apiSvc?.data || apiSvc;
    if (rawData && rawData.id) {
      const price =
        typeof rawData.price === "number" ? rawData.price : 120;
      const duration =
        typeof rawData.duration === "number" ? rawData.duration : 60;
      const catName =
        typeof rawData.category === "object" && rawData.category !== null
          ? rawData.category.name
          : typeof rawData.category === "string"
            ? rawData.category
            : "Specialty Ritual";

      return {
        id: rawData.id,
        name: rawData.name || "Bespoke Treatment",
        category: catName,
        description:
          rawData.description || "An exclusive luxury therapy.",
        longDescription:
          rawData.description ||
          "Indulge in a premium, beautifully tailored therapeutic sanctuary experience designed to align your physical and mental wellbeing.",
        price,
        duration,
        priceOptions: [{ duration, price }],
        image:
          rawData.image ||
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
        benefits: [
          "Restores metabolic and energy balance",
          "Relieves localized muscle and tissue soreness",
          "Promotes absolute mindfulness and physical calm",
        ],
        steps: [
          "Sensory and dietary profiling",
          "Targeted luxury body massage flow",
          "Closing hot herbal compress",
        ],
      } as ServiceDetail;
    }

    return null;
  }, [apiSvc]);

  const loading = serviceLoading && !apiSvc && !serviceError;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal font-sans">
        <Navbar navLinks={serviceDetailNavLinks} activeHref="/services" />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <Skeleton className="h-4 w-64" />
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-20 items-start">
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              <Skeleton className="aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl" />
            </div>

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

              <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-charcoal font-sans">
        <Navbar navLinks={serviceDetailNavLinks} activeHref="/services" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <EmptyState
            title="Treatment Not Found"
            description="The requested luxury treatment is currently unavailable or doesn't exist in our catalog."
            icon={Sparkles}
            actionLabel="Back to Menu"
            onAction={() => window.location.href = "/services"}
          />
        </main>

        <Footer />
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
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-md h-md rounded-full bg-brand-primary/6 blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-md h-md rounded-full bg-brand-primary/4 blur-3xl"></div>
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
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="group relative aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f4efeb] border border-brand-border/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none z-10"></div>

              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary shadow-sm border border-white/60">
                {service.category}
              </div>

              <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" />
                Signature
              </div>
            </div>
          </div>

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
                    Ksh {activePrice}
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
                        Ksh {opt.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
