# GameTuneKit Utility #15 — Pity System Calculator

## Part A — Product / Method Research

### Product question

> **How does a pity rule change acquisition probability, expected pulls, and worst-case cost versus a flat drop rate?**

This is an original GameTuneKit Layer-0 utility specification. Where the calculation is based on a standard mathematical/statistical method, that method is stated directly. Where a game-design assumption is required, it must be visible and editable rather than hidden as an "industry benchmark."

### Family

**Design**

### Utility ID

`UTIL-015`

---

# Part B — GameTuneKit PRD

## 1. Product goal

How does a pity rule change acquisition probability, expected pulls, and worst-case cost versus a flat drop rate?

The V1 calculator must be immediately useful without an account, SDK, telemetry connection, or GameTuneKit game configuration.

## 2. Product principles

1. Functional calculator first; no artificial account gate.
2. Deterministic calculations.
3. Full formula transparency.
4. User inputs and model assumptions must be visually distinguishable.
5. Do not claim benchmark authority unless GameTuneKit owns/licences the dataset.
6. Do not call scenario outputs predictions unless the model actually supports prediction.
7. All calculations run client-side.
8. State is shareable through the URL.

## 3. Primary users

- Game product managers
- Economy / monetisation designers
- LiveOps designers where relevant
- UA / growth operators where relevant
- Producers and studio founders

## 4. Inputs

| Input | Type | Default | Validation |
|---|---|---|---|
| Base drop probability | User input | Required/optional as applicable | Validate non-negative/domain-specific values |
| Soft pity start | User input | Required/optional as applicable | Validate non-negative/domain-specific values |
| Per-pull probability increase | User input | Required/optional as applicable | Validate non-negative/domain-specific values |
| Hard pity pull | User input | Required/optional as applicable | Validate non-negative/domain-specific values |
| Pull cost | User input | Required/optional as applicable | Validate non-negative/domain-specific values |
| Simulation/analytic horizon | User input | Required/optional as applicable | Validate non-negative/domain-specific values |

Use sensible UI defaults, but never imply that defaults are industry benchmarks.

## 5. Exact V1 calculation model

- `For pull n before soft pity: p_n=p0; after soft pity: p_n=min(1,p0+(n-softStart+1)×increment); at hard pity p_n=1`
- `Survival_n = product(1-p_i)`
- `FirstDropProbability_n = Survival_(n-1)×p_n`
- `ExpectedPulls = sum n×FirstDropProbability_n`
- `ExpectedCost = ExpectedPulls×PullCost`

Implement these as pure functions. Do not round intermediate values.

For undefined ratios with a zero denominator:
- do not emit `NaN` or `Infinity`;
- display a clear `—` / "Not defined" state;
- explain which required denominator is zero.

## 6. Primary outputs

- Expected pulls
- Expected cost
- Median pull
- 90%/95% acquisition pull
- Worst-case pulls/cost
- Difference vs no pity

The dominant result must directly answer the product question. Supporting outputs explain the result.

## 7. Charts / visualisation

- Cumulative acquisition curve
- Per-pull drop probability
- Pity vs no-pity comparison

Charts must have:
- labelled axes;
- tooltips;
- accessible text summaries;
- no dependence on colour alone.

## 8. What-If mode

Add a scenario section for the inputs that most strongly affect the primary result.

Rules:
- baseline values remain untouched;
- scenario begins at 0% change;
- show baseline, scenario, absolute delta and percentage delta;
- allow Reset Scenario;
- use the same calculation engine as baseline.

## 9. Formula transparency

Add **How is this calculated?**

Show:
- each formula;
- the user's substituted values where practical;
- any model assumptions;
- units.

No hidden scoring thresholds.

## 10. Validation and edge cases

- Reject negative values where they are nonsensical.
- Percentages must remain within their logical domain.
- Count inputs use integers where required.
- Handle zero denominators.
- Handle empty optional inputs.
- Do not silently coerce invalid data into plausible-looking results.
- Preserve full internal precision and round only display values.

## 11. Sharing

### Copy Link
Serialize all input and scenario state into URL parameters.

### Copy Results
Produce a readable plain-text summary:
- calculator;
- key inputs;
- primary outputs;
- assumptions;
- scenario delta if active.

## 12. No-account behaviour

No authentication, database, saved project, backend or AI is required.

Future connected versions may bind inputs to shared GameTune objects such as:
Game, Segment, Currency, SKU, Offer, Event, Metric, Market, Experiment.

## 13. Responsive layout

### Desktop
Two columns:
- left = inputs;
- right = primary result + charts.

Below:
- diagnostics;
- What-If;
- formulas;
- assumptions.

### Mobile
Stack all sections in decision order. No core feature may disappear.

## 14. Accessibility

- Visible labels
- Keyboard operability
- Associated validation messages
- Locale-aware numbers
- Text equivalent for charts
- Touch-friendly controls

## 15. Non-goals

V1 does not:
- require telemetry;
- use AI;
- invent proprietary benchmark data;
- save server-side;
- require login;
- expand into a general analytics product.

## 16. Deterministic acceptance tests

- Verify `For pull n before soft pity: p_n=p0; after soft pity: p_n=min(1,p0+(n-softStart+1)×increment); at hard pity p_n=1` with at least one hand-calculated deterministic vector.
- Verify `Survival_n = product(1-p_i)` with at least one hand-calculated deterministic vector.
- Verify `FirstDropProbability_n = Survival_(n-1)×p_n` with at least one hand-calculated deterministic vector.

Universal tests:
- Zero/empty edge cases never render NaN/Infinity.
- 0% What-If exactly equals baseline.
- URL state round-trip reproduces the same calculation.
- Copy Results matches visible outputs.
- Desktop/mobile render without horizontal overflow.
- Existing lint/typecheck/build tests pass.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Utility #15: Pity System Calculator

Read this entire specification before coding. The PRD above is authoritative.

## CORE QUESTION

How does a pity rule change acquisition probability, expected pulls, and worst-case cost versus a flat drop rate?

## SCOPE

Build this as a GameTuneKit Layer-0 calculator:
- no login;
- no backend persistence;
- no telemetry requirement;
- no AI;
- client-side deterministic calculation;
- shareable URL state.

## BEFORE CODING

Inspect the repository and identify:
- framework and routing;
- existing calculator page conventions;
- component library/design system;
- chart library;
- state management conventions;
- URL-state helpers;
- number/currency formatting;
- test framework.

Reuse them. Do not replace working infrastructure.

## INPUTS

- Base drop probability
- Soft pity start
- Per-pull probability increase
- Hard pity pull
- Pull cost
- Simulation/analytic horizon

Implement field-level validation and clear units/tooltips.

## EXACT CALCULATION MODEL

- `For pull n before soft pity: p_n=p0; after soft pity: p_n=min(1,p0+(n-softStart+1)×increment); at hard pity p_n=1`
- `Survival_n = product(1-p_i)`
- `FirstDropProbability_n = Survival_(n-1)×p_n`
- `ExpectedPulls = sum n×FirstDropProbability_n`
- `ExpectedCost = ExpectedPulls×PullCost`

Do not invent additional hidden coefficients.

Keep formulas in pure functions outside UI components.
Do not round intermediate values.

## OUTPUTS

- Expected pulls
- Expected cost
- Median pull
- 90%/95% acquisition pull
- Worst-case pulls/cost
- Difference vs no pity

## VISUALISATIONS

- Cumulative acquisition curve
- Per-pull drop probability
- Pity vs no-pity comparison

## WHAT-IF

Implement a non-destructive scenario mode for the most important inputs:
- baseline remains unchanged;
- default scenario delta = 0;
- show baseline/scenario/delta;
- reset control;
- same pure functions as baseline.

## TRANSPARENCY

Implement a collapsible "How is this calculated?" section containing the exact formulas and current substituted values.

If any default is a modelling assumption rather than a mathematical constant, label it as such.

## SHARE

Implement:
1. Copy Link — URL contains complete calculator state.
2. Copy Results — plain-text result summary.

A clean browser opening the copied URL must reproduce the same state/results.

## RESPONSIVE / ACCESSIBILITY

Desktop: inputs left, results/charts right, deeper analysis below.
Mobile: stack in decision order.

All fields need visible labels.
All charts need text summaries.
Keyboard navigation must work.
Do not rely on colour alone.

## TESTS

- Verify `For pull n before soft pity: p_n=p0; after soft pity: p_n=min(1,p0+(n-softStart+1)×increment); at hard pity p_n=1` with at least one hand-calculated deterministic vector.
- Verify `Survival_n = product(1-p_i)` with at least one hand-calculated deterministic vector.
- Verify `FirstDropProbability_n = Survival_(n-1)×p_n` with at least one hand-calculated deterministic vector.

Also test:
- zero denominator behaviour;
- invalid inputs;
- scenario reset/equality;
- URL round-trip;
- deterministic repeatability.

## DEFINITION OF DONE

Done when:
1. Inputs and validation work.
2. Exact formulas above are implemented.
3. Primary outputs are correct.
4. Charts work.
5. What-If works.
6. Formula transparency works.
7. Copy Link works.
8. Copy Results works.
9. Mobile/desktop layouts work.
10. No account/backend/AI dependency was introduced.
11. Unit tests pass.
12. Existing lint/typecheck/build passes.

Do not redesign the product or expand scope while implementing it.
```

---

## Product Direction Note

This utility is deliberately small and composable. Its calculation primitives should be reusable later by GameTuneKit's connected Pricing, Simulation, LiveOps, Experimentation, and Intelligence products without forcing the Layer-0 calculator to become a platform.
