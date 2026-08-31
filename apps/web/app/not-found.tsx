import React from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1C1B18] text-[#F1ECE1] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md space-y-6">
        <span className="text-[11px] font-label tracking-[0.35em] text-[#A9784F] uppercase font-semibold block">
          404 — Page Not Found
        </span>

        <h1 className="font-display text-5xl sm:text-6xl text-[#F1ECE1] leading-tight">
          Lost in the
          <br />
          <span className="italic font-normal text-[#A9784F]">stillness</span>
        </h1>

        <p className="text-sm text-[#DCD3C2]/70 font-body font-light leading-relaxed">
          The page or treatment ritual you are searching for does not exist or has been moved to a new space in our sanctuary.
        </p>

        <div className="pt-4">
          <Button
            asChild
            className="text-xs font-label uppercase tracking-[0.2em] bg-[#A9784F] hover:bg-[#93673F] text-[#1C1B18] border-none px-8 py-6 rounded-none font-semibold transition-colors"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Sanctuary</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
