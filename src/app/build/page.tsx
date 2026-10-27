'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/context/StoreContext';
import { CONFIGURATOR_STEPS, BUILD_PRESETS } from '@/lib/constants';
import { ALL_PARTS } from '@/lib/data/parts';
import { PartCategory, PartProduct } from '@/lib/types';
import { isPartCompatibleWithBuild } from '@/lib/compatibility';
import { PCModelCanvas } from '@/components/3d/PCModelCanvas';
import { ETABadge } from '@/components/common/ETABadge';
import { SpecAccordion } from '@/components/common/SpecAccordion';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Save,
  Printer,
  ShoppingBag,
  Zap,
  Cpu,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Trash2,
  Sparkles,
  Gamepad2,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function ConfiguratorPage() {
  const router = useRouter();
  const {
    currentBuild,
    setBuildPart,
    loadPreset,
    resetBuild,
    compatibility,
    buildTotalPrice,
    saveCurrentBuild,
    addToCart,
  } = useStore();

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [saveBuildModal, setSaveBuildModal] = useState(false);
  const [buildNameInput, setBuildNameInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentStep = CONFIGURATOR_STEPS[activeStepIndex];
  const isReviewStep = activeStepIndex === CONFIGURATOR_STEPS.length - 1;

  // Filter available parts for current category
  const candidateParts = ALL_PARTS.filter((p) => p.category === currentStep.category);

  const selectedPart = currentBuild[currentStep.category];

  const handleShareBuild = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  const handleExportPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSaveBuild = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentBuild(buildNameInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSaveBuildModal(false);
      setBuildNameInput('');
    }, 1500);
  };

  const handleAddWholeBuildToCart = () => {
    addToCart({
      id: `custom-rig-${Date.now()}`,
      type: 'custom_build',
      title: 'SoftBuild Bespoke Custom Rig',
      subtitle: `${currentBuild.cpu?.name || 'High Performance CPU'} • ${currentBuild.gpu?.name || 'Flagship GPU'}`,
      price: buildTotalPrice,
      image: currentBuild.case?.image || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80',
      leadTimeTier: 10, // Custom builds always 10 days for assembly and 48hr stress test
      customBuildParts: currentBuild,
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-8 pb-32 lg:pb-12">
      {/* Top Header: Title, Presets Bar, and Action Tools */}
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
              <Wrench className="w-3.5 h-3.5" />
              <span>SoftBuild Architecture Lab</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              PC Configurator
            </h1>
          </div>

          {/* Quick Actions: Share, Save, Print PDF, Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareBuild}
              className="btn-pill px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 flex items-center gap-1.5"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShareLink ? 'Link Copied!' : 'Share Build'}</span>
            </button>

            <button
              onClick={() => setSaveBuildModal(true)}
              className="btn-pill px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Rig</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="btn-pill px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={resetBuild}
              className="btn-pill px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Presets Bar: 'Gaming', 'Creator', 'Workstation', 'AI/ML', 'Silent' */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Start from an engineered baseline:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {BUILD_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className="btn-pill px-4 py-2 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs font-semibold text-gray-200 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{p.name}</span>
                <span className="text-[10px] text-gray-400 font-mono">({p.badge})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 12-Step Horizontal Stepper Ribbon */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CONFIGURATOR_STEPS.map((step, idx) => {
            const isCompleted = !!currentBuild[step.category];
            const isActive = activeStepIndex === idx;

            return (
              <button
                key={step.category}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : isCompleted
                    ? 'bg-white/5 text-gray-200 border-emerald-500/30 hover:bg-white/10'
                    : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60">0{idx + 1}</span>
                <span>{step.title.split(' ')[0]}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Step Parts Picker or Review */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Step 0{activeStepIndex + 1} of {CONFIGURATOR_STEPS.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {currentStep.title}
              </h2>
              <p className="text-xs text-gray-400 mt-1">{currentStep.subtitle}</p>
            </div>

            {selectedPart && (
              <button
                onClick={() => setBuildPart(currentStep.category, null)}
                className="text-xs text-red-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Selection</span>
              </button>
            )}
          </div>

          {/* Parts Options for Current Category */}
          <div className="flex flex-col gap-4">
            {candidateParts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-gray-400">
                No components cataloged in this optional section. You can proceed to the next step.
              </div>
            ) : (
              candidateParts.map((part) => {
                const isSelected = selectedPart?.id === part.id;
                const compCheck = isPartCompatibleWithBuild(part, currentBuild);
                const isDisabled = !compCheck.compatible && !isSelected;

                return (
                  <div
                    key={part.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col gap-4 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                        : isDisabled
                        ? 'bg-red-950/10 border-red-500/20 opacity-60'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                    }`}
                  >
                    {/* Top Row: Image, Name, Brand, Price & Select Button */}
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
                            {part.brand}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white">{part.name}</h3>
                          <span className="text-xs font-mono font-bold text-cyan-300 mt-1">
                            ${part.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={isDisabled}
                          onClick={() => {
                            setBuildPart(currentStep.category, isSelected ? null : part);
                            if (!isSelected && activeStepIndex < CONFIGURATOR_STEPS.length - 1) {
                              // Auto advance step gently
                              setActiveStepIndex((prev) => prev + 1);
                            }
                          }}
                          className={`btn-pill px-6 py-2.5 text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                              : isDisabled
                              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                              : 'bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D]'
                          }`}
                        >
                          {isSelected ? 'Selected ✓' : 'Select Component'}
                        </button>
                      </div>
                    </div>

                    {/* Compatibility Warning / Blocker Notice if incompatible */}
                    {!compCheck.compatible && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Incompatible: {compCheck.reason}</span>
                      </div>
                    )}

                    {/* Full 3-Layer Specifications */}
                    <div className="pt-2">
                      <SpecAccordion specs={part.specs} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="btn-pill px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(CONFIGURATOR_STEPS.length - 1, prev + 1))}
              disabled={activeStepIndex === CONFIGURATOR_STEPS.length - 1}
              className="btn-pill px-5 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <span>Next: {CONFIGURATOR_STEPS[Math.min(CONFIGURATOR_STEPS.length - 1, activeStepIndex + 1)].title.split(' ')[0]}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Live 3D Preview, Live Power Draw, Performance Radar & Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          {/* Live 3D PC Preview */}
          <div className="rounded-3xl glass-panel-elevated p-2 border border-white/15 overflow-hidden">
            <PCModelCanvas initialColor="Obsidian Black" initialRgb="Cyan" showControls={true} />
            <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span className="font-medium text-cyan-300">Live 3D Customizer</span>
              <span className="font-mono text-xs">{currentBuild.case?.name ? 'Case: Custom Enclosure' : 'Select Case'}</span>
            </div>
          </div>

          {/* Real-Time Power Draw & PSU Headroom Gauge */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Power Estimate & Headroom</h4>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {compatibility.totalPowerWatts}W Total
              </span>
            </div>

            {/* Power Bar */}
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  compatibility.blockers.some((b) => b.includes('PSU'))
                    ? 'bg-red-500'
                    : compatibility.warnings.some((w) => w.includes('PSU'))
                    ? 'bg-amber-400'
                    : 'bg-cyan-400'
                }`}
                style={{
                  width: `${Math.min(100, (compatibility.totalPowerWatts / (currentBuild.psu?.wattageRating || 1000)) * 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span>Selected PSU: {currentBuild.psu?.wattageRating || 0}W</span>
              <span>Recommended: {compatibility.recommendedPsuWatts}W (+20% safe buffer)</span>
            </div>
          </div>

          {/* Performance Radar Indicator */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">System Performance Ratings</h4>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>4K Ultra Gaming / Path Tracing</span>
                  <span className="font-mono text-cyan-300">{compatibility.performanceScore.gaming4k}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${compatibility.performanceScore.gaming4k}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>1440p High Refresh (240Hz+)</span>
                  <span className="font-mono text-cyan-300">{compatibility.performanceScore.gaming1440p}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${compatibility.performanceScore.gaming1440p}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>8K Video Editing & 3D Render</span>
                  <span className="font-mono text-cyan-300">{compatibility.performanceScore.creator}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full" style={{ width: `${compatibility.performanceScore.creator}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>Local AI & LLM Inference</span>
                  <span className="font-mono text-cyan-300">{compatibility.performanceScore.aiWorkload}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${compatibility.performanceScore.aiWorkload}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Engine Status Banner */}
          <div className="p-4 rounded-2xl border flex flex-col gap-2 text-xs">
            {compatibility.compatible ? (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>100% Electrically & Dimensionally Verified</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 text-red-400">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Hardware Blockers Detected:</span>
                </div>
                {compatibility.blockers.map((b, i) => (
                  <p key={i} className="text-[11px] text-red-300 pl-6">• {b}</p>
                ))}
              </div>
            )}

            {compatibility.warnings.length > 0 && (
              <div className="flex flex-col gap-1 text-amber-300 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Engineering Notice:</span>
                </div>
                {compatibility.warnings.map((w, i) => (
                  <p key={i} className="text-[11px] text-amber-200/80 pl-5">• {w}</p>
                ))}
              </div>
            )}
          </div>

          {/* Price & Add Whole Rig To Cart */}
          <div className="p-6 rounded-3xl bg-[#111317] border border-white/15 flex flex-col gap-4 shadow-xl">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase font-medium text-gray-400 block">Total Build Price</span>
                <span className="text-3xl font-black font-mono text-cyan-300">
                  ${buildTotalPrice.toLocaleString()}
                </span>
              </div>
              <ETABadge tier={10} compact={true} />
            </div>

            <button
              onClick={handleAddWholeBuildToCart}
              disabled={buildTotalPrice === 0 || !compatibility.compatible}
              className="btn-pill w-full bg-[#00E5FF] hover:bg-[#00C2FF] disabled:opacity-40 disabled:hover:bg-[#00E5FF] text-[#0A0B0D] font-bold py-4 text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Custom Rig to Cart</span>
            </button>

            <span className="text-[11px] text-center text-gray-400">
              Includes 48-Hour Burn-in Stress Test & 3-Year SoftBuild Warranty
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#0A0B0D]/95 backdrop-blur-xl border-t border-white/15 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-gray-400 block">Total</span>
          <span className="text-xl font-black font-mono text-cyan-300">${buildTotalPrice.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStepIndex((prev) => Math.min(CONFIGURATOR_STEPS.length - 1, prev + 1))}
            className="btn-pill px-4 py-2.5 bg-white/10 text-white text-xs font-semibold"
          >
            Next Step
          </button>
          <button
            onClick={handleAddWholeBuildToCart}
            disabled={buildTotalPrice === 0 || !compatibility.compatible}
            className="btn-pill px-5 py-2.5 bg-[#00E5FF] text-black text-xs font-bold"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Save Build Modal */}
      {saveBuildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#111317] border border-white/15 shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Save Current Build</h3>
            <p className="text-xs text-gray-400">
              Give your machine configuration a custom name to access it in your SoftBuild account.
            </p>

            <form onSubmit={handleSaveBuild} className="flex flex-col gap-3">
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. My 4K Cyberpunk Beast"
                value={buildNameInput}
                onChange={(e) => setBuildNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveBuildModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pill px-5 py-2 bg-cyan-400 text-black text-xs font-bold"
                >
                  {savedSuccess ? 'Saved ✓' : 'Save to Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
