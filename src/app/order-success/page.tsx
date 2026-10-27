'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Truck,
  Printer,
  Calendar,
  Package,
  ArrowRight,
  ShieldCheck,
  Mail,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const invoice = searchParams.get('invoice') || 'SB-882194';
  const eta = searchParams.get('eta') || 'Arrives by Fri, 31 Oct';

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#ffffff', '#FFB300'],
      });
    } catch {}
  }, []);

  return (
    <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center gap-8">
      {/* Animated Check & Heading */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.4)] animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <span>INVOICE #{invoice}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Order Confirmed & Staged
        </h1>

        <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
          Thank you for choosing SoftBuild. Your components have been allocated from temperature-controlled cleanrooms and assigned to a certified hardware engineer.
        </p>
      </div>

      {/* ETA Delivery Card */}
      <div className="w-full p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-300">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-cyan-400 font-bold block">
              Guaranteed Delivery Window
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{eta}</span>
            <span className="text-xs text-gray-400 block mt-0.5">Includes 48-Hour Burn-In Telemetry Logging</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-pill px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Official Invoice</span>
        </button>
      </div>

      {/* Order Tracking Progress Stages */}
      <div className="w-full p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4 text-left">
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          Live Build Stages
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col gap-1">
            <span className="font-bold">1. Placed & Verified</span>
            <span className="text-[10px] text-emerald-400">Inventory reserved</span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex flex-col gap-1">
            <span className="font-bold">2. Hand-Assembly</span>
            <span className="text-[10px] text-cyan-400">Torque & cable routing</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex flex-col gap-1">
            <span className="font-bold">3. 48h Stress Test</span>
            <span className="text-[10px]">AIDA64 / FurMark pass</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex flex-col gap-1">
            <span className="font-bold">4. Crated Freight</span>
            <span className="text-[10px]">Doorstep delivery</span>
          </div>
        </div>
      </div>

      {/* Confirmation Email Alert */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Mail className="w-4 h-4 text-cyan-400" />
        <span>A detailed PDF invoice and live tracking link have been dispatched to your email address.</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/account"
          className="btn-pill px-8 py-3.5 bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2"
        >
          <span>View in Customer Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/"
          className="btn-pill px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
        >
          Return to SoftBuild Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-gray-400 font-mono text-xs">Loading Order Confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
