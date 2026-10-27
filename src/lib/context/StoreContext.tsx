'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BuildSelection,
  CartItem,
  CompatibilityCheck,
  OrderRecord,
  PartCategory,
  PartProduct,
  PrebuiltPC,
  SellPartSubmission,
} from '../types';
import { ALL_PARTS } from '../data/parts';
import { ALL_PREBUILTS } from '../data/prebuilts';
import { checkBuildCompatibility } from '../compatibility';
import { BUILD_PRESETS } from '../constants';

interface StoreContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Cart
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  couponDiscount: number;
  splitShipment: boolean;
  setSplitShipment: (split: boolean) => void;
  cartSubtotal: number;
  cartTotal: number;
  lastAddedItem: CartItem | null;

  // Configurator
  currentBuild: BuildSelection;
  setBuildPart: (category: PartCategory, part: PartProduct | null) => void;
  loadPreset: (presetId: string) => void;
  loadPrebuiltIntoConfigurator: (prebuilt: PrebuiltPC) => void;
  resetBuild: () => void;
  compatibility: CompatibilityCheck;
  buildTotalPrice: number;
  savedBuilds: { id: string; name: string; date: string; build: BuildSelection }[];
  saveCurrentBuild: (name: string) => void;

  // Part Comparison (up to 4)
  comparePartIds: string[];
  toggleComparePart: (partId: string) => void;
  clearCompare: () => void;

  // Orders
  orders: OrderRecord[];
  createOrder: (orderData: Omit<OrderRecord, 'id' | 'invoiceNumber' | 'createdAt' | 'status'>) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;

  // Sell / Trade-in
  sellSubmissions: SellPartSubmission[];
  submitSellPart: (submission: Omit<SellPartSubmission, 'id' | 'submittedAt' | 'status'>) => SellPartSubmission;
  updateSellStatus: (id: string, status: SellPartSubmission['status'], adjustedPrice?: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_BUILD: BuildSelection = {
  cpu: null,
  cooler: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  psu: null,
  case: null,
  fans: null,
  os: null,
  monitor: null,
  peripheral: null,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [splitShipment, setSplitShipment] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Configurator state
  const [currentBuild, setCurrentBuild] = useState<BuildSelection>(DEFAULT_BUILD);
  const [savedBuilds, setSavedBuilds] = useState<{ id: string; name: string; date: string; build: BuildSelection }[]>([]);

  // Compare state
  const [comparePartIds, setComparePartIds] = useState<string[]>([]);

  // Orders and Sell Submissions
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [sellSubmissions, setSellSubmissions] = useState<SellPartSubmission[]>([]);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('softbuild_theme') as 'dark' | 'light';
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
      }

      const savedCart = localStorage.getItem('softbuild_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('softbuild_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSell = localStorage.getItem('softbuild_sell');
      if (savedSell) setSellSubmissions(JSON.parse(savedSell));

      const storedBuilds = localStorage.getItem('softbuild_saved_builds');
      if (storedBuilds) setSavedBuilds(JSON.parse(storedBuilds));
    } catch {
      // ignore SSR storage access
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('softbuild_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('softbuild_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('softbuild_sell', JSON.stringify(sellSubmissions));
    } catch {}
  }, [sellSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem('softbuild_saved_builds', JSON.stringify(savedBuilds));
    } catch {}
  }, [savedBuilds]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('softbuild_theme', nextTheme);
    document.documentElement.classList.toggle('light-theme', nextTheme === 'light');
  };

  // Cart operations
  const addToCart = (itemData: Omit<CartItem, 'quantity'>, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemData.id);
      if (existing) {
        return prev.map((i) => (i.id === itemData.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { ...itemData, quantity: qty }];
    });
    const fullItem = { ...itemData, quantity: qty };
    setLastAddedItem(fullItem);
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SOFTBUILD100') {
      setCouponCode(clean);
      setCouponDiscount(100);
      return true;
    }
    if (clean === 'LUXURY5') {
      setCouponCode(clean);
      setCouponDiscount(Math.round(cartSubtotal * 0.05));
      return true;
    }
    return false;
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount);

  // Configurator operations
  const setBuildPart = (category: PartCategory, part: PartProduct | null) => {
    setCurrentBuild((prev) => ({
      ...prev,
      [category]: part,
    }));
  };

  const loadPreset = (presetId: string) => {
    const preset = BUILD_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const newBuild: BuildSelection = { ...DEFAULT_BUILD };
    Object.entries(preset.partIds).forEach(([cat, partId]) => {
      const part = ALL_PARTS.find((p) => p.id === partId);
      if (part) {
        newBuild[cat as PartCategory] = part;
      }
    });
    setCurrentBuild(newBuild);
  };

  const loadPrebuiltIntoConfigurator = (prebuilt: PrebuiltPC) => {
    const newBuild: BuildSelection = { ...DEFAULT_BUILD };
    const mappings: [PartCategory, string][] = [
      ['cpu', prebuilt.partsList.cpuId],
      ['cooler', prebuilt.partsList.coolerId],
      ['motherboard', prebuilt.partsList.motherboardId],
      ['ram', prebuilt.partsList.ramId],
      ['gpu', prebuilt.partsList.gpuId],
      ['storage', prebuilt.partsList.storageId],
      ['psu', prebuilt.partsList.psuId],
      ['case', prebuilt.partsList.caseId],
      ['fans', prebuilt.partsList.fansId],
      ['os', prebuilt.partsList.osId],
    ];

    mappings.forEach(([cat, partId]) => {
      const part = ALL_PARTS.find((p) => p.id === partId);
      if (part) newBuild[cat] = part;
    });

    setCurrentBuild(newBuild);
  };

  const resetBuild = () => {
    setCurrentBuild(DEFAULT_BUILD);
  };

  const saveCurrentBuild = (name: string) => {
    const newEntry = {
      id: `build-${Date.now()}`,
      name: name || `Custom SoftBuild Rig (${new Date().toLocaleDateString()})`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      build: currentBuild,
    };
    setSavedBuilds((prev) => [newEntry, ...prev]);
  };

  const compatibility = checkBuildCompatibility(currentBuild);

  const buildTotalPrice = Object.values(currentBuild).reduce(
    (acc, part) => (part ? acc + part.price : acc),
    0
  );

  // Compare operations
  const toggleComparePart = (partId: string) => {
    setComparePartIds((prev) => {
      if (prev.includes(partId)) return prev.filter((id) => id !== partId);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, partId];
    });
  };

  const clearCompare = () => setComparePartIds([]);

  // Orders
  const createOrder = (orderData: Omit<OrderRecord, 'id' | 'invoiceNumber' | 'createdAt' | 'status'>): OrderRecord => {
    const invoiceNumber = `SB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      invoiceNumber,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Sell
  const submitSellPart = (
    submission: Omit<SellPartSubmission, 'id' | 'submittedAt' | 'status'>
  ): SellPartSubmission => {
    const newSub: SellPartSubmission = {
      ...submission,
      id: `trade-${Date.now()}`,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    };
    setSellSubmissions((prev) => [newSub, ...prev]);
    return newSub;
  };

  const updateSellStatus = (id: string, status: SellPartSubmission['status'], adjustedPrice?: number) => {
    setSellSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          status,
          ...(adjustedPrice ? { estimatedPriceMin: adjustedPrice, estimatedPriceMax: adjustedPrice } : {}),
        };
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        applyCoupon,
        couponDiscount,
        splitShipment,
        setSplitShipment,
        cartSubtotal,
        cartTotal,
        lastAddedItem,
        currentBuild,
        setBuildPart,
        loadPreset,
        loadPrebuiltIntoConfigurator,
        resetBuild,
        compatibility,
        buildTotalPrice,
        savedBuilds,
        saveCurrentBuild,
        comparePartIds,
        toggleComparePart,
        clearCompare,
        orders,
        createOrder,
        updateOrderStatus,
        sellSubmissions,
        submitSellPart,
        updateSellStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
