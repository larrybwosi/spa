"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import useSWR from "swr";
import { defaultFetcher } from "../swr-fetcher";
import { FALLBACK_SERVICES, ServiceDetail } from "./services-data";
import {
  ChevronRight,
  ShieldCheck,
  Droplet,
  Coffee
} from "lucide-react";

const servicesNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Book Session", href: "/booking" },
];

export default function ServicesPage() {
  // Fetch API services with SWR (cached & performance-optimized)
  useSWR("http://localhost:3001/api/services", defaultFetcher, {
    onError: (e) => {
      console.warn("Could not fetch API services, using detailed static services.", e);
    }
  });

  // Group services by category
  const categories = ["Massage Therapy", "Skin Care", "Holistic Wellness"];

  // Helper to map our fallback or API list dynamically
  const getServicesByCategory = (category: string): ServiceDetail[] => {
    return FALLBACK_SERVICES.filter(s => s.category.toLowerCase() === category.toLowerCase());
  };

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">

      {/* HEADER / NAVIGATION */}
      <Navbar navLinks={servicesNavLinks} activeHref="/services" />

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

      {/* CATEGORIES OF OFFERINGS */}
      <section className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {categories.map((category) => {
          const servicesInCategory = getServicesByCategory(category);

          return (
            <div key={category} className="space-y-10">
              {/* Category Header */}
              <div className="border-b border-brand-border/60 pb-6 max-w-3xl">
                <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block mb-2">
                  Rituals
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-brand-charcoal tracking-wide mb-3">
                  {category}
                </h2>
                <p className="text-xs sm:text-sm text-brand-charcoal/65 font-sans font-light leading-relaxed">
                  {category === "Massage Therapy" &&
                    "Release tension and restore vitality through our expertly crafted massage therapies, designed to soothe both mind and body."}
                  {category === "Skin Care" &&
                    "Reveal your natural luminosity with our bespoke facial treatments, utilizing premium botanical ingredients and advanced techniques."}
                  {category === "Holistic Wellness" &&
                    "Integrative therapies aimed at aligning your energy and promoting comprehensive wellbeing from within."}
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesInCategory.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-brand-border/40 hover:border-brand-primary/20 transition-all duration-300"
                  >
                    {/* Service Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image}
                        alt={service.name}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-brand-charcoal/5 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-6 space-y-3">
                      <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-bold text-brand-primary/80">
                        {service.category}
                      </span>

                      <h3 className="text-xl font-serif text-brand-charcoal group-hover:text-brand-primary transition-colors duration-300 leading-tight font-medium">
                        {service.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed flex-1 line-clamp-3">
                        {service.description}
                      </p>

                      {/* View More Button */}
                      <div className="pt-4 flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-sans font-bold text-brand-charcoal/80 group-hover:text-brand-primary transition-colors duration-300">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
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
      <Footer />

    </div>
  );
}
