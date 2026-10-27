'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import {
  User,
  Package,
  Wrench,
  RefreshCw,
  Printer,
  RotateCcw,
  Clock,
  CheckCircle2,
  ChevronRight,
  Truck,
  ShieldCheck,
  Trash2,
  Calendar,
} from 'lucide-react';

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'orders';

  const { orders, savedBuilds, sellSubmissions, loadPreset } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'builds' | 'tradein'>('orders');
  const [returnRequestedOrderId, setReturnRequestedOrderId] = useState<string | null>(null);

  const trackingStages: { key: string; label: string }[] = [
    { key: 'Placed', label: 'Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Building/Packed', label: 'Building & Stress Tested' },
    { key: 'Shipped', label: 'Freight Shipped' },
    { key: 'Out for delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' },
  ];

  const getStageIndex = (status: string) => {
    const idx = trackingStages.findIndex((s) => s.key === status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
      {/* Account Profile Header */}
      <div className="p-8 rounded-3xl glass-panel-elevated border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black font-black text-xl flex items-center justify-center font-mono">
            AV
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Alexander Vance</h1>
            <span className="text-xs text-gray-400 font-mono">alex.vance@studio-obsidian.com</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                SoftBuild Concierge Member
              </span>
              <span className="text-[11px] text-emerald-400">● 3-Year Active Warranty</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="btn-pill px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/build"
            className="btn-pill px-5 py-2.5 bg-[#00E5FF] text-[#0A0B0D] text-xs font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            New Custom Rig
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-white/10 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Live Tracking ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('builds')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'builds'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Saved Machine Configurations ({savedBuilds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tradein')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tradein'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Trade-In Submissions ({sellSubmissions.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDERS & TRACKING ================= */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-6">
          {orders.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-3 text-gray-400">
              <Package className="w-10 h-10 text-gray-500" />
              <p className="text-sm font-medium text-white">No active or past hardware orders.</p>
              <p className="text-xs max-w-sm">
                Orders placed through our store with guaranteed ETA dates will be tracked live right here.
              </p>
              <Link
                href="/prebuilt"
                className="btn-pill px-6 py-2.5 bg-cyan-400 text-black text-xs font-bold mt-2"
              >
                Browse Systems
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const currentStageIdx = getStageIndex(order.status);

              return (
                <div
                  key={order.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-6 shadow-xl"
                >
                  {/* Order Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white font-mono">
                          {order.invoiceNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • ETA: {order.etaDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="btn-pill px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-gray-300 flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>PDF Invoice</span>
                      </button>

                      <button
                        onClick={() => setReturnRequestedOrderId(order.id)}
                        className="btn-pill px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-gray-300 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Return</span>
                      </button>
                    </div>
                  </div>

                  {/* 6-Stage Tracking Timeline */}
                  <div className="flex flex-col gap-3 py-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Live Delivery Progress
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {trackingStages.map((stage, sIdx) => {
                        const isDone = sIdx <= currentStageIdx;
                        const isCurrent = sIdx === currentStageIdx;

                        return (
                          <div
                            key={stage.key}
                            className={`p-3 rounded-2xl border flex flex-col gap-1 transition-all ${
                              isCurrent
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                                : isDone
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-white/[0.02] border-white/5 text-gray-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono">0{sIdx + 1}</span>
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-xs font-semibold">{stage.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items in this Order */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                    <span className="text-xs font-semibold text-gray-400">Ordered Components</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl bg-black" />
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-white truncate">{item.title}</span>
                            <span className="text-[11px] text-gray-400">Qty: {item.quantity} • ${item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                    <span className="text-gray-400">
                      Payment via <span className="uppercase font-mono text-white">{order.paymentMethod}</span>
                    </span>
                    <span className="text-base font-bold font-mono text-cyan-300">
                      Total: ${order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================= TAB 2: SAVED BUILDS ================= */}
      {activeTab === 'builds' && (
        <div className="flex flex-col gap-4">
          {savedBuilds.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-3 text-gray-400">
              <Wrench className="w-10 h-10 text-gray-500" />
              <p className="text-sm font-medium text-white">No custom builds saved yet.</p>
              <p className="text-xs max-w-sm">
                Use the &ldquo;Save Rig&rdquo; button in the 12-stage configurator to store your dream specifications.
              </p>
              <Link
                href="/build"
                className="btn-pill px-6 py-2.5 bg-cyan-400 text-black text-xs font-bold mt-2"
              >
                Go to Configurator
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedBuilds.map((sb) => (
                <div
                  key={sb.id}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">
                        Saved Configuration
                      </span>
                      <span className="text-xs text-gray-400">{sb.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{sb.name}</h3>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5 text-gray-300">
                      <div>CPU: {sb.build.cpu?.name || 'Unselected'}</div>
                      <div>GPU: {sb.build.gpu?.name || 'Unselected'}</div>
                      <div>RAM: {sb.build.ram?.name || 'Unselected'}</div>
                      <div>Case: {sb.build.case?.name || 'Unselected'}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Link
                      href="/build"
                      className="btn-pill flex-1 py-2 text-center text-xs font-bold bg-cyan-400 text-black"
                    >
                      Open in Configurator
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: TRADE-IN SUBMISSIONS ================= */}
      {activeTab === 'tradein' && (
        <div className="flex flex-col gap-6">
          {sellSubmissions.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-3 text-gray-400">
              <RefreshCw className="w-10 h-10 text-gray-500" />
              <p className="text-sm font-medium text-white">No trade-in submissions found.</p>
              <p className="text-xs max-w-sm">
                Get instant cash for your GPU, CPU, or RAM with free doorstep courier pickup.
              </p>
              <Link
                href="/sell"
                className="btn-pill px-6 py-2.5 bg-cyan-400 text-black text-xs font-bold mt-2"
              >
                Sell Your PC Parts
              </Link>
            </div>
          ) : (
            sellSubmissions.map((sub) => {
              const sellStages = [
                'Submitted',
                'Quote accepted',
                'Pickup scheduled',
                'Received',
                'Inspected',
                'Paid',
              ];
              const curIdx = sellStages.indexOf(sub.status);

              return (
                <div
                  key={sub.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white">{sub.model}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {sub.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">
                        Condition: {sub.grade} • Serial: {sub.serialNumber} • Postal: {sub.pinCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Quote Range:</span>
                      <span className="text-xl font-bold font-mono text-cyan-300">
                        ${sub.estimatedPriceMin} – ${sub.estimatedPriceMax}
                      </span>
                    </div>
                  </div>

                  {/* 6-Stage Timeline */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Trade-In Verification Stages
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {sellStages.map((stageName, idx) => {
                        const isDone = idx <= curIdx;
                        const isCurrent = idx === curIdx;

                        return (
                          <div
                            key={stageName}
                            className={`p-3 rounded-2xl border flex flex-col gap-1 ${
                              isCurrent
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                : isDone
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-white/[0.02] border-white/5 text-gray-500'
                            }`}
                          >
                            <span className="text-[10px] font-mono">0{idx + 1}</span>
                            <span className="text-xs font-semibold">{stageName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-white/5">
                    <span>Selected Payout: <strong className="text-white">{sub.payoutMethod}</strong></span>
                    <span>Doorstep Pickup Arranged via FedEx</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Return Request Modal */}
      {returnRequestedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#111317] border border-white/15 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">30-Day SoftBuild Return Request</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Your 30-day trial allows zero-hassle return in original packaging with prepaid freight shipping. A SoftBuild concierge specialist will contact you within 2 business hours.
            </p>
            <button
              onClick={() => setReturnRequestedOrderId(null)}
              className="btn-pill w-full py-2.5 bg-cyan-400 text-black text-xs font-bold mt-2"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-gray-400 font-mono text-xs">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
