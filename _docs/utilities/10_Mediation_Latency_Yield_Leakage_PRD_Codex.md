# GameTuneKit — Mediation Latency & Yield Leakage Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/mediation-latency/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **How much ad inventory/revenue may be lost because a mediation cascade takes too long relative to the player's available session window?**

---

# Part B — GameTuneKit PRD

## 1. Product

**Mediation Latency & Yield Leakage Calculator**

**Utility ID:** `UTIL-025`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

How much ad inventory/revenue may be lost because a mediation cascade takes too long relative to the player's available session window?

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
| Tier-1 eCPM | currency | 10 | >= 0 |
| Impressions/user/day | number | 5 | >= 0 |
| Architecture | select | Manual | Manual / Hybrid / Unified |
| Trigger strategy | select | Lazy | Pre-cache / Lazy |
| Cascade depth | integer | 5 | 1–50 |
| Average network response latency | ms | 250 | >= 0 |
| Average session length | minutes | 10 | > 0 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

Architecture parallelism assumptions:
Manual = 1.0
Hybrid = 2.0
Unified = CascadeDepth

EffectiveCascadeLatencyMs =
CascadeDepth × AvgResponseLatencyMs / Parallelism

AvailableWindowMs:
Pre-cache = SessionMinutes × 60 × 1000
Lazy = SessionMinutes × 60 × 1000 × 0.25

LatencyFillProbability =
1 - exp(-AvailableWindowMs / max(1, EffectiveCascadeLatencyMs))

Floor dilution assumptions from reference framing:
Manual = 18%
Hybrid = 6%
Unified = 0%

EffectiveCapture = LatencyFillProbability × (1 - FloorDilution)

GrossDailyDemand = DAU × ImpressionsPerUser × eCPM / 1000
NetDailyRevenue = GrossDailyDemand × EffectiveCapture
DailyLeakage = GrossDailyDemand - NetDailyRevenue
MonthlyLeakage = DailyLeakage × 30
MonthlyNetRevenue = NetDailyRevenue × 30

All architecture constants must be centralized/configurable.

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Effective fill/capture
- Cascade latency
- Monthly net revenue
- Monthly leakage
- Latency loss vs floor dilution
- Architecture comparison

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Cascade latency vs available session window
- Gross vs captured vs leaked revenue
- Architecture comparison Manual/Hybrid/Unified

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

1. Simplified latency-to-fill exponential model
2. Response latencies treated as averages
3. No per-network bid distribution
4. Floor dilution constants are scenario assumptions
5. Engineering failures beyond latency are not separately modelled

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

- Depth 5 × 250ms manual => 1250ms effective cascade latency
- Unified parallelism depth => effective latency 250ms
- Pre-cache window > lazy window for same session
- Zero DAU => zero revenue
- Higher capture cannot increase leakage

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Mediation Latency & Yield Leakage Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

How much ad inventory/revenue may be lost because a mediation cascade takes too long relative to the player's available session window?

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
- Tier-1 eCPM: currency, default 10, validation >= 0
- Impressions/user/day: number, default 5, validation >= 0
- Architecture: select, default Manual, validation Manual / Hybrid / Unified
- Trigger strategy: select, default Lazy, validation Pre-cache / Lazy
- Cascade depth: integer, default 5, validation 1–50
- Average network response latency: ms, default 250, validation >= 0
- Average session length: minutes, default 10, validation > 0

## EXACT MODEL

Architecture parallelism assumptions:
Manual = 1.0
Hybrid = 2.0
Unified = CascadeDepth

EffectiveCascadeLatencyMs =
CascadeDepth × AvgResponseLatencyMs / Parallelism

AvailableWindowMs:
Pre-cache = SessionMinutes × 60 × 1000
Lazy = SessionMinutes × 60 × 1000 × 0.25

LatencyFillProbability =
1 - exp(-AvailableWindowMs / max(1, EffectiveCascadeLatencyMs))

Floor dilution assumptions from reference framing:
Manual = 18%
Hybrid = 6%
Unified = 0%

EffectiveCapture = LatencyFillProbability × (1 - FloorDilution)

GrossDailyDemand = DAU × ImpressionsPerUser × eCPM / 1000
NetDailyRevenue = GrossDailyDemand × EffectiveCapture
DailyLeakage = GrossDailyDemand - NetDailyRevenue
MonthlyLeakage = DailyLeakage × 30
MonthlyNetRevenue = NetDailyRevenue × 30

All architecture constants must be centralized/configurable.

## REQUIRED OUTPUTS

- Effective fill/capture
- Cascade latency
- Monthly net revenue
- Monthly leakage
- Latency loss vs floor dilution
- Architecture comparison

## REQUIRED CHARTS

- Cascade latency vs available session window
- Gross vs captured vs leaked revenue
- Architecture comparison Manual/Hybrid/Unified

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Simplified latency-to-fill exponential model
2. Response latencies treated as averages
3. No per-network bid distribution
4. Floor dilution constants are scenario assumptions
5. Engineering failures beyond latency are not separately modelled

## TESTS

Write unit tests covering:

- Depth 5 × 250ms manual => 1250ms effective cascade latency
- Unified parallelism depth => effective latency 250ms
- Pre-cache window > lazy window for same session
- Zero DAU => zero revenue
- Higher capture cannot increase leakage

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
