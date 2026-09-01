# GameTuneKit — ATT & Privacy Sandbox Signal Dilution Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/privacy-dilution/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **How much deterministic attribution signal is likely to be lost under my iOS/Android privacy mix, and what directional CPA/budget impact might that create?**

---

# Part B — GameTuneKit PRD

## 1. Product

**ATT & Privacy Sandbox Signal Dilution Calculator**

**Utility ID:** `UTIL-031`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

How much deterministic attribution signal is likely to be lost under my iOS/Android privacy mix, and what directional CPA/budget impact might that create?

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
| Monthly UA budget | currency | 100,000 | >= 0 |
| iOS traffic share | % | 50 | 0–100 |
| ATT opt-in | % | 25 | 0–100 |
| Android Privacy Sandbox adoption | % | 20 | 0–100 |
| EU traffic share | % | 25 | 0–100 |
| Conversion window | hours | 24 | > 0 |
| SKAN schema optimisation | select | Good | Poor / Basic / Good |
| MMP setup | select | Good | None / Basic / Good |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

This utility must expose its assumptions because platform rules evolve.

AndroidShare = 1 - iOSShare
ATTOptOut = 1 - ATTOptIn

Define configurable scenario loss weights:
iOS ATT opt-out base loss = 0.55
Android Sandbox base loss = 0.25
EU privacy penalty = 0.10 × EUShare
Long-window penalty = min(0.15, max(0, ConversionWindowHours-24)/168 × 0.15)

SKAN mitigation:
Poor=0.00, Basic=0.10, Good=0.20
MMP mitigation:
None=0.00, Basic=0.05, Good=0.10

RawDilution =
iOSShare × ATTOptOut × iOSLoss
+ AndroidShare × SandboxAdoption × AndroidLoss
+ EUPenalty
+ WindowPenalty
- SKANMitigation × iOSShare
- MMPMitigation

SignalDilutionIndex = clamp(RawDilution, 0, 1)

For a transparent directional economics layer:
CPAInflation = 1 / (1 - 0.5 × SignalDilutionIndex) - 1
BudgetWaste = MonthlyBudget × CPAInflation / (1 + CPAInflation)

All coefficients must live in one configuration object and be labelled GameTune scenario assumptions.

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Signal Dilution Index
- Estimated deterministic/compliant/blackout signal mix
- Directional CPA inflation
- Directional budget inefficiency
- Platform contribution to dilution
- Assumption table/version

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Signal composition
- Dilution contribution by iOS/Android/EU/window
- CPA sensitivity vs dilution

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

1. Privacy rules change and this calculator requires maintenance
2. Coefficients are GameTune scenario assumptions unless later backed by owned data
3. Not a substitute for MMP measurement
4. Does not claim exact SKAN/Privacy Sandbox observability

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

- 0% iOS and 0% Sandbox and 0% EU with 24h window => no platform dilution before mitigations
- 100% ATT opt-in removes ATT opt-out component
- Index clamps 0–1
- Higher dilution cannot reduce directional CPA inflation
- No divide-by-zero at index 1 because formula uses 0.5 multiplier

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit ATT & Privacy Sandbox Signal Dilution Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

How much deterministic attribution signal is likely to be lost under my iOS/Android privacy mix, and what directional CPA/budget impact might that create?

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

- Monthly UA budget: currency, default 100,000, validation >= 0
- iOS traffic share: %, default 50, validation 0–100
- ATT opt-in: %, default 25, validation 0–100
- Android Privacy Sandbox adoption: %, default 20, validation 0–100
- EU traffic share: %, default 25, validation 0–100
- Conversion window: hours, default 24, validation > 0
- SKAN schema optimisation: select, default Good, validation Poor / Basic / Good
- MMP setup: select, default Good, validation None / Basic / Good

## EXACT MODEL

This utility must expose its assumptions because platform rules evolve.

AndroidShare = 1 - iOSShare
ATTOptOut = 1 - ATTOptIn

Define configurable scenario loss weights:
iOS ATT opt-out base loss = 0.55
Android Sandbox base loss = 0.25
EU privacy penalty = 0.10 × EUShare
Long-window penalty = min(0.15, max(0, ConversionWindowHours-24)/168 × 0.15)

SKAN mitigation:
Poor=0.00, Basic=0.10, Good=0.20
MMP mitigation:
None=0.00, Basic=0.05, Good=0.10

RawDilution =
iOSShare × ATTOptOut × iOSLoss
+ AndroidShare × SandboxAdoption × AndroidLoss
+ EUPenalty
+ WindowPenalty
- SKANMitigation × iOSShare
- MMPMitigation

SignalDilutionIndex = clamp(RawDilution, 0, 1)

For a transparent directional economics layer:
CPAInflation = 1 / (1 - 0.5 × SignalDilutionIndex) - 1
BudgetWaste = MonthlyBudget × CPAInflation / (1 + CPAInflation)

All coefficients must live in one configuration object and be labelled GameTune scenario assumptions.

## REQUIRED OUTPUTS

- Signal Dilution Index
- Estimated deterministic/compliant/blackout signal mix
- Directional CPA inflation
- Directional budget inefficiency
- Platform contribution to dilution
- Assumption table/version

## REQUIRED CHARTS

- Signal composition
- Dilution contribution by iOS/Android/EU/window
- CPA sensitivity vs dilution

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Privacy rules change and this calculator requires maintenance
2. Coefficients are GameTune scenario assumptions unless later backed by owned data
3. Not a substitute for MMP measurement
4. Does not claim exact SKAN/Privacy Sandbox observability

## TESTS

Write unit tests covering:

- 0% iOS and 0% Sandbox and 0% EU with 24h window => no platform dilution before mitigations
- 100% ATT opt-in removes ATT opt-out component
- Index clamps 0–1
- Higher dilution cannot reduce directional CPA inflation
- No divide-by-zero at index 1 because formula uses 0.5 multiplier

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
