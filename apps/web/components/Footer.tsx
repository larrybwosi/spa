"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { CheckCircle, Mail } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  exploreLinks?: FooterLink[];
}

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

const DEFAULT_EXPLORE_LINKS: FooterLink[] = [
  { label: "Home Sanctuary", href: "/" },
  { label: "Our Treatments", href: "/services" },
  { label: "Bespoke Products", href: "/products" },
  { label: "Book Experience", href: "/booking" },
];

export function Footer({ exploreLinks = DEFAULT_EXPLORE_LINKS }: FooterProps) {
  // Newsletter state
  const [email, setEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-brand-card-cream/60 border-t border-brand-border/60 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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
            <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75 list-none p-0 m-0">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
              LEGAL
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75 list-none p-0 m-0">
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
  );
}
