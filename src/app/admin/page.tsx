'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/context/StoreContext';
import { ALL_PARTS } from '@/lib/data/parts';
import { ALL_PREBUILTS } from '@/lib/data/prebuilts';
import { TRADE_IN_PRICING_TABLE } from '@/lib/constants';
import { OrderRecord, SellPartSubmission } from '@/lib/types';
import {
  ShieldAlert,
  Package,
  RefreshCw,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Edit,
} from 'lucide-react';

export default function AdminPage() {
  const { orders, updateOrderStatus, sellSubmissions, updateSellStatus } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'tradein' | 'inventory' | 'coupons'>('orders');
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  const [adjustedPriceInput, setAdjustedPriceInput] = useState<Record<string, string>>({});

  const handleUpdateStock = (partId: string, delta: number) => {
    setStockOverrides((prev) => {
      const cur = prev[partId] !== undefined ? prev[partId] : 20;
      return { ...prev, [partId]: Math.max(0, cur + delta) };
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
      {/* Admin Header */}
      <div className="p-8 rounded-3xl glass-panel-elevated border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SoftBuild Master Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Operations & Admin</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time fulfillment, inventory stock levels, order status updates, and trade-in valuation review.
          </p>
        </div>

        <Link
          href="/"
          className="btn-pill px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white w-fit"
        >
          View Live Storefront
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Fulfillment Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tradein')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tradein' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Trade-In Review Queue ({sellSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'inventory' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Parts Inventory & Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'coupons' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Pricing & Promo Codes</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDERS FULFILLMENT ================= */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-6">
          {orders.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center text-xs text-gray-400">
              No orders placed in session. Place an order via checkout to test live status progression.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white font-mono text-sm">{order.invoiceNumber}</span>
                      <span className="text-xs text-gray-400">• Customer: {order.customerName}</span>
                    </div>
                    <span className="text-xs text-gray-300 font-mono">
                      Total: ${order.total.toLocaleString()} • ETA: {order.etaDate}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Destination: {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.postalCode})
                    </span>
                  </div>

                  {/* Order Status Changer Dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderRecord['status'])}
                      className="px-3.5 py-2 rounded-xl bg-black border border-cyan-400/40 text-xs text-cyan-300 font-bold focus:outline-none"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Building/Packed">Building/Packed (48h Burn-In)</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: TRADE-IN REVIEW QUEUE ================= */}
      {activeTab === 'tradein' && (
        <div className="flex flex-col gap-6">
          {sellSubmissions.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center text-xs text-gray-400">
              No trade-in submissions received. Submit one on the /sell page to view it in this queue.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sellSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">{sub.model}</h3>
                      <span className="text-xs text-gray-400 font-mono">
                        Serial: {sub.serialNumber} • Grade: {sub.grade} • Postal: {sub.pinCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">Current Quote:</span>
                      <span className="text-xl font-bold font-mono text-cyan-300">
                        ${sub.estimatedPriceMin} – ${sub.estimatedPriceMax}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Adjust Offer, Approve, Mark Paid */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Status:</span>
                      <select
                        value={sub.status}
                        onChange={(e) => updateSellStatus(sub.id, e.target.value as SellPartSubmission['status'])}
                        className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-xs text-white"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Quote accepted">Quote accepted</option>
                        <option value="Pickup scheduled">Pickup scheduled</option>
                        <option value="Received">Received</option>
                        <option value="Inspected">Inspected</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Adjusted $ Price"
                        value={adjustedPriceInput[sub.id] || ''}
                        onChange={(e) =>
                          setAdjustedPriceInput((prev) => ({ ...prev, [sub.id]: e.target.value }))
                        }
                        className="w-32 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          const val = Number(adjustedPriceInput[sub.id]);
                          if (val > 0) {
                            updateSellStatus(sub.id, 'Quote accepted', val);
                          }
                        }}
                        className="btn-pill px-4 py-1.5 bg-cyan-400 text-black text-xs font-bold"
                      >
                        Send Adjusted Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: INVENTORY & STOCK ================= */}
      {activeTab === 'inventory' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>40 Certified Hardware Components in Active Cleanrooms</span>
            <span className="font-mono text-cyan-400">Live Inventory Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_PARTS.map((part) => {
              const currentStock =
                stockOverrides[part.id] !== undefined ? stockOverrides[part.id] : part.stockCount;

              return (
                <div
                  key={part.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={part.image} alt={part.name} className="w-12 h-12 object-cover rounded-xl bg-black" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-white truncate">{part.name}</span>
                      <span className="text-[11px] font-mono text-cyan-400">${part.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleUpdateStock(part.id, -1)}
                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold w-7 text-center">{currentStock}</span>
                    <button
                      onClick={() => handleUpdateStock(part.id, 1)}
                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: COUPONS & TRADE-IN PRICING TABLE ================= */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Active Promo Codes */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              <span>Active Storefront Coupons</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-cyan-300 text-sm">SOFTBUILD100</span>
                  <p className="text-xs text-gray-400 mt-0.5">$100 off any order over $1,000</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-cyan-300 text-sm">LUXURY5</span>
                  <p className="text-xs text-gray-400 mt-0.5">5% off all flagship prebuilts & custom rigs</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Trade-In Base Pricing Table */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Trade-In Valuation Matrix</span>
            </h3>

            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto text-xs pr-1">
              {TRADE_IN_PRICING_TABLE.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white uppercase font-mono">{row.modelQuery}</span>
                    <span className="text-[10px] text-gray-400 block capitalize">{row.category}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-cyan-300 font-bold">${row.likeNew}</span>
                    <span className="text-[10px] text-gray-400 block">Like New</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
