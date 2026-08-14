"use client";

import React, { useMemo } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import useSWR from "swr";
import { defaultFetcher } from "../swr-fetcher";
import { API_ENDPOINTS } from "../../lib/api";
import { ShieldCheck, Droplet, Coffee, Sparkles } from "lucide-react";
import { ServiceCard } from "../../components/ServiceCard";
import { getServiceById, ServiceDetail } from "./services-data";

interface ApiService {
  id: string;
  name?: string;
  category?: { name: string };
  description?: string;
  duration?: number;
  price?: number;
}

const servicesNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Book Session", href: "/booking" },
];

const categoryCopy: Record<string, string> = {
  "Massage Therapy":
    "Release tension and restore vitality through massage therapies designed to soothe mind and body in equal measure.",
  "Skin Care":
    "Bespoke facial treatments built on premium botanical ingredients and unhurried, precise technique.",
  "Holistic Wellness":
    "Integrative therapies aimed at aligning your energy and supporting wellbeing from within.",
};

function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#F1ECE1] border border-[#1C1B18]/10 p-7 space-y-4">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex justify-between items-center pt-4">
        {/* Category Skeleton */}
        <Skeleton className="h-4 w-1/4" />
        {/* Duration Skeleton */}
        <Skeleton className="h-4 w-1/6" />
      </div>
      {/* Name Skeleton */}
      <Skeleton className="h-7 w-3/4" />
      {/* Description Skeleton */}
      <Skeleton className="h-12 w-full" />
      <div className="pt-5 border-t border-[#1C1B18]/10">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { data: apiServices, error, isLoading } = useSWR(
    API_ENDPOINTS.services(),
    defaultFetcher,
  );

  const services = useMemo<ServiceDetail[]>(() => {
    if (Array.isArray(apiServices?.data)) {
      return apiServices?.data.map((apiSvc: ApiService) => {
        const localMeta = getServiceById(apiSvc.id);
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
          category: apiSvc?.category?.name || "Holistic Wellness",
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
      });
    }
    return [];
  }, [apiServices]);

  const categories = useMemo(() => {
    const list = new Set(["Massage Therapy", "Skin Care", "Holistic Wellness"]);
    services.forEach((s: ServiceDetail) => {
      if (s.category) {
        list.add(s.category);
      }
    });
    return Array.from(list);
  }, [services]);

  const getServicesByCategory = (category: string): ServiceDetail[] => {
    return services.filter(
      (s: ServiceDetail) => s.category?.toLowerCase() === category.toLowerCase(),
    );
  };

  const getCategoryCopy = (cat: string): string => {
    if (categoryCopy[cat]) return categoryCopy[cat];
    return `Specialized rituals and tailored therapies to restore alignment, custom-crafted for your personal wellness needs.`;
  };

  const fontStyles = (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap");

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
        <Navbar navLinks={servicesNavLinks} activeHref="/services" />

        {/* HERO */}
        <section className="relative bg-[#1C1B18] py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-5">
              Our Offerings
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F1ECE1] leading-tight mb-6">
              Curated wellness,
              <br />
              <span className="italic text-[#DCD3C2]/80">
                held with intention
              </span>
            </h1>
          </div>
        </section>

        {/* SKELETON LIST */}
        <section className="py-24 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="space-y-10">
            <div className="border-b border-[#1C1B18]/10 pb-7">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
        {fontStyles}
        <Navbar navLinks={servicesNavLinks} activeHref="/services" />

        {/* HERO */}
        <section className="relative bg-[#1C1B18] py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-5">
              Our Offerings
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F1ECE1] leading-tight mb-6">
              Curated wellness,
              <br />
              <span className="italic text-[#DCD3C2]/80">
                held with intention
              </span>
            </h1>
          </div>
        </section>

        {/* ERROR STATE */}
        <main className="py-24 sm:py-32 max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex w-16 h-16 bg-[#A9784F]/10 text-[#A9784F] rounded-full items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1C1B18]">
            Rituals Unavailable
          </h2>
          <p className="text-sm text-[#1C1B18]/65 font-body font-light leading-relaxed">
            We are currently unable to load the treatment menu. Please check your network connection or try again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="text-xs font-label uppercase tracking-widest bg-[#1C1B18] text-[#F1ECE1] px-8 py-5 rounded-none hover:bg-[#1C1B18]/85 font-semibold"
          >
            Retry Connection
          </Button>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
      {fontStyles}

      <Navbar navLinks={servicesNavLinks} activeHref="/services" />

      {/* HERO */}
      <section className="relative bg-[#1C1B18] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-5">
            Our Offerings
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F1ECE1] leading-tight mb-6">
            Curated wellness,
            <br />
            <span className="italic text-[#DCD3C2]/80">
              held with intention
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#DCD3C2]/70 max-w-2xl mx-auto font-body font-light leading-relaxed">
            A sanctuary of rejuvenation, where tailored treatments blend
            time-honored technique with modern therapeutic practice.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {categories.map((category) => {
          const servicesInCategory = getServicesByCategory(category);
          if (servicesInCategory.length === 0) return null;

          return (
            <div key={category} className="space-y-10">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#1C1B18]/10 pb-7">
                <div className="max-w-xl">
                  <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-3">
                    Rituals
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl text-[#1C1B18] leading-tight">
                    {category}
                  </h2>
                </div>
                <p className="text-sm text-[#1C1B18]/60 font-body font-light leading-relaxed max-w-sm">
                  {getCategoryCopy(category)}
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1C1B18]/10">
                {servicesInCategory.map((service, idx) => (
                  <ServiceCard key={service.id} service={service} index={idx} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* AMENITIES */}
      <section className="bg-[#3F4F41] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
          {[
            {
              icon: ShieldCheck,
              title: "Licensed Experts",
              copy: "Every therapist on our roster holds full certification, specializing in restorative therapy and customized skincare.",
            },
            {
              icon: Droplet,
              title: "Botanical Blends",
              copy: "Our skincare range is blended daily from pure cold-pressed botanicals, at the highest active-ingredient concentrations.",
            },
            {
              icon: Coffee,
              title: "Post-Ritual Lounge",
              copy: "Conclude your session in our sound-filtered relaxation room, with seasonal herbal infusions and quiet.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F1ECE1]/10 flex items-center justify-center text-[#A9784F] mx-auto lg:mx-0">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-[#F1ECE1]">{title}</h3>
              <p className="text-sm text-[#DCD3C2]/65 font-body font-light leading-relaxed">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
