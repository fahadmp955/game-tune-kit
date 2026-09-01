# GameTuneKit Utility #11 — Whale Spend Ceiling Calculator

## Part A — Reference / Research

### Reference product

**The Game Scientist — Economy Inflation & Whale Spend Simulator**

Source: https://thegamescientist.com/tools/spend-ceiling/

The reference tool estimates the structural maximum spend capacity of a virtual economy by decomposing three major forms of monetisation depth:

1. progression costs;
2. gacha / collection sinks;
3. recurring LiveOps sinks.

It is intended to help product and economy designers reason about whether a game has enough economic depth to absorb spending from high-value players.

### TGS inputs

- Content progression levels
- Average level base cost ($)
- Progression cost inflation (%)
- Gacha collection sink type:
  - none;
  - cosmetic;
  - progression-core
- Loot box / pull cost ($)
- Pulls required to complete the collection/meta
- Monthly LiveOps sink cap ($)
- Optional genre presets for:
  - hypercasual;
  - hybridcasual;
  - casual;
  - midcore;
  - social casino

### TGS outputs

- Economy Depth Rating
- Total Spend Ceiling
- Progression Ceiling
- Gacha & Collection Sink ceiling
- Decomposition chart across:
  - progression;
  - collection;
  - 12-month LiveOps sinks
- 180-day cumulative whale-spend trajectory

### TGS calculation behaviour

The public TGS material describes the model as follows.

#### Progression ceiling

Progression costs compound across content levels.

If:

- `N` = number of progression levels;
- `C0` = base cost of the first level;
- `g` = progression inflation rate;

then the cost of level `n` is:

\[
C_n = C_0(1+g)^n
\]

and total progression ceiling is the geometric sum:

\[
ProgressionCeiling = \sum_{n=0}^{N-1}C_0(1+g)^n
\]

For `g != 0` this can also be expressed as:

\[
ProgressionCeiling =
C_0 \times \frac{(1+g)^N-1}{g}
\]

For `g = 0`:

\[
ProgressionCeiling = C_0 \times N
\]

#### Gacha / collection ceiling

TGS describes:

\[
GachaCeiling = PullCost \times PullsRequired \times CollectionMultiplier
\]

The researched TGS page states these multipliers:

- No gacha: `0×`
- Cosmetic-only collection: `0.5×`
- Progression-core / duplicate-merge: `2.5×`

These are TGS modelling assumptions, not universal game-economy constants.

#### LiveOps ceiling

TGS projects the entered monthly LiveOps sink cap across 12 months:

\[
LiveOpsCeiling = MonthlyLiveOpsSink \times 12
\]

#### Total structural spend ceiling

\[
TotalSpendCeiling =
ProgressionCeiling +
GachaCeiling +
LiveOpsCeiling
\]

TGS maps this total to an economy-depth classification.

The public research does not provide a complete, authoritative threshold table for those classifications, so GameTuneKit should not invent or copy unknown TGS thresholds.

---

# Part B — GameTuneKit PRD

## 1. Product

**GameTuneKit Whale Spend Ceiling Calculator**

**Utility ID:** `UTIL-011`

**Family:** Design / Acquire

**Parent modules:**
- Simulation Platform
- Pricing & Monetisation Platform

**Layer:** L0 — Generic/Open

No login, SDK, telemetry, backend integration, or GameTuneKit game configuration is required.

---

## 2. Product goal

Answer:

> **How much meaningful spending capacity does my game's current economy actually contain?**

The calculator should help a designer determine whether monetisation depth is constrained by the amount of progression, collection, and recurring LiveOps content available to a high-spending player.

It should also answer:

- How much of my spend ceiling comes from progression?
- How much comes from collection/gacha?
- How much comes from recurring LiveOps?
- How quickly does progression cost inflate?
- Which sink is structurally limiting monetisation depth?
- What happens if I add levels, increase progression inflation, deepen collection, or add recurring sinks?
- Is my economy primarily finite or recurring?

The calculator is a **structural scenario model**, not a prediction of how much a real player will spend.

---

## 3. Important terminology

GameTuneKit should avoid implying:

> "A whale will spend $8,400."

Instead say:

> "The modelled economy contains approximately $8,400 of structural spend capacity under these assumptions."

The calculator estimates **available economic sink capacity**.

It does not estimate:
- willingness to pay;
- payer conversion;
- actual whale LTV;
- player affordability;
- demand;
- probability of purchase;
- retention;
- spend velocity.

This distinction must be visible in the UI.

---

## 4. Primary users

- Economy designer
- Monetisation designer
- Product manager
- Game producer
- LiveOps designer
- Studio founder

The calculator must remain usable by someone who understands their game's economy but is not a statistician.

---

## 5. Calculator structure

Use three primary sink sections:

1. **Progression**
2. **Collection / Gacha**
3. **Recurring LiveOps**

A fourth results section combines them.

Desktop should allow the user to understand all three sources without navigating between separate pages.

---

## 6. Value mode

GameTuneKit should support two V1 value modes:

### Real-money equivalent

Default.

Values are entered as an estimated `$` equivalent.

### Virtual currency

The user may instead model all sinks using one common virtual currency.

Examples:

- Gems
- Gold
- Credits

When Virtual Currency mode is selected, ask for:

**Currency name**

Example:

`Gems`

All output uses that unit.

Do not mix multiple virtual currencies in V1.

Do not automatically convert virtual currency to real money unless the user explicitly provides an exchange rate in a future version.

The mathematics is unit-agnostic as long as all values use the same unit.

---

## 7. Progression inputs

| Input | Type | Default | Validation |
|---|---|---:|---|
| Number of progression levels | Integer | 100 | 1–10,000 |
| Base cost per level | Number | 1.00 | ≥0 |
| Cost inflation per level | % | 5 | > -100% |
| Include progression | Toggle | On | — |

Interpretation:

- Level 1 costs the entered base amount.
- Each subsequent level costs the previous level multiplied by `(1 + inflation rate)`.

Example:

Base cost = `$1`

Inflation = `10%`

Then:

```text
Level 1 = $1.00
Level 2 = $1.10
Level 3 = $1.21
Level 4 = $1.331
...
```

---

## 8. Progression calculation

Let:

```text
N = progression level count
C0 = base level cost
g = inflation rate as decimal
```

Then:

\[
C_n=C_0(1+g)^n
\]

for `n = 0 ... N-1`.

Total:

\[
ProgressionCeiling=\sum_{n=0}^{N-1}C_n
\]

Use iterative summation internally rather than relying only on the closed-form geometric formula. This avoids edge cases around `g = 0` and makes it easy to generate the progression chart from the same values.

Do not round internally.

---

## 9. Progression outputs

Show:

### Progression Spend Capacity

Total cost of exhausting the modelled progression path.

### Final Level Cost

Cost of the final configured level.

### Cost Growth

Example:

```text
Level 1          $1.00
Level 25         $3.23
Level 50        $10.40
Level 100      $125.24
```

Use actual configured milestones where possible.

### Progression Cost Curve

X-axis:

`Level`

Y-axis:

`Cost`

Allow tooltip inspection.

If the exponential curve makes early values unreadable, provide a log-scale toggle for the Y-axis.

---

## 10. Collection / gacha inputs

### Collection type

Select:

- None
- Cosmetic collection
- Progression-core / duplicate-merge
- Custom

Defaults to:

`None`

### Pull cost

Number, `>= 0`.

Default:

`1.00`

### Pulls required

Integer, `>= 0`.

Default:

`0` when Collection Type = None.

### Collection multiplier

Automatically populated:

| Type | Default multiplier |
|---|---:|
| None | 0.0 |
| Cosmetic | 0.5 |
| Progression-core / duplicate-merge | 2.5 |
| Custom | User supplied |

These defaults are inspired by the documented TGS model.

They must be visible.

Do not hide the multiplier from the user.

When Custom is selected, allow:

`0–100`

with decimals.

Include explanatory copy:

> The multiplier is a modelling assumption representing how much additional collection depth the system creates. It is not a universal industry benchmark.

---

## 11. Collection calculation

\[
BaseCollectionCost = PullCost \times PullsRequired
\]

\[
CollectionCeiling =
BaseCollectionCost \times CollectionMultiplier
\]

Example:

```text
Pull cost = $2
Pulls required = 500
Multiplier = 2.5

Base collection cost = $1,000
Modelled collection capacity = $2,500
```

---

## 12. Collection outputs

Show:

### Collection Spend Capacity

Primary collection result.

### Base Pull Cost to Completion

Before multiplier.

### Depth Multiplier

Show explicitly.

Example:

```text
Base completion cost       $1,000
Depth multiplier              2.5×
Collection spend capacity   $2,500
```

---

## 13. Recurring LiveOps inputs

| Input | Type | Default | Validation |
|---|---|---:|---|
| Monthly recurring sink capacity | Number | 0 | ≥0 |
| Projection period | Select | 12 months | 3 / 6 / 12 / 24 months |
| Include LiveOps | Toggle | On | — |

Unlike the researched TGS implementation, GameTuneKit should allow multiple projection periods.

The **default remains 12 months** so the result is comparable with the reference concept.

Examples of recurring sinks:

- monthly event shops;
- Battle Pass;
- limited-time offers;
- seasonal collections;
- event currencies;
- recurring upgrade systems.

---

## 14. LiveOps calculation

Let:

```text
M = monthly recurring sink capacity
P = projection period in months
```

Then:

\[
LiveOpsCeiling=M\times P
\]

V1 assumes constant monthly capacity.

Do not invent growth, retention, seasonality or event-fatigue assumptions here.

Those belong in the LiveOps Event Impact Forecaster.

---

## 15. LiveOps outputs

Show:

### Recurring Spend Capacity

For the selected period.

Also show:

```text
Monthly capacity
3-month capacity
6-month capacity
12-month capacity
24-month capacity
```

These can be derived regardless of selected display period.

---

## 16. Total spend ceiling

\[
TotalSpendCeiling =
ProgressionCeiling +
CollectionCeiling +
LiveOpsCeiling
\]

Display prominently as:

# Structural Spend Capacity

Example:

**$8,420**

Supporting copy:

> Estimated total sink capacity available to a high-spending player under the configured progression, collection, and recurring LiveOps assumptions.

Do **not** label this simply "Whale LTV".

It is not LTV.

---

## 17. Finite versus recurring capacity

This is a GameTuneKit addition.

Calculate:

\[
FiniteCapacity =
ProgressionCeiling + CollectionCeiling
\]

\[
RecurringCapacity =
LiveOpsCeiling
\]

Then show:

### Economy Structure

Example:

```text
Finite sinks       64%
Recurring sinks    36%
```

This distinction is strategically useful.

A large finite ceiling may still eventually be exhausted.

A recurring sink can continue generating spend capacity as new content cycles are produced.

---

## 18. Sink composition chart

Title:

**Where does your spend capacity come from?**

Show:

- Progression
- Collection / Gacha
- Recurring LiveOps

Display both:
- absolute value;
- percentage of total.

Example:

```text
Progression       $3,100    37%
Collection        $2,300    27%
LiveOps           $3,020    36%
```

A horizontal stacked bar or similarly compact visual is preferred.

---

## 19. Capacity timeline

The reference TGS tool exposes a 180-day cumulative whale-spend trajectory.

For GameTuneKit, avoid pretending to know actual spend velocity.

Instead title this:

# Available Capacity Over Time

For V1:

- progression capacity is treated as available from the start;
- collection capacity is treated as available from the start;
- recurring LiveOps capacity accumulates linearly by month.

The chart therefore describes **available sink capacity**, not predicted spending.

X-axis:

`Month`

Y-axis:

`Cumulative available capacity`

Plot through the selected LiveOps projection period.

Include a tooltip:

> This chart shows how much monetisation capacity exists or becomes available over time. It does not predict when players will actually spend.

---

## 20. Progression inflation diagnostic

Show:

### Progression Inflation

Report:

- first level cost;
- midpoint cost;
- final level cost;
- total progression cost;
- final/base cost multiple.

Example:

```text
Base level cost       $1.00
Level 50             $10.92
Final level          $131.50
Final/Base             131.5×
```

This lets the user immediately understand how aggressively the economy inflates.

---

## 21. Limiting sink diagnostic

Determine each sink's percentage contribution.

Identify the smallest enabled component.

Display:

### Shallowest Monetisation Layer

Example:

> **Collection depth is currently the smallest component of your modelled spend capacity.**

Do not say:

> "You should add more gacha."

The calculator should diagnose structure, not prescribe monetisation strategy.

If a sink is intentionally disabled, do not call it a weakness.

Only compare enabled sink types.

---

## 22. Scenario controls

Add:

# What if?

Allow percentage adjustments to:

- Progression levels
- Progression inflation
- Collection pulls required
- Collection multiplier
- Monthly LiveOps sink capacity

Suggested control range:

`-50% → +100%`

Do not mutate baseline inputs.

Show:

```text
Current capacity      $8,420
Scenario capacity    $11,730
Change                 +39.3%
```

Also show which sink accounts for the change.

Example:

```text
Progression    +$1,420
Collection       +$500
LiveOps         +$1,390
```

---

## 23. Optional absolute scenario editing

If implementation remains simple, allow the user to switch What-If controls from `% change` to direct values.

This is optional for V1.

Do not delay the calculator for this feature.

---

## 24. Economy depth rating

TGS exposes an Economy Depth Rating, but the researched material does not provide enough information to reproduce its classification thresholds reliably.

Therefore GameTuneKit V1 should **not invent a Low / Medium / High / Infinite rating**.

Instead show transparent structural metrics:

- Total capacity
- Finite capacity
- Recurring capacity
- Progression multiple
- Sink composition
- Scenario delta

A future GameTuneKit Intelligence dataset may allow evidence-based economy-depth benchmarks.

---

## 25. Formula transparency

Add collapsible section:

# How is this calculated?

Explain:

```text
Progression

Each progression level costs more or less than the previous level
according to the inflation rate.

Level Cost = Base Cost × (1 + Inflation)^Level

Progression Capacity = Sum of all level costs.


Collection

Base Collection Cost = Pull Cost × Pulls Required

Collection Capacity =
Base Collection Cost × Collection Depth Multiplier


Recurring LiveOps

LiveOps Capacity =
Monthly Recurring Sink × Number of Months


Total Structural Spend Capacity

Progression + Collection + Recurring LiveOps
```

Show actual values used.

Example:

```text
Progression       $3,420
Collection        $2,500
12m LiveOps       $2,400
--------------------------------
Total             $8,320
```

---

## 26. Assumptions panel

Add:

# Model assumptions

Clearly state:

1. The calculator measures structural sink capacity, not predicted player spending.
2. It assumes the user has converted different sinks into a common value unit.
3. Progression costs follow a constant per-level inflation rate.
4. Collection depth is approximated using a multiplier.
5. LiveOps recurring capacity is assumed constant each month.
6. Player retention is not modelled.
7. Player willingness to pay is not modelled.
8. Discounts, free rewards, bonus currency and price elasticity are not modelled.
9. The result should be used for scenario comparison and economy design, not revenue forecasting.

---

## 27. Sharing

Provide:

**Copy Link**

Encode state in URL parameters.

Conceptual parameters:

```text
mode=real
levels=100
baseCost=1
inflation=5
collectionType=progression
pullCost=2
pulls=500
multiplier=2.5
monthlyLiveOps=200
months=12
```

Opening the URL must reproduce the calculation.

Provide:

**Copy Results**

Example:

```text
GameTuneKit Whale Spend Ceiling

Progression
100 levels
Base cost: $1.00
Inflation: 5%

Collection
Progression-core / duplicate-merge
Pull cost: $2.00
Pulls: 500
Multiplier: 2.5×

LiveOps
Monthly sink: $200
Projection: 12 months

Progression capacity: $X
Collection capacity: $X
Recurring capacity: $X

Total structural spend capacity: $X
```

---

## 28. Account behaviour

No account required.

Future connected behaviour may allow:

- save scenario;
- assign calculation to a Game;
- select an existing Currency;
- import progression definitions;
- import SKUs;
- import loot/gacha configuration;
- import LiveOps events;
- compare economy versions;
- pass the same model into the full Simulation Platform.

None of this belongs in V1.

---

## 29. Shared GameTuneKit concepts

The utility should use terminology compatible with future shared objects:

- Game
- Currency
- SKU
- Progression
- Level
- Collection
- Reward
- Offer
- Event
- LiveOps sink
- Market

Do not require these objects to exist in V1.

---

## 30. Responsive layout

### Desktop

```text
┌────────────────────────────────────────────────────────┐
│ Whale Spend Ceiling                                    │
│ How much structural spend capacity exists in your      │
│ game's economy?                                        │
├─────────────────────────┬──────────────────────────────┤
│ Progression             │ STRUCTURAL SPEND CAPACITY    │
│ Levels                  │ $8,420                       │
│ Base cost               │                              │
│ Inflation               │ Finite / Recurring split     │
│                         │                              │
│ Collection / Gacha      │ Sink composition             │
│ Type                    │                              │
│ Pull cost               │ Progression curve            │
│ Pulls                   │                              │
│ Multiplier              │ Capacity over time           │
│                         │                              │
│ LiveOps                 │                              │
│ Monthly sink            │                              │
│ Projection              │                              │
├─────────────────────────┴──────────────────────────────┤
│ Progression Inflation                                  │
├────────────────────────────────────────────────────────┤
│ What if?                                               │
├────────────────────────────────────────────────────────┤
│ Model assumptions / How this is calculated             │
└────────────────────────────────────────────────────────┘
```

### Mobile

Stack:

1. Intro
2. Value mode
3. Progression inputs
4. Collection inputs
5. LiveOps inputs
6. Total Structural Spend Capacity
7. Finite vs Recurring
8. Sink Composition
9. Progression Curve
10. Capacity Over Time
11. Progression Inflation Diagnostic
12. What If
13. Formula
14. Assumptions

---

## 31. Non-goals

V1 does **not**:

- predict actual whale spending;
- estimate whale LTV;
- ingest telemetry;
- model payer conversion;
- model retention;
- model churn;
- model price elasticity;
- simulate individual players;
- simulate stochastic gacha outcomes;
- model pity systems;
- model source/sink inflation over time;
- model LiveOps fatigue;
- connect to store APIs;
- save calculations;
- require accounts;
- use AI.

Several of these belong to other GameTuneKit utilities.

---

## 32. Relationship to other utilities

This calculator should eventually share mathematical primitives with:

- `#12 Economy Inflation Calculator`
- `#13 Source / Sink Calculator`
- `#14 Loot / Drop-rate Calculator`
- `#15 Pity System Calculator`
- `#16 Gacha Cost Calculator`
- `#18 Reward Value Calculator`
- `#19 LiveOps Event Impact Forecaster`
- `#20 Battle Pass Calculator`
- `#36 Offer Discount Calculator`

Do not merge these into this calculator.

Whale Spend Ceiling is specifically about **aggregate structural monetisation depth**.

---

## 33. Acceptance tests

### Test A — Flat progression

Input:

```text
Levels = 100
Base cost = 1
Inflation = 0%
```

Expected:

```text
Progression capacity = 100
Final level cost = 1
Final/Base multiple = 1×
```

### Test B — Known geometric progression

Input:

```text
Levels = 3
Base cost = 100
Inflation = 10%
```

Level costs:

```text
100
110
121
```

Expected:

```text
Progression capacity = 331
Final level cost = 121
```

### Test C — No collection

Input:

```text
Collection Type = None
Pull cost = 10
Pulls = 100
```

Expected:

```text
Collection multiplier = 0
Collection capacity = 0
```

### Test D — Progression-core collection

Input:

```text
Pull cost = 2
Pulls = 500
Multiplier = 2.5
```

Expected:

```text
Base collection cost = 1000
Collection capacity = 2500
```

### Test E — LiveOps

Input:

```text
Monthly sink = 200
Projection = 12 months
```

Expected:

```text
LiveOps capacity = 2400
```

### Test F — Total

Input:

```text
Progression = 331
Collection = 2500
LiveOps = 2400
```

Expected:

```text
Total structural spend capacity = 5231
Finite capacity = 2831
Recurring capacity = 2400
```

### Test G — Disabled sink

If Collection is disabled, it must contribute zero and must not be labelled the "shallowest enabled monetisation layer."

### Test H — Zero scenario

All What-If changes at 0%.

Expected:

```text
Scenario capacity = baseline capacity
Change = 0%
```

### Test I — URL state

Serialise inputs to URL, parse them in a clean session, and reproduce identical inputs and outputs.

### Test J — Unit independence

Run identical numeric inputs in:
- USD mode;
- Gems mode.

The numerical results must be identical; only labels/formatting change.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Whale Spend Ceiling Calculator

You are building GameTuneKit Utility #11: the **Whale Spend Ceiling Calculator**.

Read this entire specification before writing code.

Do not redesign the product, invent economic assumptions, add AI, merge this calculator with other GameTuneKit utilities, or turn structural spend capacity into a prediction of actual player spending.

Your task is to implement the defined product.

## PRODUCT GOAL

Build a free, no-login calculator that answers:

"How much structural spend capacity exists in my game's current economy?"

The model decomposes spend capacity into:

1. progression;
2. collection/gacha;
3. recurring LiveOps.

This is a GameTuneKit Layer-0 utility.

It must work without:

- accounts;
- telemetry;
- SDK integration;
- backend APIs;
- AI.

## REFERENCE

Conceptual reference:

The Game Scientist — Economy Inflation & Whale Spend Simulator

https://thegamescientist.com/tools/spend-ceiling/

Do not clone its design, wording, genre presets, proprietary content, or unknown classification thresholds.

The publicly documented reference concepts are:

Progression ceiling = geometric progression cost sum.

Collection ceiling =
Pull Cost × Pulls Required × Collection Multiplier.

Reference collection multipliers:

None = 0
Cosmetic = 0.5
Progression-core / duplicate-merge = 2.5

LiveOps ceiling =
Monthly Sink Capacity × Months.

Total Structural Spend Capacity =
Progression + Collection + LiveOps.

GameTuneKit's complete implementation is defined below.

## IMPORTANT SEMANTIC RULE

This calculator does NOT predict actual whale spend or whale LTV.

The principal result must be called:

STRUCTURAL SPEND CAPACITY

Supporting copy:

"Estimated total sink capacity available to a high-spending player under the configured progression, collection, and recurring LiveOps assumptions."

Do not call the result "Whale LTV".

## VALUE MODE

Support:

1. Real-money equivalent
2. Virtual currency

Default:
Real-money equivalent.

For virtual currency ask for currency name, default:

Gems

All inputs and outputs use one common unit.

Do not support multiple currencies or automatic exchange conversion in V1.

## PROGRESSION INPUTS

Number of progression levels
- integer
- default 100
- min 1
- max 10000

Base cost per level
- number
- default 1
- min 0

Cost inflation per level
- percentage
- default 5
- must be greater than -100%

Include Progression toggle
- default on

## PROGRESSION MODEL

Let:

N = level count
C0 = base cost
g = inflation decimal

For n = 0 to N-1:

C(n) = C0 × (1 + g)^n

ProgressionCapacity = sum of all C(n).

Use iterative summation internally.

Do not round intermediate values.

Also calculate:

first level cost
midpoint level cost
final level cost
final/base multiple

## PROGRESSION CHART

Title:

Progression Cost Curve

X-axis:
Level

Y-axis:
Cost

Plot cost of every level.

Provide a log-scale Y-axis toggle if the existing charting system makes this straightforward.

Do not add a large new dependency solely for log scale.

## COLLECTION INPUTS

Collection type:

None
Cosmetic collection
Progression-core / duplicate-merge
Custom

Default:
None

Pull cost:
- number
- >= 0
- default 1

Pulls required:
- integer
- >= 0
- default 0 when None

Collection multiplier defaults:

None = 0
Cosmetic = 0.5
Progression-core / duplicate-merge = 2.5

Custom:
allow user input from 0 to 100 inclusive.

Always show the multiplier.

Include:

"The multiplier is a modelling assumption representing how much additional collection depth the system creates. It is not a universal industry benchmark."

## COLLECTION MODEL

BaseCollectionCost =
PullCost × PullsRequired

CollectionCapacity =
BaseCollectionCost × CollectionMultiplier

Show:

Base Pull Cost to Completion
Depth Multiplier
Collection Spend Capacity

## LIVEOPS INPUTS

Monthly recurring sink capacity
- number
- default 0
- >= 0

Projection period:

3
6
12
24 months

Default:
12

Include LiveOps toggle:
default on.

## LIVEOPS MODEL

LiveOpsCapacity =
MonthlySink × ProjectionMonths

Also calculate:

3-month capacity
6-month capacity
12-month capacity
24-month capacity

V1 assumes constant monthly capacity.

Do not add seasonality, retention, fatigue or revenue forecasting.

## TOTAL

TotalStructuralSpendCapacity =
ProgressionCapacity +
CollectionCapacity +
LiveOpsCapacity

This is the visually dominant result.

## FINITE VS RECURRING

FiniteCapacity =
ProgressionCapacity + CollectionCapacity

RecurringCapacity =
LiveOpsCapacity

Calculate percentage contribution of each to total.

Show:

Economy Structure

Finite sinks
Recurring sinks

Handle total = 0 safely.

## SINK COMPOSITION

Section title:

"Where does your spend capacity come from?"

Show:

Progression
Collection / Gacha
Recurring LiveOps

For each display:

absolute value
percentage of total

Use a compact stacked bar or equivalent visual.

## AVAILABLE CAPACITY OVER TIME

Do not call this a whale-spend prediction.

Title:

Available Capacity Over Time

For V1:

Progression capacity is available at the start.
Collection capacity is available at the start.
LiveOps capacity accumulates linearly over months.

X-axis:
Month

Y-axis:
Cumulative available capacity

Plot through selected projection period.

Tooltip/explanation:

"This chart shows how much monetisation capacity exists or becomes available over time. It does not predict when players will actually spend."

## PROGRESSION INFLATION DIAGNOSTIC

Show:

Base level cost
Midpoint level cost
Final level cost
Total progression capacity
Final/Base cost multiple

## SHALLOWEST ENABLED LAYER

Compare percentage contribution of enabled sink types.

Identify the smallest enabled component.

Display:

"Shallowest Monetisation Layer"

Example:

"Collection depth is currently the smallest component of your modelled spend capacity."

Do not make prescriptive recommendations.

Do not treat disabled sinks as shallow/weak.

## WHAT-IF

Add section:

"What if?"

Percentage adjustments:

Progression levels
Progression inflation
Collection pulls required
Collection multiplier
Monthly LiveOps sink capacity

Suggested slider/control range:

-50% to +100%

Default all:
0%.

Do not mutate baseline inputs.

Calculate:

Current Capacity
Scenario Capacity
Percentage Change

Also show delta by:

Progression
Collection
LiveOps

Scenario values that represent counts must resolve to valid integer counts.

Use a documented rounding method consistently.

## ECONOMY DEPTH RATING

Do NOT implement arbitrary Low / Medium / High / Infinite thresholds.

The TGS reference exposes an Economy Depth Rating but our research does not establish its exact threshold model.

GameTuneKit V1 uses transparent metrics instead.

## FORMULA TRANSPARENCY

Add collapsible:

"How is this calculated?"

Explain:

Progression:

Level Cost = Base Cost × (1 + Inflation)^Level

Progression Capacity = Sum of all level costs.

Collection:

Base Collection Cost = Pull Cost × Pulls Required

Collection Capacity =
Base Collection Cost × Collection Depth Multiplier

LiveOps:

LiveOps Capacity =
Monthly Recurring Sink × Number of Months

Total:

Progression + Collection + LiveOps

Show the user's actual calculated component values.

## MODEL ASSUMPTIONS

Add a visible/collapsible assumptions section stating:

1. This measures structural sink capacity, not predicted player spending.
2. Inputs must use one common value unit.
3. Progression follows a constant per-level inflation rate.
4. Collection depth uses a modelling multiplier.
5. LiveOps recurring capacity is constant per month.
6. Retention is not modelled.
7. Willingness to pay is not modelled.
8. Discounts, free rewards, bonus currency and price elasticity are not modelled.
9. Results are for scenario comparison/economy design, not revenue forecasting.

## SHARE

Provide:

Copy Link
Copy Results

URL state should include values equivalent to:

mode
currencyName
levels
baseCost
inflation
progressionEnabled
collectionType
pullCost
pulls
multiplier
liveOpsEnabled
monthlyLiveOps
months

Opening the URL must reproduce the calculation.

Copy Results must produce a readable plain-text summary.

## NO ACCOUNT

Do not implement:

authentication
database persistence
saved calculations
user accounts

## NO BACKEND

All calculations run client-side.

Do not add a backend unless required by existing project architecture.

## NO AI

Do not add AI.

## RESPONSIVE UX

Desktop:

Two-column workspace.

Left:
value mode;
progression inputs;
collection inputs;
LiveOps inputs.

Right:
Structural Spend Capacity;
finite/recurring split;
sink composition;
progression chart;
capacity-over-time chart.

Below:
progression inflation diagnostic;
What If;
formula;
assumptions.

Mobile stack:

Intro
Value Mode
Progression Inputs
Collection Inputs
LiveOps Inputs
Structural Spend Capacity
Finite vs Recurring
Sink Composition
Progression Curve
Capacity Over Time
Progression Inflation
What If
Formula
Assumptions

Do not hide important functionality on mobile.

## VISUAL DIRECTION

Use the existing GameTuneKit design system if present.

Do not create a separate design language.

This should feel like a professional game-economy design tool.

Prioritise:

clear numeric hierarchy;
compact inputs;
transparent assumptions;
good chart readability;
minimal decoration.

## CODE ARCHITECTURE

Keep calculation logic independent of UI.

At minimum create pure/testable functions equivalent to:

calculateProgressionCosts(levels, baseCost, inflation)
calculateProgressionCapacity(...)
calculateCollectionCapacity(pullCost, pulls, multiplier)
calculateLiveOpsCapacity(monthlyCapacity, months)
calculateTotalCapacity(...)
calculateFiniteRecurringSplit(...)
calculateSinkComposition(...)
calculateCapacityTimeline(...)
calculateScenario(...)

Do not bury formulas inside React components.

Use existing project charting/components/testing infrastructure.

Do not introduce large dependencies unnecessarily.

## REQUIRED TESTS

### Flat progression

Levels = 100
Base = 1
Inflation = 0

Expected:

Progression = 100
Final level = 1
Final/Base = 1

### Geometric progression

Levels = 3
Base = 100
Inflation = 10%

Expected level costs:

100
110
121

Expected progression total:

331

### No collection

Collection type = None
Pull cost = 10
Pulls = 100

Expected collection capacity:

0

### Progression-core collection

Pull cost = 2
Pulls = 500
Multiplier = 2.5

Expected:

Base collection cost = 1000
Collection capacity = 2500

### LiveOps

Monthly sink = 200
Months = 12

Expected:

2400

### Combined total

Progression = 331
Collection = 2500
LiveOps = 2400

Expected:

Total = 5231
Finite = 2831
Recurring = 2400

### Disabled sink

Disabled sink contributes zero and is excluded from shallowest-enabled-layer comparison.

### Zero scenario

All What-If adjustments = 0.

Scenario total must exactly equal baseline total.

### URL persistence

Serialise calculator state, parse it back, and reproduce identical calculation.

### Unit independence

Identical numeric inputs in USD and Gems mode produce identical numeric results; only formatting/unit labels change.

## DEFINITION OF DONE

The calculator is complete when:

1. Real-money and virtual-currency modes work.
2. Progression calculation works and is tested.
3. Collection calculation works and is tested.
4. LiveOps calculation works and is tested.
5. Structural Spend Capacity is correct.
6. Finite vs Recurring split works.
7. Sink composition works.
8. Progression curve works.
9. Available Capacity Over Time works.
10. Progression inflation diagnostic works.
11. Shallowest enabled layer works.
12. What-If scenario works.
13. Formula transparency works.
14. Model assumptions are visible.
15. Copy Link reproduces state.
16. Copy Results works.
17. Desktop and mobile layouts work.
18. No account is required.
19. No unnecessary backend is added.
20. Unit tests pass.
21. Existing project lint/typecheck/build tests pass.

Before coding, inspect the repository and identify:

- framework;
- routing;
- component system;
- charting library;
- state conventions;
- test framework;
- existing GameTuneKit design patterns.

Use those conventions.

Do not replace project infrastructure merely because you prefer another library.
```

---

## Product Direction Note

The GameTuneKit version deliberately differs from a simplistic "whale spend prediction."

The central concept is:

> **Structural Spend Capacity**

That wording is important because progression, gacha and LiveOps define how much value a player *could potentially consume*, not how much a real player *will* spend.

GameTuneKit also adds:

- real-money or virtual-currency modelling;
- explicit finite vs recurring sink capacity;
- transparent and editable collection-depth assumptions;
- progression inflation diagnostics;
- sink composition;
- scenario comparison;
- a capacity-over-time chart that does not pretend to predict spend velocity;
- explicit separation from LTV, retention and revenue forecasting.

These additions make the utility useful as an economy-design tool while keeping it sufficiently contained for a Layer-0 calculator.
