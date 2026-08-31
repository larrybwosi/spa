import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F1ECE1] text-[#1C1B18] flex flex-col items-center justify-center p-6 font-sans">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#A9784F]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-[#A9784F] border-t-transparent animate-spin" />
        </div>
        <div className="space-y-1 text-center">
          <span className="font-display text-xl tracking-[0.08em] text-[#1C1B18] block">
            Aura Wellness
          </span>
          <span className="text-[10px] font-label uppercase tracking-[0.25em] text-[#1C1B18]/50 block">
            Preparing Sanctuary...
          </span>
        </div>
      </div>
    </div>
  );
}
