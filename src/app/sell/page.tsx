'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import { TRADE_IN_PRICING_TABLE } from '@/lib/constants';
import { PartCategory, TradeInGrade } from '@/lib/types';
import {
  RefreshCw,
  CheckCircle2,
  Camera,
  Upload,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Gift,
  HelpCircle,
  Truck,
  Check,
} from 'lucide-react';

export default function SellPage() {
  const router = useRouter();
  const { submitSellPart } = useStore();

  const [step, setStep] = useState(1);

  // Form Fields
  const [category, setCategory] = useState<PartCategory>('gpu');
  const [brand, setBrand] = useState('NVIDIA');
  const [model, setModel] = useState('GeForce RTX 4090 24GB');
  const [ageYears, setAgeYears] = useState(1);
  const [grade, setGrade] = useState<TradeInGrade>('Like new');
  const [isWorking, setIsWorking] = useState(true);
  const [hasOriginalBox, setHasOriginalBox] = useState(true);
  const [hasInvoice, setHasInvoice] = useState(true);
  const [serialNumber, setSerialNumber] = useState('SN-4090-99812');
  const [pinCode, setPinCode] = useState('94103');
  const [uploadedPhotos, setUploadedPhotos] = useState<number>(3);
  const [payoutMethod, setPayoutMethod] = useState<
    'Bank Transfer' | 'Instant UPI' | 'SoftBuild Store Credit (+15% Bonus)'
  >('SoftBuild Store Credit (+15% Bonus)');

  // Dynamic Autocomplete suggestions
  const modelSuggestions = {
    gpu: ['GeForce RTX 4090 24GB', 'GeForce RTX 4080 Super 16GB', 'GeForce RTX 4070 Ti Super 16GB', 'Radeon RX 7900 XTX 24GB', 'GeForce RTX 3090 24GB'],
    cpu: ['Intel Core i9-14900KS', 'Intel Core i9-13900K', 'AMD Ryzen 7 7800X3D', 'AMD Ryzen 9 7950X3D', 'Intel Core i7-14700K'],
    ram: ['G.Skill Trident Z5 64GB DDR5', 'Corsair Dominator Titanium 32GB DDR5', 'Kingston Fury Beast 32GB DDR5'],
    storage: ['Samsung 990 PRO 4TB NVMe', 'WD_BLACK SN850X 2TB NVMe', 'Crucial T700 2TB Gen5'],
    motherboard: ['ASUS ROG Maximus Z790 Dark Hero', 'ASUS ROG Crosshair X670E Hero', 'MSI MAG Z790 Tomahawk WiFi'],
    cooler: ['NZXT Kraken Elite 360 LCD', 'ARCTIC Liquid Freezer III 360', 'Noctua NH-D15 Chromax'],
    psu: ['Seasonic Prime TX-1300 Titanium', 'Corsair RM1000x Shift', 'be quiet! Dark Power Pro 13 1200W'],
    case: ['Lian Li O11 Dynamic EVO RGB', 'Fractal Design North Charcoal Walnut', 'NZXT H9 Flow Dual-Chamber'],
    fans: ['Lian Li UNI FAN TL LCD 3-Pack', 'Corsair iCUE LINK QX120', 'Noctua NF-A12x25 Chromax'],
    os: ['Windows 11 Pro Retail License'],
    monitor: ['ASUS ROG Swift OLED PG32UCDM 4K 240Hz', 'Alienware AW3423DWF 34" QD-OLED'],
    peripheral: ['SoftBuild Artisan Magnetic Keyboard', 'Logitech G Pro X Superlight 2'],
  }[category] || ['GeForce RTX 4090 24GB'];

  // Calculate pricing range
  const matchedPricing =
    TRADE_IN_PRICING_TABLE.find(
      (t) => t.category === category && model.toLowerCase().includes(t.modelQuery.toLowerCase())
    ) || TRADE_IN_PRICING_TABLE[0];

  const basePrice =
    grade === 'Like new'
      ? matchedPricing.likeNew
      : grade === 'Good'
      ? matchedPricing.good
      : grade === 'Fair'
      ? matchedPricing.fair
      : matchedPricing.forParts;

  // Box and Invoice bonuses
  const bonusMultiplier = (hasOriginalBox ? 1.05 : 1.0) * (hasInvoice ? 1.05 : 1.0) * (isWorking ? 1.0 : 0.4);
  const minEstimate = Math.round(basePrice * 0.95 * bonusMultiplier);
  const maxEstimate = Math.round(basePrice * 1.1 * bonusMultiplier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSellPart({
      category,
      brand,
      model,
      ageYears,
      grade,
      isWorking,
      hasOriginalBox,
      hasInvoice,
      serialNumber,
      pinCode,
      estimatedPriceMin: minEstimate,
      estimatedPriceMax: maxEstimate,
      payoutMethod,
      photoCount: uploadedPhotos,
    });
    router.push('/account?tab=tradein');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center items-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>SoftBuild Certified Trade-In Program</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Sell Your PC Parts
        </h1>
        <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
          Get an immediate algorithmic valuation, free doorstep courier pickup, and prompt payout via direct bank transfer, UPI, or store credit with a +15% bonus.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        {[
          { num: 1, title: 'Component Info' },
          { num: 2, title: 'Condition & Photos' },
          { num: 3, title: 'Valuation & Payout' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 text-xs font-semibold ${
              step >= s.num ? 'text-cyan-400' : 'text-gray-500'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                step >= s.num ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-400'
              }`}
            >
              0{s.num}
            </div>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl glass-panel-elevated border border-white/15 flex flex-col gap-8 shadow-2xl">
        {/* ================= STEP 1: Component Category & Model ================= */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white">Select Component & Model</h3>
              <p className="text-xs text-gray-400 mt-1">Specify which piece of hardware you want to trade in.</p>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { cat: 'gpu', label: 'Graphics Card (GPU)' },
                  { cat: 'cpu', label: 'Processor (CPU)' },
                  { cat: 'motherboard', label: 'Motherboard' },
                  { cat: 'ram', label: 'Memory (RAM)' },
                  { cat: 'storage', label: 'Storage (NVMe SSD)' },
                  { cat: 'psu', label: 'Power Supply' },
                  { cat: 'case', label: 'Chassis Case' },
                  { cat: 'monitor', label: 'Display Monitor' },
                ].map((item) => (
                  <button
                    key={item.cat}
                    type="button"
                    onClick={() => {
                      setCategory(item.cat as PartCategory);
                      setModel(modelSuggestions[0] || 'Flagship Model');
                    }}
                    className={`p-3 rounded-2xl text-xs font-medium border text-left transition-all ${
                      category === item.cat
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'bg-white/[0.02] text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand / Model with Autocomplete */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Exact Model (Autocomplete)</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. GeForce RTX 4090 24GB"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />

              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[11px] text-gray-400">Suggestions:</span>
                {modelSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setModel(sug)}
                    className="text-[11px] text-cyan-400 hover:underline font-mono"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Age of Part */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-300">Approximate Age</span>
                <span className="font-mono text-cyan-300 font-bold">{ageYears} Year{ageYears > 1 ? 's' : ''} Old</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-pill px-8 py-3 bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold text-xs flex items-center gap-2"
              >
                <span>Continue to Condition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Condition & Photos ================= */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white">Condition & Proof of Hardware</h3>
              <p className="text-xs text-gray-400 mt-1">
                Plain-language grade descriptions for an accurate, unadjusted payout.
              </p>
            </div>

            {/* Condition Grade with Plain Language Descriptions */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Cosmetic & Functional Grade</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    grade: 'Like new',
                    title: 'Like New (Mint)',
                    desc: 'Flawless condition with zero scratches, fully dust-free, and includes all factory accessories.',
                  },
                  {
                    grade: 'Good',
                    title: 'Good (Minor Cosmetic Wear)',
                    desc: '100% functional with light screw marks or subtle surface scratches. No thermal issues.',
                  },
                  {
                    grade: 'Fair',
                    title: 'Fair (Visible Wear / Heavy Use)',
                    desc: 'Noticeable scratches or bent bracket, but boots and passes baseline benchmarks.',
                  },
                  {
                    grade: 'For parts',
                    title: 'For Parts / Non-Functional',
                    desc: 'Artifacting, dead fan, does not post, or physical damage. Recycled for scrap components.',
                  },
                ].map((item) => (
                  <button
                    key={item.grade}
                    type="button"
                    onClick={() => setGrade(item.grade as TradeInGrade)}
                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col gap-1.5 ${
                      grade === item.grade
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      {grade === item.grade && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes: Working, Original Box, Original Invoice */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-gray-200">Fully Working?</span>
                <input
                  type="checkbox"
                  checked={isWorking}
                  onChange={(e) => setIsWorking(e.target.checked)}
                  className="rounded border-white/20 text-cyan-400 focus:ring-0"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-gray-200">Has Original Box?</span>
                <input
                  type="checkbox"
                  checked={hasOriginalBox}
                  onChange={(e) => setHasOriginalBox(e.target.checked)}
                  className="rounded border-white/20 text-cyan-400 focus:ring-0"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-gray-200">Has Invoice / Receipt?</span>
                <input
                  type="checkbox"
                  checked={hasInvoice}
                  onChange={(e) => setHasInvoice(e.target.checked)}
                  className="rounded border-white/20 text-cyan-400 focus:ring-0"
                />
              </label>
            </div>

            {/* Photo Upload Simulator (up to 6 photos) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-300">Component Photos ({uploadedPhotos}/6 Attached)</span>
                <span className="text-[11px] text-cyan-400">Front, back, serial sticker, pins</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setUploadedPhotos((prev) => (i < prev ? prev - 1 : Math.min(6, prev + 1)))}
                    className={`h-20 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                      i < uploadedPhotos
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                        : 'bg-white/[0.02] border-dashed border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                    {i < uploadedPhotos ? (
                      <Check className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                    <span className="text-[9px] mt-1 font-mono">Photo 0{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Serial Number & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Serial Number</label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Pickup Postal / PIN Code</label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-pill px-6 py-2.5 bg-white/5 text-gray-400 text-xs"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-pill px-8 py-3 bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold text-xs flex items-center gap-2"
              >
                <span>View Instant Valuation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Instant Valuation & Payout Selection ================= */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white">Instant Valuation Range</h3>
              <p className="text-xs text-gray-400 mt-1">
                Based on current market pricing for {model} in {grade} condition.
              </p>
            </div>

            {/* Valuation Card */}
            <div className="p-6 rounded-3xl bg-cyan-950/40 border border-cyan-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-300 font-bold block">
                  Guaranteed Quote Range
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-white mt-1 block">
                  ${minEstimate} – ${maxEstimate}
                </span>
                <p className="text-[11px] text-cyan-200 mt-1">
                  Final exact figure confirmed upon 30-minute benchmark inspection in our lab.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 flex flex-col gap-1">
                <span className="text-emerald-400 font-bold">✓ Doorstep Pickup Free</span>
                <span>Insured transit via FedEx Express</span>
              </div>
            </div>

            {/* Payout Method Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Choose Payout Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'SoftBuild Store Credit (+15% Bonus)',
                    icon: Gift,
                    title: 'SoftBuild Store Credit',
                    bonus: '+15% BONUS',
                    desc: 'Instantly credited towards any custom rig or prebuilt PC.',
                  },
                  {
                    key: 'Bank Transfer',
                    icon: Building2,
                    title: 'Direct Bank Wire (ACH)',
                    bonus: 'Standard',
                    desc: 'Direct wire transfer to your bank account within 24 hours of inspection.',
                  },
                  {
                    key: 'Instant UPI',
                    icon: CreditCard,
                    title: 'Instant UPI / PayPal',
                    bonus: 'Instant',
                    desc: 'Real-time electronic transfer to your verified handle.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = payoutMethod === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setPayoutMethod(item.key as any)}
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                          : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                          {item.bonus}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms Acknowledgement */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                Zero obligation: If our final offer after physical testing does not meet your approval, we ship your part back to you 100% free of charge.
              </span>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-pill px-6 py-2.5 bg-white/5 text-gray-400 text-xs"
              >
                Back
              </button>

              <button
                type="submit"
                className="btn-pill px-8 py-3.5 bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)]"
              >
                <span>Submit for Doorstep Inspection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
