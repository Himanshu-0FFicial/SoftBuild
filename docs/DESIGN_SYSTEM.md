# SoftBuild Design System & Motion Specification

## 1. Visual & Aesthetic Mood
- **Base Theme**: Cinematic Near-Black (`#0A0B0D`), soft off-white text (`#F3F4F6`), subtle border lines (`rgba(255, 255, 255, 0.08)`).
- **Signature Accent**: Electric Cyber Cyan (`#00E5FF`), luminous glow (`rgba(0, 229, 255, 0.25)`).
- **Secondary Accent**: Warm Amber Gold (`#FFB300`) for performance badges, ratings, and warnings.
- **Light Theme Variant**: Clean architectural platinum (`#F8F9FA`), charcoal text (`#111827`), deep teal accents (`#0088AA`).
- **Surfaces**: Frosted luxury glassmorphism (`backdrop-filter: blur(16px)` to `blur(24px)`), hairline 1px borders, subtle 24px film grain noise pattern.

---

## 2. The 4 Core Journeys (Strict Hierarchy & Order)
Everywhere the 4 core journeys are displayed, the following exact order and hierarchy is preserved:
1. **[Build Your PC]** — Filled accent pill button (`#00E5FF`), black text, cyan drop-glow shadow, wrench icon, magnetic hover.
2. **[Shop Prebuilts]** — Pill button with thin 1px outline (`border-white/20`), package icon.
3. **[Shop Parts]** — Pill button with thin 1px outline (`border-white/20`), microchip icon.
4. **[Sell Your Parts]** — Understated text link with animated rotating arrows on hover (`#9CA3AF` → `#00E5FF`).

---

## 3. Typography Stack
- **Editorial Headlines**: Sans-serif display typeface with tight character tracking (`tracking-tight`, `leading-[1.05]`), gradient text masking (`#FFFFFF` to `#9CA3AF`).
- **User Interface**: Clean neutral system sans (`Inter` / `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).
- **Specs & Numbers**: Monospace font family (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`) with tabular figures (`tnum`, `zero`).

---

## 4. Motion & Animation Tokens

### Durations
- **Micro-interactions (button press, icon hover)**: `150ms`
- **Dropdowns, popovers, badges**: `200ms`
- **Modal dialogs, slide-in drawers**: `300ms`
- **Page transitions & hero reveals**: `500ms`
- **Marquee ticker loop**: `30s` linear continuous

### Easing Curves
- **Standard UI Ease**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out)
- **Spring Press Scale**: `transform: scale(0.97)` on active press (150ms)
- **Magnetic Drag Cursor**: `75ms` linear tracking `translate(-50%, -50%)`
- **3D PC Auto-Rotation**: `0.005 radians / frame` with drag-to-orbit physics

### Stagger Values
- **Spec chips**: `50ms` stagger delay
- **Category bento grid**: `75ms` stagger delay
- **Four Ways In cards**: `100ms` stagger delay

---

## 5. Three-Layer Specification Pattern
Every single prebuilt PC and hardware component follows this three-layer structure:
1. **Layer 1 (Attention-Grabbing)**: 3 to 4 plain-language chips with icons (e.g. *Plays 4K games smoothly*, *Quiet under load*), star rating, price, and colored ETA badge.
2. **Layer 2 (Quick Specs)**: 4 to 8 metric cards highlighting key figures (cores/threads, clocks, VRAM, capacity, speed, wattage).
3. **Layer 3 (Full Specifications Accordion)**: Expandable Amazon-style tabular specs with two toggles:
   - **Explain in simple words**: Injects plain-English explanations next to each engineering metric.
   - **Nerd mode**: Unlocks raw silicon die size, transistor counts, boost timings, VRM power stages, and benchmark figures.

---

## 6. Strict Delivery ETA Logic
- Only 3 delivery tiers exist:
  - **4 Days (Green)**: Component in own cleanroom warehouse.
  - **6 Days (Amber)**: Regional priority or factory prebuilt standard assembly.
  - **10 Days (Blue)**: Custom configurator rig (includes 48h thermal burn-in stress test).
- Never displays more than 10 days.
- Displays calendar date (e.g., `Arrives by Mon, 2 Nov`) plus countdown (`Order within 3h 12m for this date`).
- Split shipment option allows in-stock components to ship in 4 days while custom rig undergoes stress testing.
