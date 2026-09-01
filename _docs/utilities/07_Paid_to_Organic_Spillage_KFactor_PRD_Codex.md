# GameTuneKit — Paid-to-Organic UA Spillage & K-Factor Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/ua-spillage/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **How much reported organic acquisition may actually be induced by paid UA, and what does that do to effective CAC?**

---

# Part B — GameTuneKit PRD

## 1. Product

**Paid-to-Organic UA Spillage & K-Factor Calculator**

**Utility ID:** `UTIL-030`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

How much reported organic acquisition may actually be induced by paid UA, and what does that do to effective CAC?

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
| Monthly paid installs | integer | 100,000 | >= 0 |
| Reported campaign CPA | currency | 3.00 | >= 0 |
| Reported organic installs | integer | 50,000 | >= 0 |
| Platform | select | Android | Android / iOS |
| Direct viral K-factor | number | 0.10 | >= 0 |
| Chart spillage coefficient | number | 0.15 | >= 0 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

MonthlyUASpend = PaidInstalls × ReportedCPA
ViralOrganics = PaidInstalls × DirectK

GameTune V1 uses an explicitly documented logarithmic chart-spillage scenario:
PlatformFactor = 1.0 for Android, 0.75 for iOS
ChartSpillage = ChartCoeff × PlatformFactor × PaidInstalls × ln(1 + PaidInstalls) / ln(100001)

This normalization makes ChartCoeff approximately interpretable around a 100k-install reference scale.
It is a GameTune modelling choice, not a claimed TGS formula.

PureOrganicBaseline = ReportedOrganic - ViralOrganics - ChartSpillage

If PureOrganicBaseline < 0, retain the negative diagnostic value internally and flag possible
organic cannibalisation/over-attribution; for stacked acquisition visuals, clamp displayed baseline to 0.

MarketingInducedOrganic = ViralOrganics + ChartSpillage
EffectiveAcquiredUsers = PaidInstalls + max(0, MarketingInducedOrganic)
BlendedEffectiveCAC = MonthlyUASpend / EffectiveAcquiredUsers

EffectiveK = MarketingInducedOrganic / PaidInstalls when PaidInstalls > 0.

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Monthly UA spend
- Viral organics
- Estimated chart spillage
- Pure organic baseline
- Effective K-factor
- Blended effective CAC
- Cannibalisation/over-attribution flag

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Attribution decomposition
- Effective K-factor vs paid volume
- Reported CPA vs blended effective CAC

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

1. Chart spillage is a scenario model, not deterministic attribution
2. Platform factor is explicit/editable in Advanced mode
3. Direct viral K-factor is supplied by user
4. No probabilistic multi-touch attribution

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

- 100k paid × $3 CPA = $300k spend
- K=.1 => 10k viral organics
- Paid installs 0 must not divide by zero
- Negative pure baseline triggers warning
- Higher K cannot increase blended effective CAC when all else is equal

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Paid-to-Organic UA Spillage & K-Factor Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

How much reported organic acquisition may actually be induced by paid UA, and what does that do to effective CAC?

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

- Monthly paid installs: integer, default 100,000, validation >= 0
- Reported campaign CPA: currency, default 3.00, validation >= 0
- Reported organic installs: integer, default 50,000, validation >= 0
- Platform: select, default Android, validation Android / iOS
- Direct viral K-factor: number, default 0.10, validation >= 0
- Chart spillage coefficient: number, default 0.15, validation >= 0

## EXACT MODEL

MonthlyUASpend = PaidInstalls × ReportedCPA
ViralOrganics = PaidInstalls × DirectK

GameTune V1 uses an explicitly documented logarithmic chart-spillage scenario:
PlatformFactor = 1.0 for Android, 0.75 for iOS
ChartSpillage = ChartCoeff × PlatformFactor × PaidInstalls × ln(1 + PaidInstalls) / ln(100001)

This normalization makes ChartCoeff approximately interpretable around a 100k-install reference scale.
It is a GameTune modelling choice, not a claimed TGS formula.

PureOrganicBaseline = ReportedOrganic - ViralOrganics - ChartSpillage

If PureOrganicBaseline < 0, retain the negative diagnostic value internally and flag possible
organic cannibalisation/over-attribution; for stacked acquisition visuals, clamp displayed baseline to 0.

MarketingInducedOrganic = ViralOrganics + ChartSpillage
EffectiveAcquiredUsers = PaidInstalls + max(0, MarketingInducedOrganic)
BlendedEffectiveCAC = MonthlyUASpend / EffectiveAcquiredUsers

EffectiveK = MarketingInducedOrganic / PaidInstalls when PaidInstalls > 0.

## REQUIRED OUTPUTS

- Monthly UA spend
- Viral organics
- Estimated chart spillage
- Pure organic baseline
- Effective K-factor
- Blended effective CAC
- Cannibalisation/over-attribution flag

## REQUIRED CHARTS

- Attribution decomposition
- Effective K-factor vs paid volume
- Reported CPA vs blended effective CAC

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Chart spillage is a scenario model, not deterministic attribution
2. Platform factor is explicit/editable in Advanced mode
3. Direct viral K-factor is supplied by user
4. No probabilistic multi-touch attribution

## TESTS

Write unit tests covering:

- 100k paid × $3 CPA = $300k spend
- K=.1 => 10k viral organics
- Paid installs 0 must not divide by zero
- Negative pure baseline triggers warning
- Higher K cannot increase blended effective CAC when all else is equal

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
