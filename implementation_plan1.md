# Implementation Plan — GameTuneKit Core Utilities Suite (Phase 1)

This plan outlines the architecture, tech stack setup, design system, calculation engine, state persistence model, and component layout for **GameTuneKit** — starting with Option A (UI Shell + 6 Core Calculators, one per Product Family).

---

## 🎨 UI & Layout Reference (Inspired by TGS Screenshots)

Based on the provided TGS reference screenshots:
1. **Catalog View (All Tools):** Filterable grid with category tabs (`ALL UTILITIES`, `MONETISATION`, `GROWTH & UA`, `INTELLIGENCE`, `ECONOMY`, `LIVEOPS`, `EXPERIMENTATION`), badge tags, search box, concise titles, descriptions, and "OPEN UTILITY →" action triggers.
2. **Utility Workspace Layout (2-Column Responsive):**
   - **Left Column (Inputs Panel):** Clean control panel with "AUTOFILL GENRE BENCHMARKS" dropdown, numbered input fields, interactive sliders, and numerical input boxes.
   - **Right Column (Results & Visualizations):**
     - Top Summary KPI cards (e.g. Rating, Total Value, Key Metrics with color-coded status badges).
     - Interactive Data Visualizations (Recharts Line curves, Stacked Bar breakdowns, Probability CDF charts).
     - Explanatory strategy card grid ("The architecture of spend / retention capacity").
     - Share/Action bar ("COPY SHAREABLE LINK", "SAVE PRESET TO LOCALSTORAGE", "EXPORT CSV").
     - FAQ Accordion section ("Common questions & formulas").

---

## 🏛️ Proposed Architecture & 6 Initial Calculators

### 1. Selected Initial Calculator Suite (1 Per Family)

| # | Calculator Name | Family | Key Inputs | Outputs & Visualizations |
|---|---|---|---|---|
| **01** | **Cohort LTV & Retention Simulator** | Monetisation & Pricing | D1, D7, D30 retention %, Daily ARPU, Horizon (30/90/180/365d) | Power-law decay curve \(R(t)=a t^{-b}\), cumulative LTV curve, Day 365 survival, active lifespan |
| **02** | **ROAS & UA Payback Calculator** | Growth & UA | Acquisition spend, installs, target CPI, projected D30/D90/D180 LTV | Payback period (days), ROAS % over horizon, break-even CPI ceiling, profitability badge |
| **32** | **DAU / MAU Stickiness & Churn Calculator** | Intelligence & Metrics | Daily Active Users (DAU), Monthly Active Users (MAU), Weekly Active Users (WAU), D1 Churn % | DAU/MAU stickiness %, WAU/MAU ratio, engagement rating badge, active player decay curve |
| **14** | **Loot & Drop-Rate Probability Simulator** | Economy & Simulation | Base drop rate %, target drops required, pull cost ($ or gems), confidence threshold (50/80/90/95/99%) | Binomial probability distribution, cumulative CDF chart, expected pulls & total expected cost |
| **36** | **Offer & Bundle Discount Calculator** | LiveOps | Base item prices, currency quantity, bonus %, offer package price, purchase cap | Effective discount %, value multiplier (e.g., "3.5x Value"), anchor value comparison bar |
| **27** | **A/B Test Sample Size & Duration Calculator** | Data & Experimentation | Baseline conversion/metric %, Minimum Detectable Effect (MDE %), Significance \(\alpha=5\%\), Power \(1-\beta=80\%\), Daily traffic | Required sample size per variant, total required users, test runtime (days), traffic feasibility |

---

## 🛠️ Proposed Changes

### Component 1: Core Project Setup & Dependencies
- Scaffold Vite + React + TypeScript app in workspace root (`./`).
- Install Tailwind CSS + `@tailwindcss/vite`, `lucide-react`, `recharts`, `clsx`, `tailwind-merge`.
- Set up strict TypeScript configuration (`tsconfig.json`).

#### [NEW] [package.json](file:///Users/fahadchougle/Work/game-tune-kit/package.json)
#### [NEW] [vite.config.ts](file:///Users/fahadchougle/Work/game-tune-kit/vite.config.ts)
#### [NEW] [index.html](file:///Users/fahadchougle/Work/game-tune-kit/index.html)
#### [NEW] [src/index.css](file:///Users/fahadchougle/Work/game-tune-kit/src/index.css)

---

### Component 2: Design System & Theme Engine

#### [NEW] [src/context/ThemeContext.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/context/ThemeContext.tsx)
- Implements theme system checking `window.matchMedia('(prefers-color-scheme: dark)')`, defaulting to Dark Mode, with `localStorage` persistence.

#### [NEW] [src/components/common/Header.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/Header.tsx)
- Top navigation bar with GameTuneKit logo, breadcrumbs, search, theme toggle, and preset manager modal trigger.

#### [NEW] [src/components/common/KpiCard.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/common/KpiCard.tsx)
- Reusable TGS-style KPI summary cards with rating badges, micro-animations, and dynamic color indicators.

---

### Component 3: Pure Math Calculation Engines (Decoupled Logic)

#### [NEW] [src/engine/ltvCalculator.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/engine/ltvCalculator.ts)
- Logarithmic regression power-law curve fitting \(R(t) = a t^{-b}\), cumulative LTV integration, and daily point generation.

#### [NEW] [src/engine/roasCalculator.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/engine/roasCalculator.ts)
- Cohort spend payback calculation, break-even CPI ceiling, and margin analysis.

#### [NEW] [src/engine/stickinessCalculator.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/engine/stickinessCalculator.ts)
- DAU/MAU stickiness, WAU/MAU ratios, and churn decay projections.

#### [NEW] [src/engine/lootCalculator.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/engine/lootCalculator.ts)
- Binomial probability \(P(X \ge k)\), cumulative CDF distribution points, and expected attempt cost math.

#### [NEW] [src/engine/offerCalculator.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/engine/offerCalculator.ts)
- Multi-item bundle valuation, anchor pricing, effective discount percentage, and value multiplier.

#### [NEW] [src/engine/abTestCalculator.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/engine/abTestCalculator.ts)
- Two-sample proportion test sample size math:
  \[
  n = \frac{2 \cdot (Z_{\alpha/2} + Z_{\beta})^2 \cdot p (1 - p)}{\text{MDE}^2}
  \]

---

### Component 4: State Persistence & URL Compression

#### [NEW] [src/utils/stateSerializer.ts](file:///Users/fahadchougle/Work/game-tune-kit/src/utils/stateSerializer.ts)
- Serializes calculator state to URL search parameters (`?state=...`) using Base64/JSON encoding.
- Manages `localStorage` key (`gametune_saved_presets_v1`) for saving/loading user presets.

---

### Component 5: Views & Layout Pages

#### [NEW] [src/pages/CatalogPage.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/pages/CatalogPage.tsx)
- TGS-style grid listing all initial 6 core utilities + catalog placeholders for future set, filterable by family tabs.

#### [NEW] [src/pages/UtilityPage.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/pages/UtilityPage.tsx)
- Generic container rendering the 2-column input/result layout, URL sharing action bar, explanatory card grid, and FAQ accordions.

#### [NEW] [src/components/utilities/LtvCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/LtvCalculatorView.tsx)
#### [NEW] [src/components/utilities/RoasCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/RoasCalculatorView.tsx)
#### [NEW] [src/components/utilities/StickinessCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/StickinessCalculatorView.tsx)
#### [NEW] [src/components/utilities/LootCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/LootCalculatorView.tsx)
#### [NEW] [src/components/utilities/OfferCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/OfferCalculatorView.tsx)
#### [NEW] [src/components/utilities/AbTestCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/src/components/utilities/AbTestCalculatorView.tsx)

---

## 🧪 Verification Plan

### Automated Tests & Checks
- Build verification: `npm run build` (`tsc && vite build`) to guarantee 0 TypeScript compilation errors.
- Unit tests: Create pure unit test suites for `ltvCalculator.ts`, `lootCalculator.ts`, `offerCalculator.ts`, and `abTestCalculator.ts` verifying calculation accuracy against known benchmark values.
- Dependency audit: `npm audit` to guarantee zero dependency vulnerabilities.

### Manual Verification
- Test URL sharing: Change inputs in LTV calculator, click "COPY SHAREABLE LINK", open link in new tab, and verify all sliders, numbers, and charts populate identically.
- Test `localStorage` preset saving: Save a preset, reload page, restore preset from modal.
- Test Theme Switcher: Verify Dark/Light mode toggle smoothly transitions UI without layout shift.
