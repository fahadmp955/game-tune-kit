# Implementation Plan — GameTuneKit Core Utilities Suite (Phase 1)

This plan outlines the architecture, tech stack setup, custom design system, calculation engines, state persistence model, and component hierarchy for **GameTuneKit** — starting with Option A (UI Shell + 6 Core Calculators across all Product Families).

---

## 🎨 Design Identity & Responsive System (Distinct & Modern Theme Engine)

GameTuneKit features its own distinct visual identity (rather than a replica of TGS):

1. **Dual Themes with System Preference Auto-Detection:**
   - **Dark Mode (Default):** Deep space midnight `#0b0f19` background, `#131b2e` surface cards, slate-800 borders, neon glowing accents (Cyan, Emerald, Violet, Gold), subtle backdrop blur (`backdrop-blur-md`).
   - **Light Mode:** Crisp, studio-grade white `#f8fafc` background, `#ffffff` card surfaces, slate-200 borders, rich vibrant sapphire `#2563eb`, emerald `#059669`, and violet `#7c3aed` accents with subtle drop shadows.
   - Smooth CSS transitions across theme toggles without layout shifts.
2. **Fully Responsive Adaptive Layouts:**
   - **Mobile (< 768px):** Collapsible top navigation / drawer, stacked single-column input & metric cards, full-width touch-friendly sliders and tap targets.
   - **Tablet (768px - 1024px):** 2-column stacked layout with sticky calculation summary headers.
   - **Desktop & Widescreen (> 1024px - 1440px+):** Fluid 2-column workspace layout with left control panel and right visualization grid.
3. **Clipboard Share Modal & Toast Feedback:**
   - Explicit **"Share Utility / Copy Link"** button in every utility header.
   - Compresses the current utility inputs into a URL search query string parameter (`?state=...`).
   - Automatically copies the URL to the clipboard and triggers a animated Toast Notification ("Link copied to clipboard!").

---

## 🏛️ Selected Initial Calculator Suite (All Specs Verified in `_docs/utilities/`)

All 6 PRDs are fully detailed with zero ambiguity in `_docs/utilities/`:

| # | Calculator Name | Family | Key Inputs | Primary Outputs & Visualizations |
|---|---|---|---|---|
| **01** | **Cohort LTV & Retention Simulator** | Monetisation & Pricing | D1, D7, D30 retention %, Daily ARPU, Horizon (30/90/180/365d) | Power-law decay curve \(R(t)=a t^{-b}\), cumulative LTV curve, Day 365 survival, active lifespan |
| **02** | **ROAS & UA Payback Calculator** | Growth & UA | Ad spend, paid installs, revenue by horizon, organic multiplier | Payback period (days), ROAS % over horizon, break-even CPI ceiling, ROAS timeline chart |
| **32** | **DAU / MAU Stickiness & Churn Calculator** | Intelligence & Metrics | DAU, WAU, MAU, D1 Churn % | DAU/MAU stickiness %, WAU/MAU ratio, engagement rating badge, active user retention decay |
| **14** | **Loot & Drop-Rate Probability Simulator** | Economy & Simulation | Base drop rate %, target drops, pull cost ($/gems), confidence threshold | Binomial probability distribution, cumulative CDF chart, expected pulls & total expected cost |
| **36** | **Offer & Bundle Discount Calculator** | LiveOps | Base item prices, bonus %, offer price, purchase cap | Effective discount %, value multiplier (e.g. "3.5x Value"), anchor value comparison bar |
| **27** | **A/B Test Sample Size Calculator** | Data & Experimentation | Baseline conversion %, Minimum Detectable Effect (MDE %), \(\alpha=5\%\), Power \(80\%\), Daily traffic | Required sample size per variant, total required users, test runtime (days), traffic feasibility |

---

## 🛠️ Proposed Component Architecture & Files

### Component 1: Core Setup & Dependency Audit (0 Vulnerabilities)
- Initialize Vite + React + TypeScript in project root (`./`).
- Install audited, secure dependencies (`lucide-react`, `recharts`, `clsx`, `tailwind-merge`).
- Enforce strict `npm audit` check guaranteeing **0 vulnerabilities**.

#### [NEW] [package.json](file:///Users/fahadchougle/Work/game-tune-kit/package.json)
#### [NEW] [vite.config.ts](file:///Users/fahadchougle/Work/game-tune-kit/vite.config.ts)
#### [NEW] [index.html](file:///Users/fahadchougle/Work/game-tune-kit/index.html)
#### [NEW] [src/index.css](file:///Users/fahadchougle/Work/game-tune-kit/src/index.css)

---

### Component 2: Reusable UI Component System

#### [NEW] [src/components/common/Header.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/Header.tsx)
- Top navbar with brand logo, family navigation tabs, theme switch button, and saved presets manager trigger.

#### [NEW] [src/components/common/KpiCard.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/KpiCard.tsx)
- Generic KPI summary card supporting status badges, subtext, metric tooltips, and dynamic color indicators.

#### [NEW] [src/components/common/SliderInput.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/SliderInput.tsx)
- Reusable numerical input field coupled with interactive range slider, min/max bounds, and unit label.

#### [NEW] [src/components/common/ShareModal.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/ShareModal.tsx)
- Modal and standalone button providing 1-click clipboard URL copying with toast feedback.

#### [NEW] [src/components/common/Toast.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/Toast.tsx)
- Non-blocking notification banner for share links and preset notifications.

---

### Component 3: Pure Math Calculation Engines (Decoupled Logic)

- `src/engine/ltvCalculator.ts` — Power-law retention fitting & cumulative LTV.
- `src/engine/roasCalculator.ts` — ROAS, payback period, & break-even CPI.
- `src/engine/stickinessCalculator.ts` — DAU/MAU ratios & churn models.
- `src/engine/lootCalculator.ts` — Binomial drop rates & cumulative CDF.
- `src/engine/offerCalculator.ts` — Bundle anchor valuation & multiplier calculation.
- `src/engine/abTestCalculator.ts` — Statistical sample size & runtime estimation.

---

### Component 4: State Persistence & URL Compression

#### [NEW] [src/utils/stateSerializer.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/utils/stateSerializer.ts)
- Compressed Base64/JSON encoding for state sharing via URL search params.
- `localStorage` manager for saving/loading user game presets (`gametune_presets_v1`).

---

### Component 5: Views & Responsive Pages

#### [NEW] [src/pages/CatalogPage.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/pages/CatalogPage.tsx)
- Distinct GameTuneKit utility catalog dashboard, responsive grid view, search filter, and family tags.

#### [NEW] [src/pages/UtilityPage.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/pages/UtilityPage.tsx)
- Master responsive container rendering 2-column input/result layout on desktop and single-column on mobile.

#### [NEW] [src/components/utilities/LtvCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/LtvCalculatorView.tsx)
#### [NEW] [src/components/utilities/RoasCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/RoasCalculatorView.tsx)
#### [NEW] [src/components/utilities/StickinessCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/StickinessCalculatorView.tsx)
#### [NEW] [src/components/utilities/LootCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/LootCalculatorView.tsx)
#### [NEW] [src/components/utilities/OfferCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/OfferCalculatorView.tsx)
#### [NEW] [src/components/utilities/AbTestCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/AbTestCalculatorView.tsx)

---

## 🧪 Verification Plan

### Automated Tests & Checks
- TypeScript & Vite build: `npm run build` MUST pass cleanly with 0 type errors.
- Dependency audit: Run `npm audit` to guarantee **0 vulnerabilities**.
- Engine unit tests: Execute unit test assertions on core calculation functions.

### Manual Verification
- Test Theme Switcher: Switch between Dark and Light mode across mobile and desktop breakpoints to ensure zero contrast or visual issues.
- Test Share Button: Click "Copy Share Link", verify toast appears, paste into new browser tab, and verify inputs & charts mirror the original state.
- Test Preset Saving: Save a custom named preset to `localStorage` and verify reloading restores state.
