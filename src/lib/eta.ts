import { DeliveryTier, ETAResult } from './types';

export function calculateETA(tier: DeliveryTier = 4, inStock: boolean = true): ETAResult {
  // Enforce the strict 3 tiers rule (4, 6, 10 max)
  const validTier: DeliveryTier = tier <= 4 ? 4 : tier <= 6 ? 6 : 10;

  const now = new Date();
  const arrivalDate = new Date();
  arrivalDate.setDate(now.getDate() + validTier);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = daysOfWeek[arrivalDate.getDay()];
  const dateNum = arrivalDate.getDate();
  const monthName = months[arrivalDate.getMonth()];
  const arrivalDateString = `Arrives by ${dayName}, ${dateNum} ${monthName}`;

  // Compute countdown until daily shipping cutoff (e.g., 6:00 PM local cutoff)
  const hoursLeft = Math.max(1, 18 - now.getHours());
  const minutesLeft = 60 - now.getMinutes();
  const orderCutoffText = `Order within ${hoursLeft}h ${minutesLeft}m for this date`;

  if (validTier === 4) {
    return {
      tier: 4,
      days: 4,
      badgeColor: 'green',
      label: 'Express Warehouse (4 Days)',
      arrivalDateString,
      orderCutoffText,
    };
  }

  if (validTier === 6) {
    return {
      tier: 6,
      days: 6,
      badgeColor: 'amber',
      label: 'Regional Priority (6 Days)',
      arrivalDateString,
      orderCutoffText,
    };
  }

  return {
    tier: 10,
    days: 10,
    badgeColor: 'blue',
    label: 'Custom Assembly & 48h Stress Test (10 Days)',
    arrivalDateString,
    orderCutoffText,
  };
}

export function calculateCartETA(tiers: DeliveryTier[]): ETAResult {
  if (tiers.length === 0) return calculateETA(4);
  const maxTier = Math.max(...tiers) as DeliveryTier;
  return calculateETA(maxTier > 6 ? 10 : maxTier > 4 ? 6 : 4);
}
