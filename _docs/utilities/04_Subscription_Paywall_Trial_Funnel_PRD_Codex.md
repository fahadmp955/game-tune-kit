# GameTuneKit — Subscription Paywall & Trial Funnel Calculator

## Part A — Reference / Research

**Reference:** The Game Scientist  
**Source:** https://thegamescientist.com/tools/subscription-grader/

The reference tool is one of TGS's free diagnostic calculators for mobile-game/app monetisation, UA, ad mediation, or product analytics. This document uses the public behaviour of that calculator as research input, then defines an original GameTuneKit implementation. Unknown reference coefficients or proprietary benchmark values are not treated as facts.

### Core question

> **How much is a subscription install worth, and where does value leak through the paywall → trial → paid → renewal funnel?**

---

# Part B — GameTuneKit PRD

## 1. Product

**Subscription Paywall & Trial Funnel Calculator**

**Utility ID:** `UTIL-026`  
**Layer:** L0 — Generic/Open

V1 is client-side, no-login, shareable, and deterministic. It does not require production telemetry.

## 2. Product goal

How much is a subscription install worth, and where does value leak through the paywall → trial → paid → renewal funnel?

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
| Monthly installs | integer | 100,000 | >= 0 |
| Paywall view rate | % | 40 | 0–100 |
| Trial opt-in rate | % | 10 | 0–100 |
| Trial-to-paid conversion | % | 35 | 0–100 |
| Subscription price | currency | 9.99 | >= 0 |
| Billing cycle | select | Monthly | Monthly / Quarterly / Annual |
| Cycle churn | % | 10 | 0–100 |
| Platform fee | % | 15 | 0–100 |

All percentage inputs accept decimals. Never silently repair invalid user data.

## 5. Calculation model

Let I = monthly installs, V = paywall-view rate, T = trial opt-in, P = trial-to-paid,
Price = subscription price, Churn = cycle churn, Fee = platform fee.

PaywallViews = I × V
Trials = PaywallViews × T
NewPaidSubscribers = Trials × P
NetPrice = Price × (1 - Fee)

If Churn > 0:
ExpectedPaidCycles = 1 / Churn
SubscriberLTV = NetPrice × ExpectedPaidCycles

If Churn = 0, do not display an infinite numeric LTV. Show "Unbounded under 0% churn assumption"
and explain that a finite churn assumption is required for a finite LTV.

BlendedLTVPerInstall = (PaywallViews/I) × T × P × SubscriberLTV
NewSubscriberRevenue = NewPaidSubscribers × NetPrice

For renewal curve:
SurvivingSubscribers(cycle n) = NewPaidSubscribers × (1 - Churn)^n

All calculations must be implemented as pure functions and must retain full floating-point precision internally. Round only for display.

## 6. Primary outputs

- Subscriber LTV
- Blended LTV per install
- Paywall views
- Trials started
- New paid subscribers
- Net revenue from first paid cycle
- Expected paid cycles
- Funnel conversion from install → paid
- Renewal survival curve

The dominant output should answer the calculator's core question. Secondary outputs should explain *why* the result moved.

## 7. Visualisations

- Funnel: Installs → Paywall Views → Trials → Paid
- Renewal decay by billing cycle
- Sensitivity: blended LTV vs trial-to-paid conversion/churn

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

1. Constant churn per billing cycle
2. Constant subscription price and platform fee
3. No refunds, grace periods, reactivation, introductory pricing, taxes or regional pricing
4. Install cohorts are treated independently
5. Scenario model, not revenue forecast

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

- 100k installs × 40% views × 10% trials × 35% paid = 1,400 new paid subscribers
- $10 price with 15% fee = $8.50 net price
- 10% churn implies 10 expected paid cycles and $85 subscriber LTV
- 0% churn must not cause divide-by-zero or render a fake finite LTV

Also required for every utility:

- URL round-trip reproduces state.
- Zero/empty-edge cases do not produce NaN/Infinity in UI.
- Scenario at 0% change exactly matches baseline.
- Desktop and mobile layouts render without horizontal overflow.
- Existing project lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Subscription Paywall & Trial Funnel Calculator

You are implementing a production GameTuneKit Layer-0 utility.

Read this entire file before writing code. The PRD above is authoritative.

Do not redesign the product, invent hidden coefficients, add AI, require an account, or substitute a different mathematical model.

## CORE QUESTION

How much is a subscription install worth, and where does value leak through the paywall → trial → paid → renewal funnel?

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

- Monthly installs: integer, default 100,000, validation >= 0
- Paywall view rate: %, default 40, validation 0–100
- Trial opt-in rate: %, default 10, validation 0–100
- Trial-to-paid conversion: %, default 35, validation 0–100
- Subscription price: currency, default 9.99, validation >= 0
- Billing cycle: select, default Monthly, validation Monthly / Quarterly / Annual
- Cycle churn: %, default 10, validation 0–100
- Platform fee: %, default 15, validation 0–100

## EXACT MODEL

Let I = monthly installs, V = paywall-view rate, T = trial opt-in, P = trial-to-paid,
Price = subscription price, Churn = cycle churn, Fee = platform fee.

PaywallViews = I × V
Trials = PaywallViews × T
NewPaidSubscribers = Trials × P
NetPrice = Price × (1 - Fee)

If Churn > 0:
ExpectedPaidCycles = 1 / Churn
SubscriberLTV = NetPrice × ExpectedPaidCycles

If Churn = 0, do not display an infinite numeric LTV. Show "Unbounded under 0% churn assumption"
and explain that a finite churn assumption is required for a finite LTV.

BlendedLTVPerInstall = (PaywallViews/I) × T × P × SubscriberLTV
NewSubscriberRevenue = NewPaidSubscribers × NetPrice

For renewal curve:
SurvivingSubscribers(cycle n) = NewPaidSubscribers × (1 - Churn)^n

## REQUIRED OUTPUTS

- Subscriber LTV
- Blended LTV per install
- Paywall views
- Trials started
- New paid subscribers
- Net revenue from first paid cycle
- Expected paid cycles
- Funnel conversion from install → paid
- Renewal survival curve

## REQUIRED CHARTS

- Funnel: Installs → Paywall Views → Trials → Paid
- Renewal decay by billing cycle
- Sensitivity: blended LTV vs trial-to-paid conversion/churn

## ASSUMPTIONS THAT MUST BE VISIBLE

1. Constant churn per billing cycle
2. Constant subscription price and platform fee
3. No refunds, grace periods, reactivation, introductory pricing, taxes or regional pricing
4. Install cohorts are treated independently
5. Scenario model, not revenue forecast

## TESTS

Write unit tests covering:

- 100k installs × 40% views × 10% trials × 35% paid = 1,400 new paid subscribers
- $10 price with 15% fee = $8.50 net price
- 10% churn implies 10 expected paid cycles and $85 subscriber LTV
- 0% churn must not cause divide-by-zero or render a fake finite LTV

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
