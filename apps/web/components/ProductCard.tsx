"use client";

import React from "react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-white border border-[#1C1B18]/10 overflow-hidden hover:border-[#A9784F]/40 transition-colors duration-300">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full bg-[#DCD3C2]/20 overflow-hidden block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-[#1C1B18]/90 backdrop-blur-xs px-3 py-1.5 text-[9px] font-label font-semibold uppercase tracking-widest text-[#F1ECE1]">
          {product.category}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-[#A9784F]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-[#A9784F]"
                    : "text-[#1C1B18]/15"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-body text-[#1C1B18]/45 font-medium">
            ({product.reviewsCount})
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="block flex-1">
          <h3 className="font-display text-xl text-[#1C1B18] line-clamp-1 mb-2 group-hover:text-[#A9784F] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[#1C1B18]/55 font-body font-light line-clamp-2 leading-relaxed mb-5">
            {product.description}
          </p>
        </Link>

        <div className="pt-5 border-t border-[#1C1B18]/10 flex items-center justify-between mt-auto">
          <span className="font-display text-lg text-[#1C1B18]">
            ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="text-[10px] font-label uppercase tracking-widest text-[#A9784F] font-semibold hover:text-[#93673F] flex items-center gap-1 group/btn"
          >
            <span>Details</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
