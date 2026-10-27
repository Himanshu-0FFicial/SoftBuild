'use client';

import React from 'react';
import { DeliveryTier } from '@/lib/types';
import { calculateETA } from '@/lib/eta';
import { Clock, ShieldCheck, Truck } from 'lucide-react';

interface ETABadgeProps {
  tier?: DeliveryTier;
  inStock?: boolean;
  compact?: boolean;
  showCountdown?: boolean;
  className?: string;
}

export const ETABadge: React.FC<ETABadgeProps> = ({
  tier = 4,
  inStock = true,
  compact = false,
  showCountdown = true,
  className = '',
}) => {
  if (!inStock) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 ${className}`}>
        Out of Stock • Notify Me
      </span>
    );
  }

  const eta = calculateETA(tier, inStock);

  const badgeColorStyles = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  }[eta.badgeColor];

  const dotColor = {
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    blue: 'bg-cyan-400',
  }[eta.badgeColor];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeColorStyles} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
        <span>{eta.days} Days • {eta.arrivalDateString}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColorStyles}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
          <Truck className="w-3 h-3 ml-0.5" />
          <span>{eta.days} Days Delivery</span>
        </div>
        <span className="text-xs font-mono text-gray-300 font-semibold">{eta.arrivalDateString}</span>
      </div>

      {showCountdown && (
        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
          <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>{eta.orderCutoffText}</span>
        </div>
      )}
    </div>
  );
};
