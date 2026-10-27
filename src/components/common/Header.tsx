'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import { PROMO_TICKER_ITEMS, SITE_NAME } from '@/lib/constants';
import { JourneyButtons } from './JourneyButtons';
import { ALL_PARTS } from '@/lib/data/parts';
import { ALL_PREBUILTS } from '@/lib/data/prebuilts';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  Mail,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cart, setCartOpen, theme, toggleTheme } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Search filtered results
  const matchingParts = searchQuery.trim()
    ? ALL_PARTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingPrebuilts = searchQuery.trim()
    ? ALL_PREBUILTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.headlineSpecs.gpu.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0A0B0D]/85 border-b border-white/[0.08] transition-colors">
      {/* 1. Announcement Ticker (Marquee) */}
      <div className="w-full bg-[#0E1015] border-b border-white/5 py-1.5 overflow-hidden text-xs text-gray-300 font-medium">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {[...PROMO_TICKER_ITEMS, ...PROMO_TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Navigation Bar with Split Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Split Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/build"
            className={`transition-colors flex items-center gap-1.5 ${
              pathname === '/build' ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Customize PC</span>
          </Link>
          <Link
            href="/prebuilt"
            className={`transition-colors ${
              pathname.startsWith('/prebuilt') ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Prebuilts
          </Link>
        </nav>

        {/* Center Brand Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.8)] transition-all">
              <span className="font-black text-black text-base font-mono">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white uppercase font-mono-spec">
                {SITE_NAME}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-cyan-400 -mt-1 font-semibold">
                Custom PCs
              </span>
            </div>
          </Link>
        </div>

        {/* Right Split Nav & Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/parts"
              className={`transition-colors ${
                pathname.startsWith('/parts') ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Shop Parts
            </Link>
            <Link
              href="/sell"
              className={`transition-colors ${
                pathname === '/sell' ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Sell Your Parts
            </Link>
          </nav>

          {/* Action Icons: Search, Theme Toggle, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Light / Dark Theme"
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            <Link
              href="/account"
              aria-label="Account & Orders"
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="My Account, Orders & Builds"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cart Trigger with live count */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open Cart"
              className="relative p-2 rounded-full text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-black text-[11px] font-black flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.7)] animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= FULL SCREEN OVERLAY MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0B0D] flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="text-xl font-black text-white font-mono">{SITE_NAME}</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search CPUs, GPUs, Prebuilts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Strict 4 Core Journey Buttons in Overlay */}
          <div className="mt-8 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Core Journeys
            </span>
            <JourneyButtons
              size="lg"
              layout="col"
              className="mt-2"
            />
          </div>

          {/* Support & Contact Details in Menu */}
          <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Concierge Phone: +1 (800) 555-SOFT</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Email: concierge@softbuild.com</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Support Status: Online (Mon–Sun 9AM–10PM EST)</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= INSTANT SEARCH MODAL ================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#111317] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search 40+ hardware parts, RTX 4090, 8 prebuilts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base text-white focus:outline-none placeholder-gray-500"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Preview */}
            <div className="mt-4 flex flex-col gap-4 max-h-96 overflow-y-auto">
              {matchingPrebuilts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Prebuilt Systems
                  </h4>
                  <div className="flex flex-col gap-2">
                    {matchingPrebuilts.map((pb) => (
                      <Link
                        key={pb.id}
                        href={`/prebuilt/${pb.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/5 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pb.image}
                            alt={pb.name}
                            className="w-10 h-10 object-cover rounded-lg bg-black"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">{pb.name}</span>
                            <span className="text-[11px] text-gray-400">{pb.headlineSpecs.gpu} • {pb.headlineSpecs.cpu}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-300">${pb.price.toLocaleString()}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchingParts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Hardware Parts
                  </h4>
                  <div className="flex flex-col gap-2">
                    {matchingParts.map((pt) => (
                      <Link
                        key={pt.id}
                        href={`/parts/${pt.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/5 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pt.image}
                            alt={pt.name}
                            className="w-10 h-10 object-cover rounded-lg bg-black"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block truncate max-w-sm">{pt.name}</span>
                            <span className="text-[11px] text-gray-400">{pt.brand} • {pt.category.toUpperCase()}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-300">${pt.price}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!searchQuery && (
                <div className="py-8 text-center text-xs text-gray-400">
                  Type any component name (e.g. &ldquo;RTX 4090&rdquo;, &ldquo;i9-14900KS&rdquo;, &ldquo;Monolith&rdquo;) to search instant stock.
                </div>
              )}

              {searchQuery && matchingParts.length === 0 && matchingPrebuilts.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No products matched &ldquo;{searchQuery}&rdquo;. Try browsing our{' '}
                  <Link href="/parts" onClick={() => setSearchOpen(false)} className="text-cyan-400 underline">
                    complete parts catalog
                  </Link>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
