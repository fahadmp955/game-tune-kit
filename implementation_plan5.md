# Implementation Plan: Phase 7 — PNS $\longleftrightarrow$ Calculators Synchronization

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a bidirectional synchronization between the live Push Notification Service (PNS Layer 1/2) and the 36 Standalone Utilities (Layer 0), enabling live audience cohort ingestion into calculators and live campaign revenue/retention impact forecasting inside the PNS Composer without altering the offline, free nature of Layer 0.

**Architecture:** 
1. A shared `StudioContext` manages active game tenants, API keys, and fetched `segments` with indexed `cachedReach`.
2. A reusable `StudioCohortSelector` component allows calculators (e.g. LTV, Churn, Offer) to optionally bind to live studio cohorts.
3. An embedded `CampaignImpactSimulator` widget inside the PNS Campaign Composer uses client-side calculation engines (`ltvCalculator`, `offerCalculator`) to project push delivery revenue, open impressions, and retention lift before dispatching, with 1-click deep-links to full calculator views.

**Tech Stack:** React 18, TypeScript 5.6, Vite 6, Tailwind CSS, Lucide Icons, Vitest, React Testing Library.

**Spec:** `_docs/pns-overview.md` §10 ("PNS <-> Calculators Synchronization"), `_docs/utilities-catalog.md`, `_docs/TODO.md` Phase 7.

## Global Constraints
- **Zero Breaking Changes to Layer 0:** All 36 calculators must remain 100% functional offline with manual sliders, zero accounts required, and formula transparency.
- **Client-Side Independence:** If the backend or Supabase is unavailable or offline, calculators gracefully fall back to local genre presets with zero runtime errors.
- **Zero New Dependencies:** Use existing React context, Tailwind CSS, and Lucide icons; no new third-party packages.
- **TypeScript Strictness:** 0 `tsc` build errors, 0 lint warnings, 0 `npm audit` vulnerabilities.

---

## User Review Required

> [!IMPORTANT]
> **Additive Only:** Connecting a live PNS segment to a calculator populates its initial input values (such as cohort size, retention baseline, or ARPU), but the user can still adjust any slider at any time. A badge clearly indicates whether the calculator is running on a *Live Studio Segment* or *Manual / Offline Sandbox*.

---

## Proposed Changes

Grouped by component layer:

### Shared Studio State & Context Layer

#### [NEW] [StudioContext.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/context/StudioContext.tsx)
- Provides `StudioProvider` and `useStudio()` hook.
- Manages `games` list, `selectedGame`, `cohorts` (segments with `cachedReach` and rules), `isLoading`, and `selectGame(gameId)`.
- Eliminates duplicate backend queries between PNS Studio and individual calculators.

#### [MODIFY] [App.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/App.tsx)
- Wrap root tree in `<StudioProvider>` alongside `<ThemeProvider>`.

---

### PNS $\longrightarrow$ Calculators: Ingestion Component

#### [NEW] [StudioCohortSelector.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/components/common/StudioCohortSelector.tsx)
- Reusable dropdown widget to place on calculators.
- Displays game switcher and available cohorts (e.g., "Whales ($100+)", "Lapsed Players (7+ Days)").
- When a cohort is selected, triggers `onSelectCohort(cohort, assumptions)`.
- Displays status badge (`🟢 Connected to Studio: Cyber Clash 2088 • Whales ($100+) (2,450 reach)`).
- Provides a "Disconnect / Reset" button to return to manual sandbox mode.

#### [MODIFY] [LtvCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/components/utilities/LtvCalculatorView.tsx)
- Integrate `<StudioCohortSelector>` next to the "Autofill Genre Benchmarks" bar.
- Auto-maps cohort properties:
  - Whales $\longrightarrow$ High daily ARPU ($0.85), high D30 retention (12%), reach (2,450).
  - Lapsed $\longrightarrow$ Low daily ARPU ($0.04), decay inflection point, reach (6,890).
  - Minnows / Engaged $\longrightarrow$ Mid ARPU ($0.12), high D7 retention (22%), reach (14,200).
- Adds a "PNS Campaign Reach Projection" KPI card: computes Total Projected Cohort Revenue ($\text{Reach} \times \text{LTV}_{180}$).

#### [MODIFY] [OfferCalculatorView.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/components/utilities/OfferCalculatorView.tsx)
- Integrate `<StudioCohortSelector>` to evaluate pack discount value and total revenue against target segment reach.

---

### Utilities $\longrightarrow$ PNS: Campaign Impact Simulator

#### [NEW] [CampaignImpactSimulator.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/components/pns/CampaignImpactSimulator.tsx)
- Embedded card rendered directly inside the **Campaign Composer & Simulator** tab in `PnsDashboardPage.tsx`.
- Connects target segment's `estimatedReach`, deep-link screen target, and campaign parameters with live conversion math:
  - Estimated Open Impressions ($\text{Reach} \times \text{Open Rate}$)
  - Estimated Conversions ($\text{Opens} \times \text{Conversion Rate}$)
  - Projected Gross Campaign Revenue ($\text{Conversions} \times \text{Offer Price}$)
  - Retention / Churn Recovery Lift ($\Delta \text{D7}$)
- Provides 1-click navigation buttons:
  - `[Open in LTV Calculator ↗]` (encodes state into `?util=01-ltv-calculator&state=...`)
  - `[Open in Offer Calculator ↗]` (encodes state into `?util=36-offer-calculator&state=...`)

#### [MODIFY] [PnsDashboardPage.tsx](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/pages/PnsDashboardPage.tsx)
- Refactor to consume `useStudio()` hook (eliminating local duplicated game/cohort fetch boilerplate).
- Embed `<CampaignImpactSimulator>` directly beneath the Campaign Composer controls.

---

### Engine & Automated Test Suite

#### [NEW] [pnsCampaignSync.ts](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/pnsCampaignSync.ts)
- Pure calculation helper functions:
  - `calculateCampaignImpact(inputs: CampaignImpactInputs): CampaignImpactResults`
  - `mapCohortToLtvAssumptions(cohortName: string, reach: number): Partial<LtvInputs>`
- Clean mathematical models with zero DOM or network dependencies.

#### [NEW] [pnsCampaignSync.test.ts](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/__tests__/pnsCampaignSync.test.ts)
- Unit tests verifying:
  - Open impressions and conversion math with edge cases (reach = 0, 100% open rate, etc.).
  - Cohort to LTV parameter mappings across Whales, Lapsed, and Minnows.
  - State serialization for deep-linking into calculators.

---

## Bite-Sized Implementation Tasks

### Task 1: Mathematical Engine & Unit Tests for PNS Sync
**Files:**
- Create: `frontend/src/engine/pnsCampaignSync.ts`
- Create: `frontend/src/engine/__tests__/pnsCampaignSync.test.ts`

- [ ] **Step 1: Write the failing unit tests**
- [ ] **Step 2: Run test to verify it fails (`npm test`)**
- [ ] **Step 3: Implement `calculateCampaignImpact` and `mapCohortToLtvAssumptions`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Git commit**

### Task 2: Shared Studio Context (`StudioContext.tsx`)
**Files:**
- Create: `frontend/src/context/StudioContext.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `StudioContext` with multi-game and cohort caching**
- [ ] **Step 2: Wrap `App.tsx` with `<StudioProvider>`**
- [ ] **Step 3: Verify TypeScript builds cleanly (`npx tsc --noEmit`)**
- [ ] **Step 4: Git commit**

### Task 3: Studio Cohort Selector Component & LTV Calculator Sync
**Files:**
- Create: `frontend/src/components/common/StudioCohortSelector.tsx`
- Modify: `frontend/src/components/utilities/LtvCalculatorView.tsx`

- [ ] **Step 1: Build `StudioCohortSelector` with game/cohort dropdowns and connection badge**
- [ ] **Step 2: Integrate into `LtvCalculatorView.tsx` with "PNS Reach Revenue Projection"**
- [ ] **Step 3: Verify manual sliders still operate independently without regression**
- [ ] **Step 4: Git commit**

### Task 4: Campaign Impact & Revenue Simulator in PNS Studio
**Files:**
- Create: `frontend/src/components/pns/CampaignImpactSimulator.tsx`
- Modify: `frontend/src/pages/PnsDashboardPage.tsx`

- [ ] **Step 1: Build `CampaignImpactSimulator` card with open rate, conversion, and price sliders**
- [ ] **Step 2: Embed into `PnsDashboardPage.tsx` under Campaign Composer**
- [ ] **Step 3: Implement 1-click deep-links to LTV Calculator and Offer Calculator**
- [ ] **Step 4: Git commit**

### Task 5: End-to-End Verification & Documentation Update
**Files:**
- Modify: `_docs/current-status.md`
- Modify: `_docs/TODO.md`

- [ ] **Step 1: Run full unit test suite (`npm test` in frontend and backend)**
- [ ] **Step 2: Run production build verification (`npm run build`)**
- [ ] **Step 3: Update `current-status.md` and `TODO.md` marking Phase 7 complete**
- [ ] **Step 4: Final commit**

---

## Verification Plan

### Automated Tests
1. **Frontend Vitest Suites:**
   ```bash
   cd /Users/fahadchougle/Work/game-tune-kit/frontend && npm test
   ```
   *Expectation:* All test suites pass (including new `pnsCampaignSync.test.ts`).

2. **TypeScript Compilation:**
   ```bash
   cd /Users/fahadchougle/Work/game-tune-kit/frontend && npx tsc --noEmit
   ```
   *Expectation:* 0 errors.

3. **Vite Production Build:**
   ```bash
   cd /Users/fahadchougle/Work/game-tune-kit/frontend && npm run build
   ```
   *Expectation:* Build succeeds with 0 errors.

### Manual / Interactive Verification
1. **Live Cohort Ingestion in LTV Calculator:**
   - Navigate to `http://localhost:5173/?util=01-ltv-calculator`.
   - In the "Studio Cohort Sync" bar, switch between games and select `Whales & High VIPs ($100+)`.
   - Verify that reach (2,450) and spender ARPU ($0.85) populate, and the "Total Projected Cohort Revenue" card renders.
   - Adjust a slider manually and confirm connection badge updates to "Customized from Segment".
2. **Campaign Impact Simulator in PNS Studio:**
   - Navigate to `http://localhost:5173/?view=pns`.
   - In Campaign Composer, select `Whales & High VIPs ($100+)`.
   - Verify the Campaign Impact Simulator updates dynamically showing estimated impressions, conversions, and revenue.
   - Click "Open in LTV Calculator ↗" and confirm it navigates to the LTV calculator with matching state loaded from URL parameters.
