# GameTuneKit — LTV-to-CAC Bid Cap & Cash Runway Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/bid-runway/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **Given cash, acquisition volume, CAC and cohort payback, how aggressively can I bid and scale without running out of working capital?**

---

# Part B — GameTuneKit PRD

## 1. Product

**LTV-to-CAC Bid Cap & Cash Runway Calculator**

**Utility ID:** `TGS-05 / GameTune UA Economics`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

Given cash, acquisition volume, CAC and cohort payback, how aggressively can I bid and scale without running out of working capital?

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
| Starting cash | currency | 500,000 | >= 0 |
| Daily paid installs | integer | 1,000 | >= 0 |
| CPA / CAC | currency | 3.00 | >= 0 |
| D180 LTV | currency | 5.00 | >= 0 |
| LTV pacing exponent d | number | 0.65 | > 0 |
| Target payback | days | 180 | > 0 |
| Annual target IRR | % | 20 | >= 0 |
| Payout / reinvestment delay | days | 30 | >= 0 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

Use a transparent 180-day daily cash simulation.

DailySpend = DailyPaidInstalls × CAC

Model cumulative cohort revenue pacing as:
CumulativeRevenueFraction(age) = min(1, (age / 180)^d)
CumulativeRevenue(age) = D180LTV × CumulativeRevenueFraction(age)

Daily cohort revenue is the difference between cumulative values at age t and t-1.
Revenue becomes cash only after the configured payout/reinvestment delay.

For each calendar day:
Cash[d] = Cash[d-1] - DailySpend + ReleasedCohortRevenue[d]

Track:
MinimumCash
MaximumDrawdown = StartingCash - MinimumCash
PeakDeficitDay
RunwayDay = first day Cash < 0, if any

Capital-safe bid cap:
binary-search/test CAC values and return the highest CAC for which Cash[d] never drops below zero
during the simulation.

IRR-discounted economic cap:
discount future cohort cash flows using annual target IRR converted to a daily rate:
r_daily = (1 + IRR)^(1/365) - 1
PV_LTV = sum(DailyCohortRevenue[t] / (1+r_daily)^t)
IRRBidCap = PV_LTV

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Cash runway status
- Maximum drawdown
- Peak deficit day
- Capital-safe CAC/bid cap
- IRR-discounted bid cap
- Maximum safe daily scale at current CAC
- Daily cash balance timeline
- Cohort revenue-release timeline

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Cash balance over 180 days
- Daily spend vs released cohort revenue
- Bid-cap comparison: current CAC / capital-safe cap / IRR cap

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

1. Constant daily install volume
2. Constant CAC
3. D180 LTV is known input
4. Power-law pacing is a scenario assumption
5. No taxes, payroll or non-UA cash costs
6. No changing CAC auction curve as scale increases

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

- Daily installs 1000 and CAC $3 => $3,000 daily spend
- Zero installs => no UA cash draw
- Zero payout delay releases revenue without delay
- Higher payout delay must never improve minimum cash, all else equal
- Safe bid cap must not produce negative cash in the simulated horizon

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit LTV-to-CAC Bid Cap & Cash Runway Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

Given cash, acquisition volume, CAC and cohort payback, how aggressively can I bid and scale without running out of working capital?

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

- Starting cash: currency, default 500,000, validation >= 0
- Daily paid installs: integer, default 1,000, validation >= 0
- CPA / CAC: currency, default 3.00, validation >= 0
- D180 LTV: currency, default 5.00, validation >= 0
- LTV pacing exponent d: number, default 0.65, validation > 0
- Target payback: days, default 180, validation > 0
- Annual target IRR: %, default 20, validation >= 0
- Payout / reinvestment delay: days, default 30, validation >= 0

## EXACT MODEL

Use a transparent 180-day daily cash simulation.

DailySpend = DailyPaidInstalls × CAC

Model cumulative cohort revenue pacing as:
CumulativeRevenueFraction(age) = min(1, (age / 180)^d)
CumulativeRevenue(age) = D180LTV × CumulativeRevenueFraction(age)

Daily cohort revenue is the difference between cumulative values at age t and t-1.
Revenue becomes cash only after the configured payout/reinvestment delay.

For each calendar day:
Cash[d] = Cash[d-1] - DailySpend + ReleasedCohortRevenue[d]

Track:
MinimumCash
MaximumDrawdown = StartingCash - MinimumCash
PeakDeficitDay
RunwayDay = first day Cash < 0, if any

Capital-safe bid cap:
binary-search/test CAC values and return the highest CAC for which Cash[d] never drops below zero
during the simulation.

IRR-discounted economic cap:
discount future cohort cash flows using annual target IRR converted to a daily rate:
r_daily = (1 + IRR)^(1/365) - 1
PV_LTV = sum(DailyCohortRevenue[t] / (1+r_daily)^t)
IRRBidCap = PV_LTV

## REQUIRED OUTPUTS

- Cash runway status
- Maximum drawdown
- Peak deficit day
- Capital-safe CAC/bid cap
- IRR-discounted bid cap
- Maximum safe daily scale at current CAC
- Daily cash balance timeline
- Cohort revenue-release timeline

## REQUIRED CHARTS

- Cash balance over 180 days
- Daily spend vs released cohort revenue
- Bid-cap comparison: current CAC / capital-safe cap / IRR cap

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Constant daily install volume
2. Constant CAC
3. D180 LTV is known input
4. Power-law pacing is a scenario assumption
5. No taxes, payroll or non-UA cash costs
6. No changing CAC auction curve as scale increases

## TESTS

Write unit tests covering:

- Daily installs 1000 and CAC $3 => $3,000 daily spend
- Zero installs => no UA cash draw
- Zero payout delay releases revenue without delay
- Higher payout delay must never improve minimum cash, all else equal
- Safe bid cap must not produce negative cash in the simulated horizon

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
