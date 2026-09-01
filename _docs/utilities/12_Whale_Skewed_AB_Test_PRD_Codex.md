# GameTuneKit — Whale-Skewed A/B Test Sample Size Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/ab-tester/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **How long should a monetisation A/B test run when spend is concentrated among a small number of high-value users?**

---

# Part B — GameTuneKit PRD

## 1. Product

**Whale-Skewed A/B Test Sample Size Calculator**

**Utility ID:** `UTIL-028`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

How long should a monetisation A/B test run when spend is concentrated among a small number of high-value users?

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
| Baseline IAP conversion | % | 2 | 0–100 |
| Average Order Value | currency | 10 | >= 0 |
| Pareto shape α | number | 1.5 | > 1 |
| Minimum Detectable Lift | % | 10 | > 0 |
| Total daily traffic | integer | 100,000 | > 0 |
| Statistical power | select | 80% | 80 / 90 / 95 |
| Significance level | select | 5% | 10 / 5 / 1 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

Use two separate calculations and label them clearly.

1. Standard conversion sample size:
p1 = baseline conversion
p2 = p1 × (1 + MDE)
pbar = (p1+p2)/2
n_per_variant =
[ z_(1-alpha/2) × sqrt(2 pbar(1-pbar))
+ z_power × sqrt(p1(1-p1)+p2(1-p2)) ]^2
/ (p2-p1)^2

2. Whale-skew adjustment:
The Pareto distribution has finite variance only for shape > 2.
Therefore do NOT pretend a classical variance exists for α <= 2.

GameTune V1 uses an explicitly named heuristic variance-inflation factor:
if ParetoShape > 2:
VIF = 1 + 1 / (ParetoShape - 2)
else:
VIF = 1 + 4 / max(0.05, ParetoShape - 1)

AdjustedSample = StandardSample × VIF

This is a GameTune conservative scenario heuristic, not a canonical Pareto A/B formula.

Traffic per variant/day = TotalDAU / 2
DurationDays = ceil(AdjustedSample / TrafficPerVariantPerDay)

Also report standard duration without skew adjustment.

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Adjusted sample/variant
- Adjusted test duration
- Standard sample/variant
- Standard duration
- Whale-skew inflation factor
- Baseline and target conversion
- Warning when Pareto α <= 2

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Standard vs skew-adjusted sample size
- Duration vs MDE
- Sample requirement vs Pareto shape

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

1. Two equal-sized variants
2. Two-sided significance test
3. Independent observations
4. Whale-skew factor is a conservative GameTune heuristic until validated/replaced
5. Do not use α symbol ambiguously in UI: call fields Pareto Shape and Significance Level

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

- MDE decrease must increase required sample
- Higher power must not reduce sample
- Lower significance level (stricter) must not reduce sample
- VIF > 1
- Traffic doubling should approximately halve duration
- Pareto shape <=2 shows infinite-variance warning

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Whale-Skewed A/B Test Sample Size Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

How long should a monetisation A/B test run when spend is concentrated among a small number of high-value users?

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

- Baseline IAP conversion: %, default 2, validation 0–100
- Average Order Value: currency, default 10, validation >= 0
- Pareto shape α: number, default 1.5, validation > 1
- Minimum Detectable Lift: %, default 10, validation > 0
- Total daily traffic: integer, default 100,000, validation > 0
- Statistical power: select, default 80%, validation 80 / 90 / 95
- Significance level: select, default 5%, validation 10 / 5 / 1

## EXACT MODEL

Use two separate calculations and label them clearly.

1. Standard conversion sample size:
p1 = baseline conversion
p2 = p1 × (1 + MDE)
pbar = (p1+p2)/2
n_per_variant =
[ z_(1-alpha/2) × sqrt(2 pbar(1-pbar))
+ z_power × sqrt(p1(1-p1)+p2(1-p2)) ]^2
/ (p2-p1)^2

2. Whale-skew adjustment:
The Pareto distribution has finite variance only for shape > 2.
Therefore do NOT pretend a classical variance exists for α <= 2.

GameTune V1 uses an explicitly named heuristic variance-inflation factor:
if ParetoShape > 2:
VIF = 1 + 1 / (ParetoShape - 2)
else:
VIF = 1 + 4 / max(0.05, ParetoShape - 1)

AdjustedSample = StandardSample × VIF

This is a GameTune conservative scenario heuristic, not a canonical Pareto A/B formula.

Traffic per variant/day = TotalDAU / 2
DurationDays = ceil(AdjustedSample / TrafficPerVariantPerDay)

Also report standard duration without skew adjustment.

## REQUIRED OUTPUTS

- Adjusted sample/variant
- Adjusted test duration
- Standard sample/variant
- Standard duration
- Whale-skew inflation factor
- Baseline and target conversion
- Warning when Pareto α <= 2

## REQUIRED CHARTS

- Standard vs skew-adjusted sample size
- Duration vs MDE
- Sample requirement vs Pareto shape

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Two equal-sized variants
2. Two-sided significance test
3. Independent observations
4. Whale-skew factor is a conservative GameTune heuristic until validated/replaced
5. Do not use α symbol ambiguously in UI: call fields Pareto Shape and Significance Level

## TESTS

Write unit tests covering:

- MDE decrease must increase required sample
- Higher power must not reduce sample
- Lower significance level (stricter) must not reduce sample
- VIF > 1
- Traffic doubling should approximately halve duration
- Pareto shape <=2 shows infinite-variance warning

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
