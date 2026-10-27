export type DeliveryTier = 4 | 6 | 10;

export interface ETAResult {
  tier: DeliveryTier;
  days: number;
  badgeColor: 'green' | 'amber' | 'blue';
  label: string;
  arrivalDateString: string;
  orderCutoffText: string;
}

export type PartCategory =
  | 'cpu'
  | 'cooler'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'
  | 'fans'
  | 'os'
  | 'monitor'
  | 'peripheral';

export interface AttentionChip {
  label: string;
  iconName: string; // e.g. 'Gamepad2', 'Zap', 'ShieldCheck', 'Cpu', 'Sparkles'
}

export interface QuickSpecItem {
  label: string;
  value: string;
}

export interface SpecRow {
  name: string;
  value: string;
  nerdValue?: string; // e.g., "TSMC N4P, 379mm² die, 76.3B transistors"
  plainExplanation?: string; // e.g., "The silicon brain size and how tightly packed its microscopic switches are."
}

export interface SpecSection {
  title: string; // 'General' | 'Performance' | 'Memory' | 'Connectivity' | 'Power and Thermals' | 'Physical' | 'Compatibility' | 'In the box' | 'Warranty'
  rows: SpecRow[];
}

export interface ProductSpecs {
  attentionChips: AttentionChip[];
  quickSpecs: QuickSpecItem[];
  sections: SpecSection[];
}

export interface PartProduct {
  id: string;
  name: string;
  brand: string;
  category: PartCategory;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  leadTimeTier: DeliveryTier; // 4, 6, or 10
  image: string;
  rating: number;
  reviewCount: number;
  tagline: string;
  specs: ProductSpecs;

  // Compatibility flags & engine metrics
  socket?: string; // e.g., "LGA1700", "AM5"
  supportedMemory?: 'DDR4' | 'DDR5' | 'Both';
  chipset?: string; // e.g., "Z790", "X670E", "B650"
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
  tdpWatts?: number; // Power draw
  recommendedPsuWatts?: number;
  gpuLengthMm?: number;
  maxGpuLengthMm?: number; // for cases
  coolerHeightMm?: number;
  maxCoolerHeightMm?: number; // for cases
  radiatorSupportMm?: number[]; // e.g., [240, 280, 360, 420]
  m2Slots?: number;
  sataSlots?: number;
  pcieSlots?: number;
  wattageRating?: number; // for PSU
  efficiencyRating?: string; // "80+ Gold", "80+ Platinum", "80+ Titanium"
}

export interface PrebuiltBenchmark {
  title: string;
  gameOrApp: string;
  resolution: string; // "4K Ultra", "1440p Max", "Blender Cycles"
  score: string; // "142 FPS", "4m 12s", "38,400 pts"
  comparisonBaseline: string; // "vs Industry Avg +48%"
}

export interface PrebuiltPC {
  id: string;
  name: string;
  tagline: string;
  tier: 'Monolith' | 'Aether' | 'Apex' | 'Phantom' | 'Horizon' | 'Studio' | 'Nova' | 'Zenith';
  price: number;
  originalPrice?: number;
  emiPricePerMonth: number;
  image: string;
  secondaryImages: string[];
  leadTimeTier: DeliveryTier; // 6 or 10
  rating: number;
  reviewCount: number;
  headlineSpecs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
  };
  benchmarkBadge: string; // "Plays 4K 140+ FPS"
  useCase: 'Gaming' | 'Creator' | 'Workstation' | 'AI / Deep Learning' | 'Ultra-Compact' | 'Silent';
  specs: ProductSpecs;
  benchmarks: PrebuiltBenchmark[];
  whoIsThisFor: string;
  includedWarranty: string;
  noiseLevel: string; // "24 dB idle / 36 dB full load"
  caseColor: 'Obsidian Black' | 'Ceramic White' | 'Gunmetal Grey';
  size: 'Full Tower' | 'Mid Tower' | 'Small Form Factor (SFF)';
  partsList: {
    cpuId: string;
    coolerId: string;
    motherboardId: string;
    ramId: string;
    gpuId: string;
    storageId: string;
    psuId: string;
    caseId: string;
    fansId: string;
    osId: string;
  };
}

export interface CartItem {
  id: string;
  type: 'part' | 'prebuilt' | 'custom_build';
  productId?: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  leadTimeTier: DeliveryTier;
  customBuildParts?: Record<PartCategory, PartProduct | null>;
}

export type BuildSelection = Record<PartCategory, PartProduct | null>;

export interface CompatibilityCheck {
  compatible: boolean;
  warnings: string[];
  blockers: string[];
  totalPowerWatts: number;
  recommendedPsuWatts: number;
  psuHeadroomPercent: number;
  performanceScore: {
    gaming1080p: number; // 0-100
    gaming1440p: number; // 0-100
    gaming4k: number;    // 0-100
    creator: number;     // 0-100
    aiWorkload: number;  // 0-100
  };
}

export type TradeInGrade = 'Like new' | 'Good' | 'Fair' | 'For parts';

export interface SellPartSubmission {
  id: string;
  category: PartCategory;
  brand: string;
  model: string;
  ageYears: number;
  grade: TradeInGrade;
  isWorking: boolean;
  hasOriginalBox: boolean;
  hasInvoice: boolean;
  serialNumber: string;
  pinCode: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  status: 'Submitted' | 'Quote accepted' | 'Pickup scheduled' | 'Received' | 'Inspected' | 'Paid';
  payoutMethod: 'Bank Transfer' | 'Instant UPI' | 'SoftBuild Store Credit (+15% Bonus)';
  submittedAt: string;
  photoCount: number;
}

export interface OrderRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'stripe' | 'cod';
  status: 'Placed' | 'Confirmed' | 'Building/Packed' | 'Shipped' | 'Out for delivery' | 'Delivered';
  etaDate: string;
  createdAt: string;
}
