'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import { calculateCartETA } from '@/lib/eta';
import { ETABadge } from '@/components/common/ETABadge';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartTotal, couponDiscount, createOrder } = useStore();

  // Checkout Form State
  const [customerName, setCustomerName] = useState('Alexander Vance');
  const [customerEmail, setCustomerEmail] = useState('alex.vance@studio-obsidian.com');
  const [street, setStreet] = useState('742 Montgomery Street, Suite 400');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94111');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  // Stripe Test Card Simulation
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('739');
  const [isProcessing, setIsProcessing] = useState(false);

  const tiers = cart.map((i) => i.leadTimeTier);
  const cartETA = calculateCartETA(tiers);

  const tax = Math.round(cartTotal * 0.08);
  const grandTotal = cartTotal + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerName,
        customerEmail,
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country,
        },
        items: cart,
        subtotal: cartSubtotal,
        discount: couponDiscount,
        tax,
        shipping: 0,
        total: grandTotal,
        paymentMethod,
        etaDate: cartETA.arrivalDateString,
      });

      router.push(`/order-success?id=${order.id}&invoice=${order.invoiceNumber}&eta=${encodeURIComponent(cartETA.arrivalDateString)}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Your cart is empty.</h1>
        <p className="text-xs text-gray-400">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/prebuilt')}
          className="btn-pill px-6 py-2.5 bg-cyan-400 text-black text-xs font-bold"
        >
          Browse Prebuilts
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Secure Checkout</h1>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>256-Bit Encrypted High-Security Hardware Escrow</span>
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Shipping & Payment Information */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Shipping Address */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>1. Shipping & Delivery Address</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">Insured Freight</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Email Address (for Invoices & Updates)</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">State / Region</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Postal / PIN</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Speed / ETA Alert */}
            <div className="mt-2 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between text-xs">
              <span className="text-cyan-300 font-medium">{cartETA.label}</span>
              <span className="font-mono text-cyan-200 font-bold">{cartETA.arrivalDateString}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/10 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>2. Payment Method</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                STRIPE TEST MODE
              </span>
            </div>

            {/* Method Toggle: Stripe vs COD */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col gap-1 ${
                  paymentMethod === 'stripe'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Stripe Credit Card</span>
                  {paymentMethod === 'stripe' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <span className="text-[11px] text-gray-400">Visa, MasterCard, Amex, Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col gap-1 ${
                  paymentMethod === 'cod'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Cash / Wire on Delivery</span>
                  {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <span className="text-[11px] text-gray-400">Pay inspector upon crate arrival</span>
              </button>
            </div>

            {/* Stripe Card Details (Test mode enabled) */}
            {paymentMethod === 'stripe' && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-300">Test Card Number</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Test cards auto-approved</span>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-400">Expiration</span>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-400">CVC Code</span>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Order Summary & Place Order */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#111317] border border-white/15 flex flex-col gap-6 sticky top-24 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white">Order Summary</h3>
            <span className="text-xs font-mono text-cyan-400 font-semibold">{cart.length} Components</span>
          </div>

          {/* Mini Items Scroll */}
          <div className="max-h-60 overflow-y-auto flex flex-col gap-3 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg bg-black shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-white truncate">{item.title}</span>
                    <span className="text-[11px] text-gray-400 font-mono">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-mono font-semibold text-cyan-300 shrink-0">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col gap-2 text-xs text-gray-300 pt-3 border-t border-white/10">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-medium">${cartSubtotal.toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount</span>
                <span className="font-mono">-${couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured White-Glove Crate Delivery</span>
              <span className="font-mono text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST / State Tax</span>
              <span className="font-mono font-medium">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-white/10">
              <span>Grand Total</span>
              <span className="font-mono text-cyan-300 text-xl">${grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-pill w-full bg-[#00E5FF] hover:bg-[#00C2FF] disabled:opacity-50 text-[#0A0B0D] font-bold py-4 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Authorizing Transaction...</span>
            ) : (
              <>
                <span>Complete Purchase (${grandTotal.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>3-Year Hardware Warranty & 48-Hour Rapid Replacement</span>
          </div>
        </div>
      </form>
    </div>
  );
}
