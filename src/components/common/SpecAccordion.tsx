'use client';

import React, { useState } from 'react';
import { ProductSpecs } from '@/lib/types';
import {
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Gamepad2,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface SpecAccordionProps {
  specs: ProductSpecs;
  className?: string;
  defaultExpanded?: boolean;
}

export const SpecAccordion: React.FC<SpecAccordionProps> = ({
  specs,
  className = '',
  defaultExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [explainInSimpleWords, setExplainInSimpleWords] = useState(false);
  const [nerdMode, setNerdMode] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className={`three-layer-specs flex flex-col gap-4 ${className}`}>
      {/* ================= LAYER 1: ATTENTION-GRABBING CHIPS ================= */}
      <div className="layer-1-attention-chips flex flex-wrap gap-2">
        {specs.attentionChips.map((chip, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 hover:border-cyan-400/30 transition-all text-gray-200"
          >
            {getIcon(chip.iconName)}
            <span>{chip.label}</span>
          </div>
        ))}
      </div>

      {/* ================= LAYER 2: QUICK SPECS (6 to 8 key metrics) ================= */}
      <div className="layer-2-quick-specs grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
        {specs.quickSpecs.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-0.5 p-2 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{item.label}</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-100 font-mono-spec truncate" title={item.value}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* ================= LAYER 3: FULL SPECIFICATIONS ACCORDION ================= */}
      <div className="layer-3-full-specs border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-gray-100">Full Specifications & Engineering Specs</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{isOpen ? 'Collapse' : 'Expand all details'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="p-4 pt-0 border-t border-white/5 flex flex-col gap-5">
            {/* Toggles: "Explain in simple words" & "Nerd mode" */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExplainInSimpleWords(!explainInSimpleWords)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    explainInSimpleWords
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Explain in simple words</span>
                  {explainInSimpleWords && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setNerdMode(!nerdMode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    nerdMode
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Nerd Mode (Raw Hardware Values)</span>
                  {nerdMode && <CheckCircle2 className="w-3 h-3 text-purple-400" />}
                </button>
              </div>

              <span className="text-[11px] text-gray-400">
                {nerdMode ? 'Displaying raw silicon die, timings & VRM phases' : 'Standard catalog view'}
              </span>
            </div>

            {/* Accordion Sections (Amazon style table) */}
            <div className="flex flex-col gap-6">
              {specs.sections.map((section, sIdx) => (
                <div key={sIdx} className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/20 pb-1.5">
                    {section.title}
                  </h4>
                  <div className="grid grid-cols-1 divide-y divide-white/5">
                    {section.rows.map((row, rIdx) => (
                      <div key={rIdx} className="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 text-xs">
                        <span className="text-gray-400 sm:w-1/3 font-medium">{row.name}</span>
                        <div className="sm:w-2/3 flex flex-col gap-1">
                          <span className="text-gray-200 font-mono-spec font-medium">
                            {nerdMode && row.nerdValue ? row.nerdValue : row.value}
                          </span>

                          {explainInSimpleWords && row.plainExplanation && (
                            <div className="flex items-start gap-1.5 mt-1 p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/30 text-cyan-200 text-[11px]">
                              <Info className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{row.plainExplanation}</span>
                            </div>
                          )}

                          {nerdMode && row.nerdValue && (
                            <span className="text-[10px] text-purple-400 font-mono">
                              Raw: {row.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
