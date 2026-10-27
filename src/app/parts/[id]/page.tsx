'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ALL_PARTS } from '@/lib/data/parts';
import { useStore } from '@/lib/context/StoreContext';
import { ETABadge } from '@/components/common/ETABadge';
import { SpecAccordion } from '@/components/common/SpecAccordion';
import { isPartCompatibleWithBuild } from '@/lib/compatibility';
import {
  Cpu,
  ShoppingBag,
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  ChevronRight,
  Share2,
  Check,
  Wrench,
} from 'lucide-react';

export default function PartDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart, currentBuild, setBuildPart } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const part = ALL_PARTS.find((p) => p.id === id) || ALL_PARTS[0];
  const compCheck = isPartCompatibleWithBuild(part, currentBuild);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: `part-${part.id}-${Date.now()}`,
        type: 'part',
        productId: part.id,
        title: part.name,
        subtitle: `${part.brand} • ${part.category.toUpperCase()}`,
        price: part.price,
        image: part.image,
        leadTimeTier: part.leadTimeTier,
      },
      quantity
    );
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/parts" className="hover:text-white transition-colors">Parts Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="capitalize">{part.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cyan-400 font-semibold truncate max-w-xs">{part.name}</span>
      </nav>

      {/* Hero Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 6 Cols: Product Imagery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative rounded-3xl glass-panel-elevated p-6 border border-white/15 overflow-hidden flex items-center justify-center bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={part.image}
              alt={part.name}
              className="w-full max-h-[420px] object-contain rounded-2xl"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>Genuine Factory Sealed Stock • SKU: SB-{part.id.toUpperCase()}</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Details, Compatibility, Pricing & Add to Cart */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                {part.brand} • {part.category}
              </span>

              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{part.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({part.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {part.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-1">{part.tagline}</p>
          </div>

          {/* Pricing & ETA Card */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300">
                ${part.price.toLocaleString()}
              </span>
              {part.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-mono">
                  MSRP ${part.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <ETABadge tier={part.leadTimeTier} inStock={part.inStock} showCountdown={true} />
          </div>

          {/* Live Compatibility Status with User's Active Build */}
          <div className="p-4 rounded-2xl border flex flex-col gap-1.5 text-xs">
            {compCheck.compatible ? (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Compatible with your current active SoftBuild configuration.</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-red-400 font-semibold">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Compatibility conflict with current build: {compCheck.reason}</span>
              </div>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-white/10 rounded-2xl p-1 bg-black/40 w-32 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-gray-400 hover:text-white rounded-xl"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-mono font-bold px-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-gray-400 hover:text-white rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!part.inStock}
              className="btn-pill flex-1 bg-[#00E5FF] hover:bg-[#00C2FF] disabled:opacity-40 text-[#0A0B0D] font-bold py-4 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart ({part.leadTimeTier}-Day Dispatch)</span>
            </button>

            {/* Slot into Configurator Button */}
            <button
              onClick={() => {
                setBuildPart(part.category, part);
              }}
              className="btn-pill px-4 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
              title="Slot this part directly into your active configurator machine"
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Use in My Build</span>
            </button>
          </div>

          {/* Quality & Warranty Guarantee */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-gray-300">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Official authorized distributor warranty with direct 1-to-1 express replacement.</span>
          </div>
        </div>
      </div>

      {/* Mandatory 3-Layer Specifications */}
      <section className="pt-8 border-t border-white/10 flex flex-col gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Component Engineering Data
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Technical Specifications
          </h2>
        </div>

        <SpecAccordion specs={part.specs} defaultExpanded={true} />
      </section>
    </div>
  );
}
