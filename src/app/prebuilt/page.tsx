'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ALL_PREBUILTS } from '@/lib/data/prebuilts';
import { ETABadge } from '@/components/common/ETABadge';
import { useStore } from '@/lib/context/StoreContext';
import {
  Package,
  SlidersHorizontal,
  Search,
  Star,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Check,
  RotateCcw,
} from 'lucide-react';

export default function PrebuiltsPage() {
  const router = useRouter();
  const { loadPrebuiltIntoConfigurator } = useStore();

  // Filters state
  const [selectedUseCase, setSelectedUseCase] = useState<string>('all');
  const [selectedGpuTier, setSelectedGpuTier] = useState<string>('all');
  const [selectedCpuBrand, setSelectedCpuBrand] = useState<string>('all');
  const [selectedCaseColor, setSelectedCaseColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(6000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrebuilts = ALL_PREBUILTS.filter((pc) => {
    if (searchQuery && !pc.name.toLowerCase().includes(searchQuery.toLowerCase()) && !pc.tagline.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (pc.price > maxBudget) return false;
    if (selectedUseCase !== 'all' && pc.useCase !== selectedUseCase) return false;
    if (selectedGpuTier !== 'all' && !pc.headlineSpecs.gpu.toLowerCase().includes(selectedGpuTier.toLowerCase())) return false;
    if (selectedCpuBrand !== 'all' && !pc.headlineSpecs.cpu.toLowerCase().includes(selectedCpuBrand.toLowerCase())) return false;
    if (selectedCaseColor !== 'all' && pc.caseColor !== selectedCaseColor) return false;
    if (selectedSize !== 'all' && pc.size !== selectedSize) return false;
    return true;
  });

  const resetFilters = () => {
    setSelectedUseCase('all');
    setSelectedGpuTier('all');
    setSelectedCpuBrand('all');
    setSelectedCaseColor('all');
    setSelectedSize('all');
    setMaxBudget(6000);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
          <Package className="w-4 h-4" />
          <span>SoftBuild Certified Systems</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Flagship Prebuilts
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
          8 factory-assembled, silicon-binned supercomputers. Stress-tested for 48 continuous hours with certified thermals and express 4 to 6 day dispatch.
        </p>
      </div>

      {/* Main Grid: Filters Sidebar + Systems Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (3 cols) */}
        <aside className="lg:col-span-3 p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search prebuilts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Budget Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-300">Max Budget</span>
              <span className="font-mono text-cyan-300 font-bold">${maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1800}
              max={6000}
              step={100}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Use Case */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Intended Workflow</label>
            <div className="flex flex-col gap-1 text-xs">
              {['all', 'Gaming', 'Creator', 'Workstation', 'AI / Deep Learning', 'Ultra-Compact', 'Silent'].map((uc) => (
                <button
                  key={uc}
                  onClick={() => setSelectedUseCase(uc)}
                  className={`px-3 py-1.5 rounded-lg text-left transition-all flex items-center justify-between ${
                    selectedUseCase === uc
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="capitalize">{uc === 'all' ? 'All Workflows' : uc}</span>
                  {selectedUseCase === uc && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* GPU Tier */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Graphics Tier</label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', '4090', '4080', '4070'].map((gpu) => (
                <button
                  key={gpu}
                  onClick={() => setSelectedGpuTier(gpu)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedGpuTier === gpu
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {gpu === 'all' ? 'All GPUs' : `RTX ${gpu}`}
                </button>
              ))}
            </div>
          </div>

          {/* CPU Brand */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">CPU Architecture</label>
            <div className="flex gap-2 text-xs">
              {['all', 'AMD', 'Intel'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedCpuBrand(brand)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedCpuBrand === brand
                      ? 'bg-cyan-400 text-black font-bold border-cyan-400'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {brand === 'all' ? 'All' : brand}
                </button>
              ))}
            </div>
          </div>

          {/* Case Color */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Chassis Colorway</label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'Obsidian Black', 'Ceramic White', 'Gunmetal Grey'].map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedCaseColor(col)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    selectedCaseColor === col
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}
                >
                  {col === 'all' ? 'All Colors' : col}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Prebuilt Systems Grid (9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredPrebuilts.length} of {ALL_PREBUILTS.length} Handcrafted Systems</span>
            <span className="font-mono text-cyan-400 font-semibold">Ready to Ship with 48h Stress Test</span>
          </div>

          {filteredPrebuilts.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-4">
              <Package className="w-10 h-10 text-gray-500" />
              <p className="text-sm font-medium text-gray-300">No systems matched your selected filters.</p>
              <button
                onClick={resetFilters}
                className="btn-pill px-6 py-2.5 bg-cyan-400 text-black text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPrebuilts.map((pc) => (
                <div
                  key={pc.id}
                  className="group rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image and Badges */}
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

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {pc.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{pc.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {pc.tagline}
                      </p>

                      {/* 3 Headline Specs */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-medium">CPU</span>
                          <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.cpu}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-medium">GPU</span>
                          <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.gpu}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-medium">Memory</span>
                          <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.ram}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-medium">Storage</span>
                          <span className="font-semibold text-gray-200 truncate">{pc.headlineSpecs.storage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Buttons */}
                  <div className="p-6 pt-0 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between border-t border-white/5 pt-4">
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
                        ${pc.emiPricePerMonth}/mo 0% EMI
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Link
                        href={`/prebuilt/${pc.id}`}
                        className="btn-pill text-center py-2.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        View System Specs
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
