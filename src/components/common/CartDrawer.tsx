'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import { calculateCartETA } from '@/lib/eta';
import { ALL_PARTS } from '@/lib/data/parts';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    cartOpen,
    setCartOpen,
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

  if (!cartOpen) return null;

  // Calculate cart ETA based on items in cart
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

  // Upsells: suggest complementary parts (e.g. keyboard, monitor or SSD) not already in cart
  const upsellItems = ALL_PARTS.filter(
    (p) =>
      (p.category === 'peripheral' || p.category === 'storage') &&
      !cart.some((c) => c.productId === p.id)
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-[#0E1015] border-l border-white/10 shadow-2xl flex flex-col z-10 text-white animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-100">SoftBuild Cart</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {cart.reduce((a, b) => a + b.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Delivery ETA Banner */}
        {cart.length > 0 && (
          <div className="p-3.5 bg-cyan-950/40 border-b border-cyan-800/30 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                <Truck className="w-4 h-4" />
                <span>{cartETA.label}</span>
              </div>
              <span className="font-mono text-cyan-200">{cartETA.arrivalDateString}</span>
            </div>

            {tiers.some((t) => t === 10) && tiers.some((t) => t <= 6) && (
              <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={splitShipment}
                  onChange={(e) => setSplitShipment(e.target.checked)}
                  className="rounded border-white/20 text-cyan-400 focus:ring-0"
                />
                <span className="text-[11px] text-gray-300">
                  Split shipment (Receive in-stock components in 4 days, custom rig in 10 days)
                </span>
              </label>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Sparkles className="w-8 h-8 text-cyan-400 opacity-60" />
              </div>
              <p className="text-sm font-medium">Your SoftBuild cart is empty.</p>
              <div className="mt-2">
                <Link
                  href="/prebuilt"
                  onClick={() => setCartOpen(false)}
                  className="btn-pill bg-[#00E5FF] text-black px-6 py-2.5 text-xs font-bold"
                >
                  Explore Systems
                </Link>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3.5 items-start"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-xl bg-black/40 border border-white/10 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-100 truncate">{item.title}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 truncate">{item.subtitle}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 border border-white/10 rounded-lg p-0.5 bg-black/30">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-semibold px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-mono font-bold text-cyan-300">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Upsell Recommendations */}
          {cart.length > 0 && upsellItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-gray-300">Recommended Add-Ons:</span>
              {upsellItems.map((part) => (
                <div
                  key={part.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-10 h-10 object-cover rounded-lg bg-black/40 border border-white/10 shrink-0"
                    />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-semibold text-gray-200 truncate">{part.name}</span>
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
                    className="btn-pill bg-white/10 hover:bg-cyan-500 hover:text-black text-xs font-bold px-3 py-1 text-gray-200 transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-black/40 flex flex-col gap-3.5">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. SOFTBUILD100)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </form>

            {couponSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Coupon code {couponCode} applied (-${couponDiscount})
              </p>
            )}
            {couponError && (
              <p className="text-xs text-red-400">
                Invalid promo code. Try SOFTBUILD100 or LUXURY5
              </p>
            )}

            {/* Price Calculations */}
            <div className="flex flex-col gap-1.5 text-xs text-gray-300 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium">${cartSubtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({couponCode})</span>
                  <span className="font-mono font-medium">-${couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured White-Glove Shipping</span>
                <span className="font-mono text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="font-mono text-cyan-300 text-base">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout & Buy Now Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <button
                onClick={() => {
                  setCartOpen(false);
                  router.push('/checkout');
                }}
                className="btn-pill w-full bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold py-3.5 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCartOpen(false);
                  router.push('/checkout?instant=true');
                }}
                className="btn-pill w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Buy Now (Skip to Address)</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>3-Year SoftBuild Warranty & 30-Day Hassle-Free Returns Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
