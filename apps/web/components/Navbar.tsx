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

  const { data: sessionData, mutate: mutateSession } = useSWR(
    "http://localhost:3001/api/auth/session",
    fetcherWithCredentials,
    { shouldRetryOnError: false },
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

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#F1ECE1]/90 backdrop-blur-md border-b border-[#1C1B18]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A9784F]" />
            <span className="font-display text-xl sm:text-2xl tracking-[0.08em] text-[#1C1B18] group-hover:text-[#A9784F] transition-colors">
              Aura Wellness
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-9 text-[11px] font-label tracking-[0.18em] uppercase text-[#1C1B18]/70">
            {navLinks.map((link) => {
              const isActive = activeHref ? link.href === activeHref : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group py-2 hover:text-[#1C1B18] transition-colors ${
                    isActive ? "text-[#1C1B18]" : ""
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-px bg-[#A9784F] transition-transform origin-left duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA / Auth */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 border-r pr-6 border-[#1C1B18]/15">
                <span className="text-[10px] font-label uppercase tracking-widest text-[#1C1B18]/70 font-semibold">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-label uppercase tracking-widest text-[#A9784F] hover:text-[#93673F] transition-colors font-semibold cursor-pointer bg-transparent border-0 p-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/booking"
                className="text-[11px] font-label uppercase tracking-widest font-semibold hover:text-[#A9784F] transition-colors text-[#1C1B18]/80 cursor-pointer"
              >
                Sign In
              </Link>
            )}

            <Button
              asChild
              variant="default"
              className="text-[11px] font-label uppercase tracking-[0.15em] bg-[#1C1B18] text-[#F1ECE1] border border-[#1C1B18] px-7 py-5 hover:bg-[#1C1B18]/85 rounded-none font-semibold transition-colors"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#1C1B18] hover:text-[#A9784F] transition-colors bg-transparent border-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-30 bg-[#1C1B18] transition-all duration-500 ease-in-out transform lg:hidden ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        } pt-24 px-6 sm:px-12`}
      >
        <nav className="flex flex-col space-y-1 font-display text-2xl text-[#F1ECE1]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#A9784F] transition-colors py-4 border-b border-[#F1ECE1]/10 flex justify-between items-center group"
            >
              <span>{link.label}</span>
              <ChevronRight className="h-4 w-4 text-[#A9784F] opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </Link>
          ))}

          {user ? (
            <div className="py-5 border-b border-[#F1ECE1]/10 flex items-center justify-between font-body text-sm">
              <span className="text-[#F1ECE1]/70">Hello, {user.name}</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-[10px] font-label uppercase tracking-widest text-[#A9784F] font-bold bg-transparent border-0 p-0 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#A9784F] transition-colors py-4 border-b border-[#F1ECE1]/10 flex justify-between items-center"
            >
              <span>Sign In</span>
              <ChevronRight className="h-4 w-4 text-[#A9784F]" />
            </Link>
          )}

          <div className="pt-8">
            <Button
              asChild
              className="w-full text-xs font-label uppercase tracking-[0.2em] bg-[#A9784F] text-[#1C1B18] py-6 rounded-none font-semibold hover:bg-[#93673F]"
            >
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                Book Now
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
