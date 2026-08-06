"use client";

import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../swr-fetcher";
import { FALLBACK_SERVICES, ServiceDetail } from "./services-data";
import { ShieldCheck, Droplet, Coffee } from "lucide-react";
import { ServiceCard } from "../../components/ServiceCard";

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

export default function ServicesPage() {
  useSWR("http://localhost:3001/api/services", defaultFetcher, {
    onError: (e) => {
      console.warn(
        "Could not fetch API services, using detailed static services.",
        e,
      );
    },
  });

  const categories = ["Massage Therapy", "Skin Care", "Holistic Wellness"];

  const getServicesByCategory = (category: string): ServiceDetail[] => {
    return FALLBACK_SERVICES.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase(),
    );
  };

  return (
    <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
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
                  {categoryCopy[category]}
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
