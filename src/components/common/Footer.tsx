'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JourneyButtons } from './JourneyButtons';
import { SITE_NAME } from '@/lib/constants';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle,
  ArrowRight,
  Send,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#08090B] border-t border-white/[0.08] relative overflow-hidden text-gray-400">
      {/* Decorative Geometric SVG Corner Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-cyan-400/40 fill-none">
          <circle cx="400" cy="0" r="380" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="400" cy="0" r="280" strokeWidth="1" />
          <circle cx="400" cy="0" r="160" strokeWidth="1" />
        </svg>
      </div>

      {/* 13. Delivery and Support Live Status Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Guaranteed ETA</h4>
              <p className="text-xs text-gray-400 mt-1">
                Strict 4, 6, or 10 day delivery maximum. Fully insured wooden crate freight.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">3-Year SoftBuild Warranty</h4>
              <p className="text-xs text-gray-400 mt-1">
                Full parts, labor, and 48-hour advance cross-ship replacement included.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-gray-400 mt-1">
                Zero restocking fees on custom rigs returned in original condition.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support is Online</h4>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Mon–Sun 9AM–10PM EST. Real hardware engineers, not chatbots.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 14. Main Footer Navigation & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Info & 4 Journeys Summary */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-sm">
                S
              </div>
              <span className="text-lg font-black tracking-wider text-white uppercase font-mono-spec">
                {SITE_NAME}
              </span>
            </Link>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              SoftBuild designs and hand-assembles cinematic luxury custom computers. Engineered with obsession, stress-tested for 48 continuous hours, and delivered in custom Pelican cases.
            </p>

            <div className="mt-2">
              <JourneyButtons size="sm" layout="wrap" />
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] text-cyan-400">
              Hardware
            </h5>
            <Link href="/build" className="hover:text-white transition-colors">Custom Configurator</Link>
            <Link href="/prebuilt" className="hover:text-white transition-colors">Flagship Prebuilts</Link>
            <Link href="/parts" className="hover:text-white transition-colors">Component Catalog</Link>
            <Link href="/sell" className="hover:text-white transition-colors">Trade-In & Sell Parts</Link>
            <Link href="/account" className="hover:text-white transition-colors">Track Active Build</Link>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] text-cyan-400">
              Company & Help
            </h5>
            <Link href="/account" className="hover:text-white transition-colors">Order History & Invoices</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
            <span className="text-gray-400">Warranty Policy (3 Years)</span>
            <span className="text-gray-400">48h Stress Testing Protocol</span>
            <span className="text-gray-400">Privacy & Terms</span>
          </div>

          {/* Newsletter Field */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] text-cyan-400">
              Private Intel
            </h5>
            <p className="text-xs text-gray-400 leading-relaxed">
              Exclusive notification drops when new NVIDIA RTX 50-series GPUs, AMD X3D chips, and limited artisan chassis release.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 mt-1">
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-gray-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-4 py-2.5 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-bold text-xs shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                You are registered for priority inventory alerts.
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>&copy; 2026 SoftBuild Inc. All rights reserved. Handcrafted in California.</span>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono">STRIPE TEST MODE</span>
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono">APPLE PAY</span>
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono">VISA / MASTERCARD</span>
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono">CASH ON DELIVERY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
