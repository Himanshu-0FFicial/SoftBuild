# SoftBuild — Cinematic Luxury Custom PCs & Hardware Store

SoftBuild is a production-quality, luxury e-commerce web platform for custom computers and certified enthusiast hardware. Engineered with aerospace tolerances, 48-hour burn-in stress testing, 3-year concierge warranties, and express 4-to-10-day insured freight delivery.

---

## The 4 Core Journeys
SoftBuild maintains this exact hierarchy and order everywhere across the platform:
1. **[Build Your PC]** — Primary filled accent button (`#00E5FF`) linking to the 12-stage configurator.
2. **[Shop Prebuilts]** — Outline button linking to 8 luxury prebuilt computers.
3. **[Shop Parts]** — Outline button linking to the 44-component catalog.
4. **[Sell Your Parts]** — Text link with animated rotating arrow linking to the instant trade-in valuation wizard.

---

## Key Features

### 1. 12-Stage PC Configurator (`/build`)
- Step-by-step modular flow: CPU, Cooler, Motherboard, RAM, GPU, Storage, PSU, Case, Fans/RGB, OS, Displays, Peripherals, Review.
- **Real-Time Compatibility Engine**:
  - CPU socket vs. motherboard matching (LGA1700, AM5).
  - DDR4 vs. DDR5 memory checks.
  - PSU wattage headroom calculation (+20% safety buffer).
  - GPU length vs. case maximum clearance checks.
  - CPU cooler height vs. case maximum clearance.
  - Clear, one-line plain language explanations for disabled parts.
- **Live 3D PC Canvas**: Interactive Three.js model with slow rotation, drag-to-orbit, chassis finish picker (Obsidian Black, Ceramic White, Gunmetal Grey), RGB lighting picker (Cyan, Amber, Violet, Ice, Off), and exploded view.
- **Factory Presets**: Gaming King, Studio Master, Monolith Ultra, Horizon AI, Zenith Silent.
- Save rig to account, share build link, export spec sheet as PDF/print, and one-click add whole build to cart.

### 2. Prebuilt PCs Catalog (`/prebuilt` & `/prebuilt/[id]`)
- 8 flagship systems (Monolith Ultra, Aether 9 X3D, Apex Studio, Phantom SFF, Horizon AI, Nova Pure White, Zenith Stealth, Artisan Prime).
- Faceted filters: Budget slider ($1,800–$6,000), use case, GPU tier (4090/4080/4070), CPU brand (AMD/Intel), chassis color, size.
- Product detail pages with 360° spin 3D canvas, "Who is this for?" callout, 48h torture test benchmark charts, included parts breakdown with links, and a **"Customize this build"** button that loads the machine into `/build`.

### 3. Individual Parts Catalog (`/parts` & `/parts/[id]`)
- 44 certified enthusiast components across CPUs, GPUs, motherboards, RAM, NVMe SSDs, PSUs, cases, coolers, fans, OS, OLED monitors, and studio peripherals.
- Faceted filters by brand, price range, stock status, and a **"Compatible with my build"** toggle.
- Side-by-side comparison dock comparing up to 4 components simultaneously.

### 4. Trade-In / Sell Your Parts (`/sell`)
- Multi-step trade-in wizard: category, brand/model autocomplete, age slider, condition grade with plain-language definitions, working status, original box/invoice, 6-photo uploader simulator, serial number, and postal code.
- Algorithmic valuation quote range with free doorstep pickup.
- Payout options: Direct Bank Wire (ACH), Instant UPI/PayPal, or SoftBuild Store Credit (+15% bonus).

### 5. Mandatory 3-Layer Specifications Pattern
- **Layer 1 (Attention-Grabbing)**: 3 to 4 plain-language chips with icons, star rating, price, and colored ETA badge.
- **Layer 2 (Quick Specs)**: 4 to 8 metric cards highlighting key hardware figures.
- **Layer 3 (Full Specifications Accordion)**: Expandable Amazon-style specs with two interactive toggles:
  - *Explain in simple words*: Plain-English definitions for jargon.
  - *Nerd mode*: Raw silicon die sizes, transistor counts, boost timings, VRM power stages, and memory sub-timings.

### 6. Strict Delivery ETA Logic (4 / 6 / 10 Days)
- Only 3 delivery tiers exist (Never displays >10 days):
  - **4 Days (Green)**: In cleanroom warehouse stock.
  - **6 Days (Amber)**: Regional warehouse or prebuilt standard assembly.
  - **10 Days (Blue)**: Custom configurator rig (includes 48h thermal stress testing).
- Displays actual calendar date (`Arrives by Mon, 2 Nov`) plus countdown (`Order within 3h 12m for this date`).
- Split shipment option in cart so in-stock components arrive in 4 days while custom rigs undergo testing.

### 7. Cart, Checkout, Account & Admin
- **Cart (`/cart`)**: Drawer & full page, item quantities, coupon codes (`SOFTBUILD100`, `LUXURY5`), split shipment toggle, and upsell accessories.
- **Checkout (`/checkout`)**: Address validation, Stripe test mode credit card simulation, Cash on Delivery option, GST/tax calculations, and instant invoice creation.
- **Order Success (`/order-success`)**: Celebratory confetti, invoice number display, guaranteed delivery date, and 4 live build stages.
- **Customer Account (`/account`)**: Order history, 6-stage live tracking timeline (`Placed` → `Confirmed` → `Building/Packed` → `Shipped` → `Out for delivery` → `Delivered`), return requests, saved builds, and sell requests tracking.
- **Admin Dashboard (`/admin`)**: Order status modifier, stock quantity adjustments, sell request review queue (adjust offer, approve, mark paid), and coupon manager.

---

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Luxury Cinematic Glassmorphism Tokens
- **3D Graphics**: Three.js (WebGL Canvas with Orbit Physics, Material Lighting, Exploded Views)
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti
- **Testing**: Node.js Built-in Test Runner (`node:test`, `node:assert/strict`)

---

## Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v26)
- npm v9+

### Installation
```bash
# Clone or navigate to the directory
cd softbuild

# Install dependencies
npm install
```

### Seeding Catalog & Data
```bash
# Run catalog verification and seed script
npm run seed
# or
npx -y tsx scripts/seed.mjs
```

### Running Unit Tests
```bash
# Run the test suite (ETA logic, compatibility engine, PSU headroom, clearance, order invoices)
node --test tests/engine.test.mjs
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build
```bash
npm run build
npm run start
```
