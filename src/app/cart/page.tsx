'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import { calculateCartETA } from '@/lib/eta';
import { ETABadge } from '@/components/common/ETABadge';
import { ALL_PARTS } from '@/lib/data/parts';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  CheckCircle,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    couponCode,
    applyCoupon,
    couponDiscount,
    splitShipment,
    setSplitShipment,
    cartSubtotal,
    cartTotal,
    addToCart,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const tiers = cart.map((i) => i.leadTimeTier);
  const cartETA = calculateCartETA(tiers);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(false);
    setCouponSuccess(false);
    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponSuccess(true);
      setInputCoupon('');
    } else {
      setCouponError(true);
    }
  };

  const upsellItems = ALL_PARTS.filter(
    (p) =>
      (p.category === 'peripheral' || p.category === 'storage') &&
      !cart.some((c) => c.productId === p.id)
  ).slice(0, 3);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 gap-4">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-cyan-400 opacity-60" />
        </div>
        <h1 className="text-2xl font-bold text-white">Your cart is currently empty</h1>
        <p className="text-xs text-gray-400 max-w-sm">
          Browse our flagship prebuilts or engineer your own machine in the 12-step custom configurator.
        </p>
        <div className="flex gap-3 mt-4">
          <Link
            href="/prebuilt"
            className="btn-pill px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
          >
            Shop Prebuilts
          </Link>
          <Link
            href="/build"
            className="btn-pill px-6 py-3 bg-[#00E5FF] text-black text-xs font-bold"
          >
            Build Your PC
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">SoftBuild Cart</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review your components, verified lead times, and shipping schedules before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Delivery ETA Notification Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                <Truck className="w-4 h-4" />
                <span>{cartETA.label}</span>
              </div>
              <span className="font-mono text-cyan-200 text-xs font-bold">{cartETA.arrivalDateString}</span>
            </div>

            {tiers.some((t) => t === 10) && (
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={splitShipment}
                  onChange={(e) => setSplitShipment(e.target.checked)}
                  className="rounded border-cyan-400 text-cyan-400 focus:ring-0"
                />
                <span className="text-[11px] text-gray-300">
                  Split shipment: Dispatch in-stock hardware components in 4 days while custom rig undergoes 48h burn-in
                </span>
              </label>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-2xl bg-black border border-white/10 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                      {item.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.subtitle}</p>
                    <div className="mt-2">
                      <ETABadge tier={item.leadTimeTier} compact={true} />
                    </div>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 border border-white/10 rounded-xl p-1 bg-black/40">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upsell Accessories */}
          {upsellItems.length > 0 && (
            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-300">Compatible Accessories & Add-Ons</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {upsellItems.map((part) => (
                  <div
                    key={part.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={part.image} alt={part.name} className="w-12 h-12 object-cover rounded-xl bg-black" />
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-white truncate">{part.name}</span>
                        <span className="text-[11px] font-mono text-cyan-400">${part.price}</span>
                      </div>
                    </div>
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
                      className="btn-pill w-full py-1.5 text-xs font-bold bg-white/10 hover:bg-cyan-400 hover:text-black text-gray-200 transition-colors"
                    >
                      + Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Summary & Checkout */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#111317] border border-white/15 flex flex-col gap-5 sticky top-24 shadow-2xl">
          <h3 className="text-base font-bold text-white">Order Summary</h3>

          {/* Promo Code Form */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Promo Code (SOFTBUILD100)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              Apply
            </button>
          </form>

          {couponSuccess && (
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Promo {couponCode} applied (-${couponDiscount})
            </p>
          )}

          {/* Price Breakdown */}
          <div className="flex flex-col gap-2 text-xs text-gray-300 pt-2 border-t border-white/10">
            <div className="flex justify-between">
              <span>Hardware Subtotal</span>
              <span className="font-mono">${cartSubtotal.toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span className="font-mono">-${couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Crate Delivery</span>
              <span className="font-mono text-emerald-400">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax / GST</span>
              <span className="font-mono">${Math.round(cartTotal * 0.08).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
              <span>Grand Total</span>
              <span className="font-mono text-cyan-300 text-lg">
                ${(cartTotal + Math.round(cartTotal * 0.08)).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="btn-pill w-full bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold py-4 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 text-center justify-center">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>3-Year Warranty & 30-Day Money-Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
