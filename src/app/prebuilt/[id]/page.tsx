'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ALL_PREBUILTS } from '@/lib/data/prebuilts';
import { ALL_PARTS } from '@/lib/data/parts';
import { useStore } from '@/lib/context/StoreContext';
import { ETABadge } from '@/components/common/ETABadge';
import { SpecAccordion } from '@/components/common/SpecAccordion';
import { PCModelCanvas } from '@/components/3d/PCModelCanvas';
import {
  Package,
  Wrench,
  ShoppingBag,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Share2,
  ArrowRight,
  Flame,
  Volume2,
  Cpu,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function PrebuiltDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addToCart, loadPrebuiltIntoConfigurator } = useStore();

  const [activeTab, setActiveTab] = useState<'3d' | 'gallery'>('3d');
  const [copiedLink, setCopiedLink] = useState(false);

  const pc = ALL_PREBUILTS.find((p) => p.id === id) || ALL_PREBUILTS[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: `prebuilt-${pc.id}-${Date.now()}`,
      type: 'prebuilt',
      productId: pc.id,
      title: pc.name,
      subtitle: `${pc.headlineSpecs.cpu} • ${pc.headlineSpecs.gpu}`,
      price: pc.price,
      image: pc.image,
      leadTimeTier: pc.leadTimeTier,
    });
  };

  const handleCustomize = () => {
    loadPrebuiltIntoConfigurator(pc);
    router.push('/build');
  };

  // Resolve parts in this prebuilt
  const resolvedParts = Object.entries(pc.partsList)
    .map(([cat, partId]) => {
      const part = ALL_PARTS.find((p) => p.id === partId);
      return { category: cat.replace('Id', ''), part };
    })
    .filter((item) => !!item.part);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/prebuilt" className="hover:text-white transition-colors">Prebuilts</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cyan-400 font-semibold">{pc.name}</span>
      </nav>

      {/* Main Hero: 3D/Gallery Showcase + Buying Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: 3D Model with 360 Spin / Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* View Toggles */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('3d')}
                className={`btn-pill px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === '3d'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-white/5 text-gray-400 border border-white/10'
                }`}
              >
                Interactive 3D & 360° Spin
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`btn-pill px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-white/5 text-gray-400 border border-white/10'
                }`}
              >
                Photography Gallery
              </button>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Visual Canvas Container */}
          <div className="relative rounded-3xl glass-panel-elevated p-2 border border-white/15 overflow-hidden">
            {activeTab === '3d' ? (
              <PCModelCanvas initialColor={pc.caseColor} initialRgb="Cyan" showControls={true} />
            ) : (
              <div className="w-full h-80 sm:h-[450px] relative overflow-hidden rounded-2xl bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pc.image}
                  alt={pc.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Acoustics and Form Factor Chips */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-cyan-400" />
                Acoustics
              </span>
              <span className="font-semibold text-gray-200">{pc.noiseLevel}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" />
                Form Factor
              </span>
              <span className="font-semibold text-gray-200">{pc.size}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Finish
              </span>
              <span className="font-semibold text-gray-200">{pc.caseColor}</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Price, Delivery ETA, Headline Specs & Buy Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {pc.useCase}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{pc.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({pc.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{pc.name}</h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{pc.tagline}</p>
          </div>

          {/* Pricing & EMI */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300">
                  ${pc.price.toLocaleString()}
                </span>
                {pc.originalPrice && (
                  <span className="text-xs text-gray-400 line-through ml-2 font-mono">
                    ${pc.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">
                or ${pc.emiPricePerMonth}/mo with 0% EMI
              </span>
            </div>

            <div className="mt-2">
              <ETABadge tier={pc.leadTimeTier} inStock={true} showCountdown={true} />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="btn-pill w-full bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold py-4 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart ({pc.leadTimeTier}-Day Express Delivery)</span>
            </button>

            <button
              onClick={handleCustomize}
              className="btn-pill w-full bg-white/10 hover:bg-white/20 text-white border border-white/15 py-3.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Customize This Build in Configurator</span>
            </button>
          </div>

          {/* "Who Is This For?" Callout */}
          <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/30 flex flex-col gap-2 text-xs">
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
              Who is this system engineered for?
            </span>
            <p className="text-cyan-200 leading-relaxed">{pc.whoIsThisFor}</p>
          </div>

          {/* Warranty & Guarantee */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-gray-300">
            <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
            <span>{pc.includedWarranty}</span>
          </div>
        </div>
      </div>

      {/* Benchmark Verification Charts */}
      <section className="pt-8 border-t border-white/10 flex flex-col gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            48h Torture Laboratory Telemetry
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Performance Benchmarks
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real frames recorded across native 4K and heavy compute workloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pc.benchmarks.map((b, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between gap-3"
            >
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">{b.gameOrApp}</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{b.title}</h4>
                <p className="text-[11px] text-gray-400 mt-1">{b.resolution}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-baseline justify-between">
                <span className="text-xl font-black font-mono text-cyan-300">{b.score}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{b.comparisonBaseline}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mandatory 3-Layer Specifications */}
      <section className="pt-8 border-t border-white/10 flex flex-col gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Engineering Breakdown
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Comprehensive Specifications
          </h2>
        </div>

        <SpecAccordion specs={pc.specs} defaultExpanded={true} />
      </section>

      {/* Included Parts Breakdown with Direct Links */}
      <section className="pt-8 border-t border-white/10 flex flex-col gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Certified Components
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Components Inside This Build
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Click any component to inspect its individual silicon specifications, die sizes, and warranty coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedParts.map((item, idx) => {
            const part = item.part!;
            return (
              <Link
                key={idx}
                href={`/parts/${part.id}`}
                className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-12 h-12 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{item.category}</span>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {part.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">${part.price}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
