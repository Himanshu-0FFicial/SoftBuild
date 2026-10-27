'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Package, Cpu, RefreshCw } from 'lucide-react';

interface JourneyButtonsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'row' | 'wrap' | 'col';
}

export const JourneyButtons: React.FC<JourneyButtonsProps> = ({
  className = '',
  size = 'md',
  layout = 'row',
}) => {
  const sizeStyles = {
    sm: {
      btn: 'px-4 py-2 text-xs',
      textLink: 'text-xs',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      btn: 'px-6 py-3 text-sm',
      textLink: 'text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      btn: 'px-8 py-4 text-base font-semibold',
      textLink: 'text-base',
      icon: 'w-5 h-5',
    },
  }[size];

  const layoutClasses = {
    row: 'flex flex-wrap items-center gap-3',
    wrap: 'flex flex-wrap items-center gap-4',
    col: 'flex flex-col items-stretch gap-3 w-full',
  }[layout];

  return (
    <div className={`journey-buttons-group ${layoutClasses} ${className}`}>
      {/* 1. Customize & order a PC (Primary filled accent) */}
      <Link
        href="/build"
        className={`btn-pill group bg-[#00E5FF] hover:bg-[#00C2FF] text-[#0A0B0D] font-bold shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] transition-all duration-200 ${sizeStyles.btn}`}
      >
        <Wrench className={`${sizeStyles.icon} mr-2 transition-transform duration-200 group-hover:-rotate-12`} />
        <span>Build Your PC</span>
        <ArrowRight className={`${sizeStyles.icon} ml-2 transition-transform duration-200 group-hover:translate-x-1`} />
      </Link>

      {/* 2. Buy a prebuilt PC (Outline) */}
      <Link
        href="/prebuilt"
        className={`btn-pill group border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 ${sizeStyles.btn}`}
      >
        <Package className={`${sizeStyles.icon} mr-2 opacity-70 group-hover:opacity-100`} />
        <span>Shop Prebuilts</span>
      </Link>

      {/* 3. Buy individual parts (Outline) */}
      <Link
        href="/parts"
        className={`btn-pill group border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 ${sizeStyles.btn}`}
      >
        <Cpu className={`${sizeStyles.icon} mr-2 opacity-70 group-hover:opacity-100`} />
        <span>Shop Parts</span>
      </Link>

      {/* 4. Sell your PC parts (Text link with arrow) */}
      <Link
        href="/sell"
        className={`group inline-flex items-center text-gray-400 hover:text-[#00E5FF] font-medium transition-colors duration-200 ml-1 py-1 ${sizeStyles.textLink}`}
      >
        <RefreshCw className={`${sizeStyles.icon} mr-1.5 transition-transform duration-300 group-hover:rotate-180`} />
        <span>Sell Your Parts</span>
        <ArrowRight className={`${sizeStyles.icon} ml-1 transition-transform duration-200 group-hover:translate-x-1`} />
      </Link>
    </div>
  );
};
