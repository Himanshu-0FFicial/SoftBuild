'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JourneyButtons } from '@/components/common/JourneyButtons';
import { PCModelCanvas } from '@/components/3d/PCModelCanvas';
import { ETABadge } from '@/components/common/ETABadge';
import { ALL_PREBUILTS } from '@/lib/data/prebuilts';
import { ALL_PARTS } from '@/lib/data/parts';
import { TRADE_IN_PRICING_TABLE } from '@/lib/constants';
import { useStore } from '@/lib/context/StoreContext';
import {
  Wrench,
  Package,
  Cpu,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gamepad2,
  Clock,
  Sparkles,
  Layers,
  Award,
  Star,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Flame,
  Phone,
  MessageSquare,
  Mail,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, loadPrebuiltIntoConfigurator } = useStore();

  // Instant Trade-In Mini Calculator State
  const [sellCat, setSellCat] = useState<'gpu' | 'cpu' | 'ram' | 'storage'>('gpu');
  const [sellModel, setSellModel] = useState('rtx 4090');
  const [sellCondition, setSellCondition] = useState<'likeNew' | 'good' | 'fair' | 'forParts'>('likeNew');

  // Configurator Teaser Step Animation
  const [teaserStep, setTeaserStep] = useState(0);

  const teaserParts = [
    { name: 'Chassis Frame', part: 'Lian Li O11 Dynamic EVO Pillarless Glass', icon: Layers, metric: '4.0mm Glass' },
    { name: 'Motherboard & VRM', part: 'ROG Maximus Z790 Dark Hero 20+1 Phases', icon: Cpu, metric: '90A Stages' },
    { name: 'Processor', part: 'Intel Core i9-14900KS 6.2 GHz Raptor Lake', icon: Zap, metric: '6.20 GHz' },
    { name: 'Liquid Cooling AIO', part: 'NZXT Kraken Elite 360 LCD 60Hz Screen', icon: Sparkles, metric: '640x640 LCD' },
    { name: 'Graphics Card', part: 'ASUS ROG Strix RTX 4090 24GB GDDR6X', icon: Gamepad2, metric: '16,384 Cores' },
    { name: 'Memory & Storage', part: '64GB Trident Z5 DDR5-6400 + 4TB 990 PRO', icon: Sliders, metric: '7,450 MB/s' },
  ];

  // Calculate trade-in estimate
  const currentPricing = TRADE_IN_PRICING_TABLE.find(
    (p) => p.category === sellCat && p.modelQuery.toLowerCase().includes(sellModel.toLowerCase())
  ) || TRADE_IN_PRICING_TABLE[0];

  const estimatedValue = currentPricing[sellCondition] || 1200;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ========================================================
          3. HERO SECTION
          Headline "Built like nothing else.", promise, 4 journey buttons,
          3D PC model, and scroll mask reveal
      ======================================================== */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-16 overflow-hidden">
        {/* Soft Ambient Radial Glow Behind Model */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Giant Headline, Promise & The 4 Strict Buttons */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs uppercase font-mono-spec tracking-widest text-cyan-300 font-semibold">
                SoftBuild Luxury Hardware • 2026 Fleet
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gradient leading-[1.05]">
              Built like <br />
              <span className="text-gradient-cyan">nothing else.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
              Every machine is hand-crafted with aerospace millimeter tolerances, tuned for whisper-quiet acoustics, and subjected to a relentless 48-hour synthetic stress test before it ever enters a shipping crate.
            </p>

            {/* The 4 Journey Buttons in Strict Order */}
            <div className="pt-2">
              <JourneyButtons size="lg" layout="wrap" />
            </div>

            {/* Quick Guarantees Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>3-Year Hardware Concierge</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>48-Hour Burn-In Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Express 4 to 10 Day Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D PC Model Canvas with Exploded View */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full rounded-3xl glass-panel-elevated p-2 border border-white/15 overflow-hidden group">
              <PCModelCanvas initialColor="Obsidian Black" initialRgb="Cyan" showControls={true} />
              
              <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Interactive 3D Engine: Drag to rotate, test chassis colors
                </span>
                <span className="font-mono text-cyan-300">SOFTBUILD 3D</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. "FOUR WAYS IN" SECTION
          4 large cards: Build / Prebuilt / Parts / Sell
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold block mb-2">
            The SoftBuild Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Four ways into high-performance computing.
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            Whether you want complete granular control part by part, a pre-tested flagship ready in 4 days, or cash for your existing silicon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Build Your PC */}
          <Link
            href="/build"
            className="group relative p-7 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Way 01</span>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Customize & Build
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Step-by-step 12-stage configurator with real-time socket compatibility, clearance engines, and live 3D preview.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Start Your Config</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Buy a Prebuilt PC */}
          <Link
            href="/prebuilt"
            className="group relative p-7 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">Way 02</span>
              <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">
                Prebuilt Flagships
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                8 curated luxury rigs engineered for 4K gaming, cinema rendering, and local AI inference. Ships in 6 days.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-gray-300 group-hover:translate-x-1 transition-transform">
              <span>Explore 8 Models</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Buy Individual Parts */}
          <Link
            href="/parts"
            className="group relative p-7 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">Way 03</span>
              <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">
                Individual Components
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                40+ individually certified components. Express 4-day delivery on in-stock CPUs, GPUs, RAM, and SSDs.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-gray-300 group-hover:translate-x-1 transition-transform">
              <span>Browse 40+ Parts</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Sell Your PC Parts */}
          <Link
            href="/sell"
            className="group relative p-7 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Way 04</span>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Sell Your Parts
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Instant algorithm quote for your GPU, CPU, or RAM. Free courier pickup, inspection, and immediate bank payout.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Get Instant Valuation</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED PREBUILTS
          Horizontal scroll / showcase of 6 cards
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold block mb-2">
              Factory Certified Assemblies
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured Flagship Prebuilts
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Shipped inside custom molded military-grade crates with 48h burn-in telemetry charts.
            </p>
          </div>

          <Link
            href="/prebuilt"
            className="btn-pill px-6 py-2.5 rounded-full border border-white/20 hover:border-white/50 text-xs font-semibold text-white flex items-center gap-2"
          >
            <span>View All 8 Systems</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PREBUILTS.slice(0, 6).map((pc) => (
            <div
              key={pc.id}
              className="group rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image & Badges */}
              <div className="relative h-64 overflow-hidden bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pc.image}
                  alt={pc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {pc.useCase}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/40">
                    {pc.benchmarkBadge}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <ETABadge tier={pc.leadTimeTier} compact={true} />
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {pc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{pc.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {pc.tagline}
                  </p>

                  {/* 3 Headline Specs */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Processor</span>
                      <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.cpu}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Graphics</span>
                      <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.gpu}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Memory</span>
                      <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.ram}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Storage</span>
                      <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.storage}</span>
                    </div>
                  </div>
                </div>

                {/* Price, EMI & Action Buttons */}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black font-mono text-cyan-300">
                        ${pc.price.toLocaleString()}
                      </span>
                      {pc.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-2 font-mono">
                          ${pc.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      or ${pc.emiPricePerMonth}/mo with 0% APR
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Link
                      href={`/prebuilt/${pc.id}`}
                      className="btn-pill text-center py-2.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      View Specs & 3D
                    </Link>

                    <button
                      onClick={() => {
                        loadPrebuiltIntoConfigurator(pc);
                        router.push('/build');
                      }}
                      className="btn-pill text-center py-2.5 text-xs font-bold bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] transition-colors"
                    >
                      Customize Rig
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. CONFIGURATOR TEASER
          Pinned interactive step assembly: parts assemble live!
      ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-elevated border border-white/15 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Step Selector */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold block mb-2">
                  Interactive Assembly Teaser
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Hand-crafted layer by layer.
                </h2>
                <p className="text-sm text-gray-300 mt-2">
                  Click through the assembly sequence to inspect the structural engineering inside a flagship SoftBuild computer.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {teaserParts.map((t, idx) => {
                  const Icon = t.icon;
                  const isActive = teaserStep === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setTeaserStep(idx)}
                      className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                          : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{t.name}</span>
                          <span className="text-[11px] text-gray-400">{t.part}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-cyan-300">{t.metric}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/build"
                  className="btn-pill bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold px-8 py-3.5 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] inline-flex items-center gap-2"
                >
                  <span>Launch Full 12-Step Configurator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right side: 3D Visualization */}
            <div className="lg:col-span-6 relative flex flex-col items-center">
              <div className="w-full h-80 sm:h-[400px] rounded-3xl bg-black/40 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                <PCModelCanvas initialColor="Obsidian Black" initialRgb="Cyan" showControls={false} />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Assembly Step 0{teaserStep + 1} of 06 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. STATS BAND WITH COUNT-UP NUMBERS
          (builds shipped, parts in stock, avg build time, warranty years)
      ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-y border-white/[0.08] relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              14,280<span className="text-cyan-400">+</span>
            </span>
            <span className="text-xs uppercase font-medium tracking-wider text-gray-400 mt-1">
              Custom Builds Shipped
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              99.8<span className="text-cyan-400">%</span>
            </span>
            <span className="text-xs uppercase font-medium tracking-wider text-gray-400 mt-1">
              48h Torture Test Pass Rate
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              4 to 10
            </span>
            <span className="text-xs uppercase font-medium tracking-wider text-gray-400 mt-1">
              Strict Max Days Delivery
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              3 <span className="text-cyan-400">Years</span>
            </span>
            <span className="text-xs uppercase font-medium tracking-wider text-gray-400 mt-1">
              Concierge Hardware Warranty
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SHOP PARTS BY CATEGORY (BENTO GRID)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold block mb-2">
              Hardware Laboratory
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Shop Parts by Category
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              40+ verified enthusiast components with 3-layer specifications and compatibility checks.
            </p>
          </div>

          <Link
            href="/parts"
            className="btn-pill px-6 py-2.5 rounded-full border border-white/20 hover:border-white/50 text-xs font-semibold text-white flex items-center gap-2"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { cat: 'gpu', title: 'Graphics Cards (GPUs)', count: 'NVIDIA RTX 4090 / 4080 Super / 7900 XTX', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80' },
            { cat: 'cpu', title: 'Processors (CPUs)', count: 'Intel i9-14900KS & AMD 7800X3D V-Cache', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80' },
            { cat: 'motherboard', title: 'Motherboards', count: 'Z790 Dark Hero, X670E Hero & B650', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
            { cat: 'ram', title: 'Memory (RAM)', count: 'DDR5 6400 MT/s Low Latency CL30/CL32', img: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80' },
            { cat: 'storage', title: 'NVMe M.2 Solid State', count: 'Samsung 990 PRO 4TB (7,450 MB/s)', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80' },
            { cat: 'case', title: 'Artisan Cases & Cooling', count: 'Lian Li O11 EVO RGB & Fractal North Wood', img: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/parts?category=${item.cat}`}
              className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all p-6 flex flex-col justify-end"
            >
              {/* Background Image with Dark Vignette */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative z-10 flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Express 4-Day Stock
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300">{item.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          9. SELL YOUR PARTS: INSTANT ESTIMATE MINI-FORM
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
                Instant Trade-In Valuation
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Turn your existing PC parts into cash or instant build credit.
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Choose your component, select its condition, and view an instant guaranteed quote. We arrange courier pickup at your doorstep, verify the serial number in our lab, and wire payout within 24 hours.
              </p>

              <div className="flex flex-col gap-2 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free insured door-to-door courier pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Choose Instant Bank Transfer, UPI, or +15% SoftBuild Store Credit</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#111317] border border-white/15 flex flex-col gap-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Instant Valuation Calculator</span>
              </h3>

              {/* Category Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Component Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['gpu', 'cpu', 'ram', 'storage'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSellCat(cat);
                        if (cat === 'gpu') setSellModel('rtx 4090');
                        if (cat === 'cpu') setSellModel('14900');
                        if (cat === 'ram') setSellModel('ddr5 64gb');
                        if (cat === 'storage') setSellModel('4tb nvme');
                      }}
                      className={`py-2 text-xs font-bold rounded-xl uppercase transition-all ${
                        sellCat === cat
                          ? 'bg-cyan-400 text-black font-mono shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Grade */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Cosmetic & Working Condition</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { key: 'likeNew', label: 'Like New (Box)' },
                      { key: 'good', label: 'Good (Minor wear)' },
                      { key: 'fair', label: 'Fair (Scratches)' },
                      { key: 'forParts', label: 'For Parts' },
                    ] as const
                  ).map((cond) => (
                    <button
                      key={cond.key}
                      type="button"
                      onClick={() => setSellCondition(cond.key)}
                      className={`p-2 text-[11px] rounded-xl font-medium border text-center transition-all ${
                        sellCondition === cond.key
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Quote Card */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold block">
                    Estimated Immediate Payout
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    ${estimatedValue}
                  </span>
                  <span className="text-[10px] text-cyan-400 block mt-0.5">
                    or ${(estimatedValue * 1.15).toFixed(0)} with +15% SoftBuild Store Credit
                  </span>
                </div>

                <Link
                  href="/sell"
                  className="btn-pill bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold px-5 py-2.5 text-xs shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                >
                  Submit Inspection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. WHY US / QUALITY PROCESS (4 STEPS WITH SVG LINE DRAW)
          (Select, Build, Stress test, Ship)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold block mb-2">
            The SoftBuild Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How every computer comes to life.
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            4 precision phases executed by aerospace-certified hardware engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { step: '01', title: 'Component Binning', desc: 'Every CPU and GPU die is silicon-binned to ensure it hits its advertised boost clocks without thermal throttling.', icon: Sliders },
            { step: '02', title: 'Artisan Assembly', desc: 'Hand-routed custom silver braided cables, precision torque on cooler pump screws, and zero fingerprints.', icon: Wrench },
            { step: '03', title: '48h Torture Test', desc: 'Non-stop 48-hour synthetic thermal burn-in under AIDA64, FurMark, and MemTest86 with certified log reports.', icon: Flame },
            { step: '04', title: 'Crated Delivery', desc: 'Secured inside custom high-density foam within heavy wooden crate crates, fully insured for door-to-door transit.', icon: Package },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 relative group hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black font-mono text-gray-400 group-hover:text-cyan-400 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          11. REVIEWS & COMMUNITY BUILDS GALLERY
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold block mb-2">
            Verified SoftBuild Owners
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Loved by pros, artists, and enthusiasts.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: 'Marcus Vance',
              role: 'Lead Colorist, Obsidian Studios',
              build: 'SoftBuild Apex Pro Studio (i9-14900KS + RTX 4090)',
              quote: '“We scrub 8K RED RAW footage across 6 monitor heads simultaneously. Not a single dropped frame in 6 months of intense film grading. The acoustics are so quiet we recorded dialogue right beside it.”',
              rating: 5,
            },
            {
              author: 'Elena Rostova',
              role: 'Machine Learning Researcher',
              build: 'SoftBuild Horizon AI Lab (64GB DDR5 + RTX 4090)',
              quote: '“Having a whisper-quiet 24GB VRAM workstation in my home office changed my workflow entirely. Fine-tuning 70B parameter models overnight with zero fan screech.”',
              rating: 5,
            },
            {
              author: 'Devon Hayes',
              role: 'Competitive Apex Legends / CS2',
              build: 'SoftBuild Aether 9 X3D (Ryzen 7 7800X3D)',
              quote: '“Locked 240 FPS at 1440p with flat 0.1% frametime variance. The craftsmanship on the custom Lian Li cables looks like a modern museum sculpture on my desk.”',
              rating: 5,
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic">{rev.quote}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col">
                <span className="text-xs font-bold text-white">{rev.author}</span>
                <span className="text-[11px] text-gray-400">{rev.role}</span>
                <span className="text-[10px] text-cyan-400 font-mono mt-1">{rev.build}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          12. CLOSING CTA BAND: "Ready when you are."
          with the 4 buttons again, plus phone, chat and email
      ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center relative">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Begin Your Build
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Ready when you are.
          </h2>
          <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
            Configure your dream specification, select a prebuilt ready to ship, or speak directly with our senior hardware architects.
          </p>

          {/* Strict 4 Journey Buttons in Order */}
          <div className="pt-2">
            <JourneyButtons size="lg" layout="wrap" />
          </div>

          {/* Phone, Chat, Email Direct Contacts */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Direct Phone: +1 (800) 555-SOFT</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Live Concierge Chat: Available Now</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>concierge@softbuild.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
