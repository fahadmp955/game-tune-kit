# GameTuneKit — Ad Revenue & Yield Optimizer

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/ad-yield-optimizer/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **What ad revenue should my current audience/format/geo mix produce, how much may be lost to mediation leakage, and what is the directional upside of better capture?**

---

# Part B — GameTuneKit PRD

## 1. Product

**Ad Revenue & Yield Optimizer**

**Utility ID:** `UTIL-024`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

What ad revenue should my current audience/format/geo mix produce, how much may be lost to mediation leakage, and what is the directional upside of better capture?

The calculator must expose assumptions and formulas rather than present scenario outputs as empirical truth.

## 3. Primary users

- Product managers
- Monetisation / economy designers
- UA / growth leads where relevant
- Game producers
- Studio founders
- LiveOps operators where relevant

## 4. Inputs

| Input | Type | Default | Validation |
|---|---|---:|---|
| DAU | integer | 100,000 | >= 0 |
| Average session length | minutes | 15 | >= 0 |
| Tier 1 traffic | % | 40 | 0–100 |
| Tier 2 traffic | % | 35 | 0–100 |
| Tier 3 traffic | % | 25 | 0–100 |
| Rewarded impressions/user/day | number | 1 | >= 0 |
| Rewarded Tier-1 eCPM | currency | 20 | >= 0 |
| Interstitial impressions/user/day | number | 2 | >= 0 |
| Interstitial Tier-1 eCPM | currency | 10 | >= 0 |
| Banner enabled | toggle | On | — |
| Banner Tier-1 eCPM | currency | 2 | >= 0 |
| Mediation configuration | select | Manual waterfall | Manual / Hybrid / Unified |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

Geo shares must sum to 100%.

GameTune V1 geo eCPM multipliers are explicit scenario assumptions:
Tier1 = 1.0
Tier2 = 0.55
Tier3 = 0.25

For each format:
BlendedECPM = T1Share×T1eCPM + T2Share×T1eCPM×0.55 + T3Share×T1eCPM×0.25

Banner impressions/user/day:
if enabled, ActiveSeconds = SessionMinutes × 60
BannerImpressions = ActiveSeconds / 30
This mirrors the reference's standard 30-second refresh concept.

GrossDailyRevenue =
DAU × Σ(ImpressionsPerUserFormat × BlendedECPMFormat / 1000)

Leakage assumptions:
Manual = 18%
Hybrid = 6%
Unified = 2%

CapturedDailyRevenue = GrossDailyRevenue × (1-Leakage)
MonthlyRevenue = CapturedDailyRevenue × 30
MonthlyLeakage = GrossDailyRevenue × Leakage × 30
AdARPDAU = CapturedDailyRevenue / DAU

Optimized scenario = Unified leakage 2%.
NetLift = OptimizedMonthlyRevenue - CurrentMonthlyRevenue.

Keep leakage decomposition configurable; do not present the reference's 8/7/3 split as universal fact.

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Estimated monthly ad revenue
- Gross demand value
- Monthly yield leakage
- Ad ARPDAU
- Mediation efficiency
- Current vs unified-bidding scenario lift
- Blended eCPM by format

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Captured vs leaked revenue waterfall
- Revenue by ad format
- Current vs optimized mediation capture

Charts must expose entered/current state and scenario/model state distinctly. Tooltips should show exact values.

## 8. What-If / sensitivity

Provide a scenario section for the 2–4 inputs with the largest effect on the result.

Rules:

- baseline inputs are never mutated;
- scenario controls default to zero change;
- show baseline result, scenario result, absolute delta, and percentage delta;
- recompute using the exact same core calculation functions;
- when the result depends strongly on assumptions, say so explicitly.

## 9. Formula transparency

Add a collapsible **How is this calculated?** section.

It must:

- show the actual formulas used;
- substitute the user's current values where practical;
- distinguish observed inputs from GameTune modelling assumptions;
- avoid black-box grades whose thresholds are not documented.

## 10. Model assumptions

1. Geo multipliers are GameTune defaults
2. eCPM held constant by geo tier multiplier
3. 30-second banner refresh when enabled
4. No user-level frequency cap/churn modelling
5. Mediation leakage rates are scenario assumptions

## 11. Sharing

Provide:

### Copy Link

Serialize all calculator state to URL query parameters. Opening the URL in a clean browser must reproduce the same inputs and outputs.

### Copy Results

Generate a plain-text summary containing:

- calculator name;
- important inputs;
- primary outputs;
- scenario assumptions;
- a short "scenario model, not forecast" note where appropriate.

## 12. Account behaviour

No account is required.

Future connected GameTuneKit versions may populate inputs from the shared Game model, save scenarios, attach them to a Game/Segment/Market/Experiment, and compare historical versions. None of that belongs in L0 V1.

## 13. Responsive design

### Desktop

Use a two-column calculator workspace:

- left: inputs and assumptions;
- right: dominant result, supporting metrics, primary chart;
- below: secondary charts, sensitivity, formulas, assumptions.

### Mobile

Stack:

1. Intro
2. Inputs
3. Primary result
4. Supporting metrics
5. Primary chart
6. Secondary analysis
7. What-If
8. Formula
9. Assumptions

Do not hide core functionality on mobile.

## 14. Accessibility

- Every input has a visible label.
- Do not communicate state using colour alone.
- Charts require accessible text summaries.
- Keyboard navigation must work.
- Validation messages must be associated with fields.
- Use locale-aware number formatting.

## 15. Non-goals

V1 does not:

- ingest production telemetry;
- require authentication;
- save to a backend;
- use AI;
- claim proprietary benchmark data;
- conceal modelling assumptions;
- make causal claims that the inputs cannot support.

## 16. Acceptance tests

- Geo shares not totaling 100% fail validation
- DAU 0 => revenue 0 without division error
- 100k DAU × 1 imp × $10 eCPM => $1,000 gross/day before leakage
- 18% leakage => 82% capture
- Unified 2% leakage must capture >= Manual at same gross demand

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Ad Revenue & Yield Optimizer

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

What ad revenue should my current audience/format/geo mix produce, how much may be lost to mediation leakage, and what is the directional upside of better capture?

## IMPLEMENTATION REQUIREMENTS

1. Inspect the repository first.
2. Identify the existing framework, routing, component system, chart library, state conventions, test framework, number-formatting utilities and GameTuneKit visual patterns.
3. Reuse existing infrastructure.
4. Keep all calculation logic separate from UI components.
5. Implement calculations as pure, deterministic, unit-testable functions.
6. Do not round intermediate values.
7. Validate all inputs exactly as specified in the PRD.
8. Distinguish observed/user inputs from modelling assumptions.
9. Implement the PRD's outputs and charts.
10. Implement What-If/sensitivity without mutating baseline state.
11. Implement Copy Link using URL state.
12. Implement Copy Results as plain text.
13. Make the page responsive and keyboard accessible.
14. Do not add backend infrastructure unless the existing application architecture absolutely requires a route wrapper.
15. Do not add a large dependency when the repository already has an adequate equivalent.

## INPUTS

- DAU: integer, default 100,000, validation >= 0
- Average session length: minutes, default 15, validation >= 0
- Tier 1 traffic: %, default 40, validation 0–100
- Tier 2 traffic: %, default 35, validation 0–100
- Tier 3 traffic: %, default 25, validation 0–100
- Rewarded impressions/user/day: number, default 1, validation >= 0
- Rewarded Tier-1 eCPM: currency, default 20, validation >= 0
- Interstitial impressions/user/day: number, default 2, validation >= 0
- Interstitial Tier-1 eCPM: currency, default 10, validation >= 0
- Banner enabled: toggle, default On, validation —
- Banner Tier-1 eCPM: currency, default 2, validation >= 0
- Mediation configuration: select, default Manual waterfall, validation Manual / Hybrid / Unified

## EXACT MODEL

Geo shares must sum to 100%.

GameTune V1 geo eCPM multipliers are explicit scenario assumptions:
Tier1 = 1.0
Tier2 = 0.55
Tier3 = 0.25

For each format:
BlendedECPM = T1Share×T1eCPM + T2Share×T1eCPM×0.55 + T3Share×T1eCPM×0.25

Banner impressions/user/day:
if enabled, ActiveSeconds = SessionMinutes × 60
BannerImpressions = ActiveSeconds / 30
This mirrors the reference's standard 30-second refresh concept.

GrossDailyRevenue =
DAU × Σ(ImpressionsPerUserFormat × BlendedECPMFormat / 1000)

Leakage assumptions:
Manual = 18%
Hybrid = 6%
Unified = 2%

CapturedDailyRevenue = GrossDailyRevenue × (1-Leakage)
MonthlyRevenue = CapturedDailyRevenue × 30
MonthlyLeakage = GrossDailyRevenue × Leakage × 30
AdARPDAU = CapturedDailyRevenue / DAU

Optimized scenario = Unified leakage 2%.
NetLift = OptimizedMonthlyRevenue - CurrentMonthlyRevenue.

Keep leakage decomposition configurable; do not present the reference's 8/7/3 split as universal fact.

## REQUIRED OUTPUTS

- Estimated monthly ad revenue
- Gross demand value
- Monthly yield leakage
- Ad ARPDAU
- Mediation efficiency
- Current vs unified-bidding scenario lift
- Blended eCPM by format

## REQUIRED CHARTS

- Captured vs leaked revenue waterfall
- Revenue by ad format
- Current vs optimized mediation capture

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Geo multipliers are GameTune defaults
2. eCPM held constant by geo tier multiplier
3. 30-second banner refresh when enabled
4. No user-level frequency cap/churn modelling
5. Mediation leakage rates are scenario assumptions

## TESTS

Write unit tests covering:

- Geo shares not totaling 100% fail validation
- DAU 0 => revenue 0 without division error
- 100k DAU × 1 imp × $10 eCPM => $1,000 gross/day before leakage
- 18% leakage => 82% capture
- Unified 2% leakage must capture >= Manual at same gross demand

Also test:

- URL serialization/deserialization;
- invalid inputs;
- zero-safe arithmetic;
- 0% What-If scenario equality;
- deterministic repeatability.

## DEFINITION OF DONE

The utility is complete when:

- all specified inputs validate;
- formulas are implemented exactly as documented;
- primary and secondary outputs are correct;
- required charts render;
- scenario controls work;
- formulas and assumptions are visible;
- Copy Link reproduces state;
- Copy Results works;
- mobile and desktop layouts work;
- accessibility basics are satisfied;
- no account/backend/AI dependency has been introduced;
- unit tests pass;
- repository lint/typecheck/build tests pass.

Do not replace project infrastructure merely because you prefer another library.
```

---

## Product Direction Note

This specification deliberately separates **reference inspiration** from **GameTuneKit's implementation contract**. Where the public reference does not expose an exact coefficient or benchmark dataset, the GameTune model either avoids the unsupported feature or defines an explicit, editable GameTune assumption instead of pretending to know the reference's hidden implementation.
