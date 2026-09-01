# 📈 Current Project Status — GameTuneKit

## 📊 Phase Summary

| Phase | Status | Target Date | Notes |
| :--- | :--- | :--- | :--- |
| **Phase 0: Discovery & Documentation Scaffolding** | Completed | 2026-09-01 | Specifications, architecture blueprints, and 37 PRDs scaffolded |
| **Phase 1: Core SPA Setup & 6-Utility Release** | Completed | 2026-09-01 | Vite + React + TS + Tailwind SPA built under `frontend/` with 0 vulnerabilities |
| **Phase 2: Extended Calculator Expansion** | Planned | TBD | Adding PPP Price (#08), IAP Pack Value (#09), Currency Exchange (#10), XP Curve (#17) |
| **Phase 3: Game-Aware (L1) Local Workspaces** | Planned | TBD | Save game-wide presets, SKU catalogues, and segment profiles |

---

## ⚙️ Implemented State & Features

- **Frontend Core Architecture (`frontend/`):**
  - **Framework:** Vite 6 + React 18 + TypeScript (Strict Mode) + Tailwind CSS.
  - **Theme System:** `ThemeContext` with auto-detected system preference (`prefers-color-scheme`), defaulting to Dark mode, persisted via `localStorage` (`gametune_theme`).
  - **Dependencies Audit:** **0 vulnerabilities** (`npm audit` verified).
  - **Build Verification:** `npm run build` compiles with **0 errors**.

- **6 Core Utilities Implemented (Option A Complete):**
  1. 🟢 **Cohort LTV & Retention Simulator (`UTIL-01`):** Power-law retention decay curve fitting \(R(t)=a t^{-b}\), active lifespan calculation, and cumulative LTV trajectory charts.
  2. 🔵 **ROAS & UA Payback Calculator (`UTIL-02`):** Multi-horizon payback tracking (D7, D30, D90, D180), organic spillage multiplier, and break-even CPI ceiling.
  3. 🔷 **DAU / MAU Stickiness & Churn (`UTIL-32`):** DAU/MAU & WAU/MAU ratios, engagement classification tiers, and 30-day active user decay modeling.
  4. 🟣 **Loot & Drop-Rate Probability Simulator (`UTIL-14`):** Binomial drop rate calculations, 50%/80%/90%/99% confidence thresholds, and cumulative CDF distribution curves.
  5. 🟡 **Offer & Bundle Discount Calculator (`UTIL-36`):** Multi-item anchor value breakdown, effective discount %, value multipliers (e.g. 3.5x Value), and package positioning ratings.
  6. ⚡ **A/B Test Sample Size & Duration (`UTIL-27`):** Two-sample proportion sample size math, MDE uplift projections, and runtime feasibility indicators.

- **URL State Compression & Presets:**
  - **1-Click Share Button:** Encodes utility input state into Base64 query parameter (`?state=...`), automatically copies to clipboard, and displays animated Toast feedback.
  - **Preset Manager:** Save and load custom named configurations into browser `localStorage`.
