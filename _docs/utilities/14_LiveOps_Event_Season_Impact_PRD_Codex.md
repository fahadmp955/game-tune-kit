# GameTuneKit — LiveOps Event & Season Impact Forecaster

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/liveops-forecaster/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **Is my proposed LiveOps cadence likely to create sustainable incremental value, or does the schedule become dominated by fatigue and sink saturation?**

---

# Part B — GameTuneKit PRD

## 1. Product

**LiveOps Event & Season Impact Forecaster**

**Utility ID:** `UTIL-019`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

Is my proposed LiveOps cadence likely to create sustainable incremental value, or does the schedule become dominated by fatigue and sink saturation?

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
| Base active audience (DAU) | integer | 100,000 | >= 0 |
| Baseline ARPDAU | currency | 0.10 | >= 0 |
| Event interval | days | 7 | >= 1 |
| Event revenue lift intensity | multiplier | 1.5 | >= 1 |
| User fatigue rate/event | % | 5 | 0–100 |
| Battle Pass cycle length | days | 30 | >= 1 |
| Economy content depth | currency/user | 20 | >= 0 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

Run a 90-day daily simulation.

BaselineDailyRevenue = DAU × BaselineARPDAU

Event occurs on days where (day-1) mod EventInterval = 0.

EventCountBeforeDay = number of prior events.
FatigueMultiplier = (1 - FatigueRate)^EventCountBeforeDay
EffectiveEventLift = 1 + (EventLiftIntensity - 1) × FatigueMultiplier

Battle Pass U-curve:
phase = ((day-1) mod BPCycleLength) / max(1, BPCycleLength-1)
BPLiftShape = 4 × (phase - 0.5)^2
This is 1 near cycle boundaries and 0 near midpoint.
GameTune V1 BP lift amplitude = 0.10 and must be a centralized assumption.
BPRevenueMultiplier = 1 + 0.10 × BPLiftShape

DailyPotentialRevenue =
BaselineDailyRevenue × EventMultiplier × BPRevenueMultiplier

Economy saturation is tracked per user.
IncrementalSpendPerUser =
max(0, DailyPotentialRevenue - BaselineDailyRevenue) / max(1, DAU)

SaturationBalance += IncrementalSpendPerUser
SaturationBalance *= (1 - DailySaturationDecay)

GameTune V1 DailySaturationDecay = 0.02, centralized/configurable.

SaturationRatio =
SaturationBalance / EconomyContentDepth, safely handled when depth=0.

When SaturationRatio > 1:
cap incremental monetisation yield by:
SaturationYield = 1 / SaturationRatio
Apply this only to incremental revenue above baseline.

DailyRevenue =
BaselineDailyRevenue +
(DailyPotentialRevenue - BaselineDailyRevenue) × min(1,SaturationYield)

EndFatigue = 1 - (1-FatigueRate)^NumberOfEvents
PeakSaturation = max daily SaturationRatio.

Also evaluate comparison cadences from 3 to 30 days and return the interval with highest
90-day simulated revenue under identical assumptions as "Modelled Best Cadence".

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Projected 90-day revenue
- End-of-cycle fatigue
- Peak sink saturation
- Current cadence revenue
- Modelled best cadence
- Revenue difference
- Number of events
- Daily revenue/saturation series

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- 90-day daily revenue + saturation
- Fatigue across events
- Cadence comparison 3–30 days
- Battle Pass cycle overlay

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

1. Scenario simulation, not forecast
2. DAU held constant
3. Baseline ARPDAU held constant
4. Fatigue compounds per event
5. Battle Pass U-shape and saturation decay use explicit GameTune V1 assumptions
6. Content depth is a monetisation-capacity proxy

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

- No event lift (1.0x) => events add no event revenue
- 0% fatigue => event lift does not decay from fatigue
- Higher event count with positive fatigue increases end fatigue
- 90-day output contains exactly 90 daily points
- Cadence search evaluates every integer 3–30
- Zero DAU => zero revenue without divide-by-zero

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit LiveOps Event & Season Impact Forecaster

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

Is my proposed LiveOps cadence likely to create sustainable incremental value, or does the schedule become dominated by fatigue and sink saturation?

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

- Base active audience (DAU): integer, default 100,000, validation >= 0
- Baseline ARPDAU: currency, default 0.10, validation >= 0
- Event interval: days, default 7, validation >= 1
- Event revenue lift intensity: multiplier, default 1.5, validation >= 1
- User fatigue rate/event: %, default 5, validation 0–100
- Battle Pass cycle length: days, default 30, validation >= 1
- Economy content depth: currency/user, default 20, validation >= 0

## EXACT MODEL

Run a 90-day daily simulation.

BaselineDailyRevenue = DAU × BaselineARPDAU

Event occurs on days where (day-1) mod EventInterval = 0.

EventCountBeforeDay = number of prior events.
FatigueMultiplier = (1 - FatigueRate)^EventCountBeforeDay
EffectiveEventLift = 1 + (EventLiftIntensity - 1) × FatigueMultiplier

Battle Pass U-curve:
phase = ((day-1) mod BPCycleLength) / max(1, BPCycleLength-1)
BPLiftShape = 4 × (phase - 0.5)^2
This is 1 near cycle boundaries and 0 near midpoint.
GameTune V1 BP lift amplitude = 0.10 and must be a centralized assumption.
BPRevenueMultiplier = 1 + 0.10 × BPLiftShape

DailyPotentialRevenue =
BaselineDailyRevenue × EventMultiplier × BPRevenueMultiplier

Economy saturation is tracked per user.
IncrementalSpendPerUser =
max(0, DailyPotentialRevenue - BaselineDailyRevenue) / max(1, DAU)

SaturationBalance += IncrementalSpendPerUser
SaturationBalance *= (1 - DailySaturationDecay)

GameTune V1 DailySaturationDecay = 0.02, centralized/configurable.

SaturationRatio =
SaturationBalance / EconomyContentDepth, safely handled when depth=0.

When SaturationRatio > 1:
cap incremental monetisation yield by:
SaturationYield = 1 / SaturationRatio
Apply this only to incremental revenue above baseline.

DailyRevenue =
BaselineDailyRevenue +
(DailyPotentialRevenue - BaselineDailyRevenue) × min(1,SaturationYield)

EndFatigue = 1 - (1-FatigueRate)^NumberOfEvents
PeakSaturation = max daily SaturationRatio.

Also evaluate comparison cadences from 3 to 30 days and return the interval with highest
90-day simulated revenue under identical assumptions as "Modelled Best Cadence".

## REQUIRED OUTPUTS

- Projected 90-day revenue
- End-of-cycle fatigue
- Peak sink saturation
- Current cadence revenue
- Modelled best cadence
- Revenue difference
- Number of events
- Daily revenue/saturation series

## REQUIRED CHARTS

- 90-day daily revenue + saturation
- Fatigue across events
- Cadence comparison 3–30 days
- Battle Pass cycle overlay

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Scenario simulation, not forecast
2. DAU held constant
3. Baseline ARPDAU held constant
4. Fatigue compounds per event
5. Battle Pass U-shape and saturation decay use explicit GameTune V1 assumptions
6. Content depth is a monetisation-capacity proxy

## TESTS

Write unit tests covering:

- No event lift (1.0x) => events add no event revenue
- 0% fatigue => event lift does not decay from fatigue
- Higher event count with positive fatigue increases end fatigue
- 90-day output contains exactly 90 daily points
- Cadence search evaluates every integer 3–30
- Zero DAU => zero revenue without divide-by-zero

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
