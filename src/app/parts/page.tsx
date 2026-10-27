'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ALL_PARTS } from '@/lib/data/parts';
import { PartCategory, PartProduct } from '@/lib/types';
import { useStore } from '@/lib/context/StoreContext';
import { isPartCompatibleWithBuild } from '@/lib/compatibility';
import { ETABadge } from '@/components/common/ETABadge';
import { SpecAccordion } from '@/components/common/SpecAccordion';
import {
  Cpu,
  Search,
  SlidersHorizontal,
  X,
  Check,
  ShoppingBag,
  ArrowRight,
  Star,
  CheckCircle2,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

function PartsContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as PartCategory) || 'all';

  const {
    currentBuild,
    addToCart,
    comparePartIds,
    toggleComparePart,
    clearCompare,
  } = useStore();

  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2200);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);

  // Available brands in parts
  const allBrands = Array.from(new Set(ALL_PARTS.map((p) => p.brand)));

  // Filtered Parts
  const filteredParts = ALL_PARTS.filter((part) => {
    if (selectedCat !== 'all' && part.category !== selectedCat) return false;
    if (selectedBrand !== 'all' && part.brand !== selectedBrand) return false;
    if (part.price > maxPrice) return false;
    if (onlyInStock && !part.inStock) return false;

    if (onlyCompatible) {
      const comp = isPartCompatibleWithBuild(part, currentBuild);
      if (!comp.compatible) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        part.name.toLowerCase().includes(q) ||
        part.brand.toLowerCase().includes(q) ||
        part.tagline.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const comparedProducts = ALL_PARTS.filter((p) => comparePartIds.includes(p.id));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10 pb-32">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
          <Cpu className="w-4 h-4" />
          <span>Silicon Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Individual Hardware Components
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
          40+ silicon-certified parts from Intel, AMD, NVIDIA, ASUS ROG, and Samsung. Express 4-day dispatch with live compatibility checking against your active machine.
        </p>
      </div>

      {/* Category Tabs Ribbon */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'all', label: 'All Components' },
            { id: 'cpu', label: 'CPUs' },
            { id: 'gpu', label: 'Graphics Cards' },
            { id: 'motherboard', label: 'Motherboards' },
            { id: 'ram', label: 'Memory (RAM)' },
            { id: 'storage', label: 'Storage (NVMe)' },
            { id: 'psu', label: 'Power Supplies' },
            { id: 'case', label: 'Chassis' },
            { id: 'cooler', label: 'Cooling' },
            { id: 'fans', label: 'Fans' },
            { id: 'os', label: 'Operating Systems' },
            { id: 'monitor', label: 'Displays' },
            { id: 'peripheral', label: 'Peripherals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCat(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                selectedCat === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Parts Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (3 cols) */}
        <aside className="lg:col-span-3 p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Faceted Filters</span>
            </div>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setMaxPrice(2200);
                setOnlyInStock(false);
                setOnlyCompatible(false);
                setSearchQuery('');
              }}
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
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Compatible with My Build Toggle */}
          <label className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/30 flex items-center justify-between cursor-pointer">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-cyan-300">Compatible with my build</span>
              <span className="text-[10px] text-cyan-200/70">Filters out socket/clearance conflicts</span>
            </div>
            <input
              type="checkbox"
              checked={onlyCompatible}
              onChange={(e) => setOnlyCompatible(e.target.checked)}
              className="rounded border-cyan-400 text-cyan-400 focus:ring-0"
            />
          </label>

          {/* In Stock Only Toggle */}
          <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
            <span>In Stock Only</span>
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded border-white/20 text-cyan-400 focus:ring-0"
            />
          </label>

          {/* Max Price Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-300">Max Price</span>
              <span className="font-mono text-cyan-300 font-bold">${maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={2200}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Brand Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Manufacturer Brand</label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', ...allBrands].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedBrand === brand
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {brand === 'all' ? 'All Brands' : brand}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Parts Grid (9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredParts.length} Components</span>
            <span className="font-mono text-cyan-400 font-semibold">Strict 4-Day Express Dispatch</span>
          </div>

          {filteredParts.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-4">
              <Cpu className="w-10 h-10 text-gray-500" />
              <p className="text-sm font-medium text-gray-300">No components match your active filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedCat('all');
                  setSelectedBrand('all');
                  setMaxPrice(2200);
                  setOnlyCompatible(false);
                }}
                className="btn-pill px-6 py-2.5 bg-cyan-400 text-black text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredParts.map((part) => {
                const isCompared = comparePartIds.includes(part.id);

                return (
                  <div
                    key={part.id}
                    className="p-6 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-4"
                  >
                    {/* Header Row: Image, Brand, Title, ETA, Price, Add to Cart, Compare */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={part.image}
                          alt={part.name}
                          className="w-16 h-16 object-cover rounded-2xl bg-black border border-white/10 shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                            {part.brand} • {part.category.toUpperCase()}
                          </span>
                          <Link
                            href={`/parts/${part.id}`}
                            className="text-base sm:text-lg font-bold text-white hover:text-cyan-300 transition-colors"
                          >
                            {part.name}
                          </Link>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{part.tagline}</p>
                        </div>
                      </div>

                      {/* Right: Price & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <span className="text-2xl font-black font-mono text-cyan-300">
                          ${part.price.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleComparePart(part.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              isCompared
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {isCompared ? 'Compared ✓' : 'Compare'}
                          </button>

                          <button
                            onClick={() =>
                              addToCart({
                                id: `part-${part.id}-${Date.now()}`,
                                type: 'part',
                                productId: part.id,
                                title: part.name,
                                subtitle: `${part.brand} • ${part.category.toUpperCase()}`,
                                price: part.price,
                                image: part.image,
                                leadTimeTier: part.leadTimeTier,
                              })
                            }
                            className="btn-pill px-4 py-1.5 bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delivery ETA Badge */}
                    <div className="flex items-center justify-between pt-1">
                      <ETABadge tier={part.leadTimeTier} inStock={part.inStock} compact={true} />
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{part.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({part.reviewCount})</span>
                      </div>
                    </div>

                    {/* Full 3-Layer Specifications on every card */}
                    <div className="pt-2">
                      <SpecAccordion specs={part.specs} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Dock Bar (Up to 4 parts) */}
      {comparePartIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-4 animate-in slide-in-from-bottom duration-300">
          <div className="p-4 rounded-3xl bg-[#111317]/95 backdrop-blur-xl border border-cyan-400/50 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white font-mono">
                Compare ({comparePartIds.length}/4):
              </span>
              <div className="flex items-center gap-2">
                {comparedProducts.map((p) => (
                  <div key={p.id} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-9 h-9 object-cover rounded-xl border border-white/20 bg-black"
                    />
                    <button
                      onClick={() => toggleComparePart(p.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="text-xs text-gray-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
              <button
                onClick={() => setCompareModalOpen(true)}
                className="btn-pill px-5 py-2 bg-cyan-400 text-black text-xs font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              >
                Compare Side-by-Side
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto bg-[#111317] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">Side-by-Side Hardware Comparison</h3>
                <p className="text-xs text-gray-400 mt-0.5">Comparing {comparedProducts.length} components side-by-side</p>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compare Table */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {comparedProducts.map((p) => (
                <div key={p.id} className="p-3 flex flex-col gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-xl bg-black" />
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{p.brand}</span>
                  <h4 className="text-xs font-bold text-white">{p.name}</h4>
                  <span className="text-lg font-bold font-mono text-cyan-300">${p.price}</span>

                  <div className="flex flex-col gap-2 pt-2 border-t border-white/5 text-xs text-gray-300">
                    {p.specs.quickSpecs.map((qs, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase">{qs.label}</span>
                        <span className="font-semibold text-gray-200 font-mono">{qs.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        id: `part-${p.id}-${Date.now()}`,
                        type: 'part',
                        productId: p.id,
                        title: p.name,
                        subtitle: `${p.brand} • ${p.category.toUpperCase()}`,
                        price: p.price,
                        image: p.image,
                        leadTimeTier: p.leadTimeTier,
                      });
                      setCompareModalOpen(false);
                    }}
                    className="btn-pill mt-auto w-full py-2 bg-cyan-400 text-black text-xs font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PartsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-gray-400 font-mono text-xs">Loading Silicon Catalog...</div>}>
      <PartsContent />
    </Suspense>
  );
}
