# GameTuneKit — UA Payback & Unit Economics Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/payback-grader/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **How long does it take an acquired user to earn back effective acquisition cost, and what ROI/cash exposure does the campaign imply?**

---

# Part B — GameTuneKit PRD

## 1. Product

**UA Payback & Unit Economics Calculator**

**Utility ID:** `UTIL-004`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

How long does it take an acquired user to earn back effective acquisition cost, and what ROI/cash exposure does the campaign imply?

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
| Reported CPA / CAC | currency | 3.00 | >= 0 |
| Organic multiplier / K-factor | number | 0.20 | >= 0 |
| D1 retention | % | 35 | 0–100 |
| D7 retention | % | 15 | 0–100 |
| D30 retention | % | 7 | 0–100 |
| ARPDAU | currency | 0.12 | >= 0 |
| Target horizon | select | 365 | 90 / 180 / 365 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

EffectiveCAC = ReportedCAC / (1 + OrganicMultiplier)

Fit the same GameTune power-law retention model used by Utility #01:
R(t) = a × t^-b
using D1/D7/D30.

DailyValue(t) = R(t) × ARPDAU
CumulativeLTV(t) = sum DailyValue(1..t)

PaybackDay = first t where CumulativeLTV(t) >= EffectiveCAC.
If no crossing inside selected horizon, show "Not reached within horizon".

ROI(H) = (LTV(H) - EffectiveCAC) / EffectiveCAC
For EffectiveCAC = 0, avoid divide-by-zero and show acquisition as cost-free scenario.

CashExposure(t) = max(0, EffectiveCAC - CumulativeLTV(t))
MaximumCashExposure = max CashExposure(t)

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Effective CAC
- Payback day
- D90/D180/D365 LTV
- ROI at selected horizon
- Maximum unrecovered acquisition cost
- Retention decay coefficient
- Campaign-health diagnostics without unsupported industry grades

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Cumulative LTV vs Effective CAC with payback crossing
- ROI by day
- Retention curve

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

1. Organic multiplier discounts effective acquisition cost
2. Retention follows a power-law approximation
3. ARPDAU remains constant
4. No cohort-mix or channel-quality changes
5. Directional economics model

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

- CAC $3 and organic multiplier 0 => effective CAC $3
- CAC $3 and multiplier .5 => effective CAC $2
- ARPDAU 0 => no payback for positive CAC
- CAC 0 must not divide by zero
- Payback day is first crossing, not nearest point

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit UA Payback & Unit Economics Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

How long does it take an acquired user to earn back effective acquisition cost, and what ROI/cash exposure does the campaign imply?

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

- Reported CPA / CAC: currency, default 3.00, validation >= 0
- Organic multiplier / K-factor: number, default 0.20, validation >= 0
- D1 retention: %, default 35, validation 0–100
- D7 retention: %, default 15, validation 0–100
- D30 retention: %, default 7, validation 0–100
- ARPDAU: currency, default 0.12, validation >= 0
- Target horizon: select, default 365, validation 90 / 180 / 365

## EXACT MODEL

EffectiveCAC = ReportedCAC / (1 + OrganicMultiplier)

Fit the same GameTune power-law retention model used by Utility #01:
R(t) = a × t^-b
using D1/D7/D30.

DailyValue(t) = R(t) × ARPDAU
CumulativeLTV(t) = sum DailyValue(1..t)

PaybackDay = first t where CumulativeLTV(t) >= EffectiveCAC.
If no crossing inside selected horizon, show "Not reached within horizon".

ROI(H) = (LTV(H) - EffectiveCAC) / EffectiveCAC
For EffectiveCAC = 0, avoid divide-by-zero and show acquisition as cost-free scenario.

CashExposure(t) = max(0, EffectiveCAC - CumulativeLTV(t))
MaximumCashExposure = max CashExposure(t)

## REQUIRED OUTPUTS

- Effective CAC
- Payback day
- D90/D180/D365 LTV
- ROI at selected horizon
- Maximum unrecovered acquisition cost
- Retention decay coefficient
- Campaign-health diagnostics without unsupported industry grades

## REQUIRED CHARTS

- Cumulative LTV vs Effective CAC with payback crossing
- ROI by day
- Retention curve

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Organic multiplier discounts effective acquisition cost
2. Retention follows a power-law approximation
3. ARPDAU remains constant
4. No cohort-mix or channel-quality changes
5. Directional economics model

## TESTS

Write unit tests covering:

- CAC $3 and organic multiplier 0 => effective CAC $3
- CAC $3 and multiplier .5 => effective CAC $2
- ARPDAU 0 => no payback for positive CAC
- CAC 0 must not divide by zero
- Payback day is first crossing, not nearest point

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
