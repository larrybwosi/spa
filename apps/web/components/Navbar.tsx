"use client";

import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@repo/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import { fetcherWithCredentials } from "../app/swr-fetcher";

export interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  navLinks?: NavLink[];
  activeHref?: string;
}

export function Navbar({ navLinks = [], activeHref }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User session with SWR
  const { data: sessionData, mutate: mutateSession } = useSWR(
    "http://localhost:3001/api/auth/session",
    fetcherWithCredentials,
    { shouldRetryOnError: false }
  );
  const user = sessionData?.user || null;

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

  return (
    <>
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-brand-primary group-hover:text-brand-primary-hover transition-colors font-semibold">
              AURA WELLNESS
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium uppercase text-brand-charcoal/80">
            {navLinks.map((link) => {
              const isActive = activeHref ? link.href === activeHref : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-brand-primary transition-colors py-2 relative group ${
                    isActive ? "text-brand-primary" : ""
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary transition-transform origin-left duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Book Now CTA / Auth */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 border-r pr-6 border-brand-border/60">
                <span className="text-[10px] uppercase tracking-widest font-sans text-brand-charcoal/70 font-semibold bg-brand-card-cream/50 px-3 py-1.5 rounded-full border border-brand-border">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors font-sans font-bold cursor-pointer bg-transparent border-0 p-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/booking"
                className="text-xs uppercase tracking-widest font-sans font-bold hover:text-brand-primary transition-colors text-brand-charcoal/85 cursor-pointer"
              >
                Sign In
              </Link>
            )}

            <Button
              asChild
              variant="default"
              className="text-xs uppercase tracking-[0.15em] bg-brand-primary text-white border border-brand-primary px-7 py-5 hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-lg font-medium"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-full hover:bg-brand-card-cream/40 bg-transparent border-0"
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
            >
              <span>{link.label}</span>
              <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </Link>
          ))}

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
                className="text-xs uppercase tracking-widest text-red-500 font-bold bg-transparent border-0 p-0 cursor-pointer"
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
            <Button
              asChild
              className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary text-white py-6 rounded-lg hover:bg-brand-primary-hover shadow-md"
            >
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
