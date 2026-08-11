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
  const [email, setEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setNewsletterSubmitted(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#1C1B18] pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9784F]" />
              <span className="font-display text-2xl tracking-[0.08em] text-[#F1ECE1]">
                Aura Wellness
              </span>
            </div>
            <p className="text-sm text-[#DCD3C2]/60 font-body font-light leading-relaxed max-w-sm">
              A sanctuary for restorative therapies and quiet luxury care, built
              around one idea: rest, done properly, is a craft.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#F1ECE1]/15 flex items-center justify-center text-[#DCD3C2]/70 hover:text-[#A9784F] hover:border-[#A9784F]/50 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#F1ECE1]/15 flex items-center justify-center text-[#DCD3C2]/70 hover:text-[#A9784F] hover:border-[#A9784F]/50 transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-[10px] font-label tracking-[0.25em] font-semibold uppercase text-[#DCD3C2]/40">
              Explore
            </h4>
            <ul className="space-y-3 text-sm font-body text-[#DCD3C2]/70 list-none p-0 m-0">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#A9784F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-[10px] font-label tracking-[0.25em] font-semibold uppercase text-[#DCD3C2]/40">
              Legal
            </h4>
            <ul className="space-y-3 text-sm font-body text-[#DCD3C2]/70 list-none p-0 m-0">
              <li>
                <a href="#" className="hover:text-[#A9784F] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#A9784F] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#A9784F] transition-colors">
                  Spa Etiquette
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="text-[10px] font-label tracking-[0.25em] font-semibold uppercase text-[#DCD3C2]/40">
              Newsletter
            </h4>
            <p className="text-sm text-[#DCD3C2]/60 font-body font-light leading-relaxed mb-1">
              Seasonal wellness notes, ritual announcements, and priority
              booking windows. No noise.
            </p>

            {newsletterSubmitted ? (
              <div className="flex items-center gap-3 p-4 bg-[#3F4F41]/40 border border-[#3F4F41] text-[#DCD3C2] text-sm">
                <CheckCircle className="h-5 w-5 shrink-0 text-[#A9784F]" />
                <span>Thank you — you're on the list.</span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col gap-2.5"
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DCD3C2]/40" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#F1ECE1]/5 border-[#F1ECE1]/15 text-[#F1ECE1] placeholder:text-[#DCD3C2]/40 rounded-none pl-11 py-5 h-11 text-sm font-body focus-visible:ring-[#A9784F]/40"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-[11px] font-label uppercase tracking-[0.2em] bg-[#A9784F] hover:bg-[#93673F] text-[#1C1B18] border-none py-5 rounded-none font-semibold cursor-pointer"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#F1ECE1]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DCD3C2]/40 font-body tracking-wide">
          <span>© 2026 Wellness Sanctuary. All rights reserved.</span>
          <span className="italic font-display text-[#DCD3C2]/55">
            Designed with intent
          </span>
        </div>
      </div>
    </footer>
  );
}
