# GameTuneKit Utility #22 — Ad vs IAP Cannibalisation Calculator

## Part A — Reference / Research

### Reference product

**The Game Scientist — Ad-to-IAP Cannibalization Risk Model**

Source: https://thegamescientist.com/tools/ad-cannibalization/

The TGS calculator models the trade-off between increasing ad density and the resulting decay in IAP conversion and player lifespan, then estimates the ad load that maximises blended cohort LTV.

### Intended use

For monetisation leads deciding how much rewarded/interstitial advertising inventory to run alongside an IAP economy without destroying more IAP/retention value than the ads create.

### TGS inputs

- Daily Active Users (DAU)
- Baseline IAP conversion rate (%)
- IAP Average Order Value (AOV, $)
- Primary ad placement type:
  - Rewarded
  - Blended
  - Interstitial
- Blended eCPM ($)
- Current ad density: impressions per user per day
- IAP elasticity coefficient `ε`
- Churn elasticity coefficient `γ`
- Optional genre presets:
  - Casual hybrid
  - Midcore hybrid
  - Arcade hybrid
  - Hypercasual

### TGS outputs

- Monetisation Balance classification
- Blended Cohort LTV
- Monthly Gross Revenue
- Mediation / IAP revenue split
- Cross-elasticity chart:
  - IAP LTV
  - Ad LTV
  - Blended LTV
  - by ad density
- Current configuration versus mathematically optimal peak
- Estimated monthly optimisation lift

### TGS calculation behaviour

The researched TGS page states that:

- IAP conversion decays exponentially with ad density, elasticity `ε`, and an ad-format friction multiplier.
- Active lifespan also decays exponentially using churn elasticity `γ` and the same friction-weighted ad exposure.
- Ad ARPU, IAP ARPU and blended LTV are evaluated across ad-density levels from 0 to 12 impressions per user per day.
- The density producing the highest blended LTV is returned as the optimal peak.

TGS states these format-friction multipliers:

| Format | TGS friction multiplier |
|---|---:|
| Rewarded | 0.4× |
| Blended | 0.8× |
| Interstitial | 1.2× |

These are modelling assumptions, not universal industry constants.

The public page does not expose source code or a complete API/formula contract. GameTuneKit therefore should not pretend that unknown TGS implementation details have been reverse engineered exactly.

---

# Part B — GameTuneKit PRD

## 1. Product

**GameTuneKit Ad vs IAP Cannibalisation Calculator**

**Utility ID:** `UTIL-022`

**Family:** Design / Acquire

**Parent modules:**
- Pricing & Monetisation Platform
- Simulation Platform

**Layer:** L0 — Generic/Open

No login, SDK, telemetry, GameTuneKit account, or backend integration is required.

---

## 2. Product goal

Answer:

> **At what point does adding more ads destroy more IAP and retention value than the ads generate?**

The calculator should also answer:

- What is my current estimated ad revenue?
- What is my current estimated IAP revenue?
- How much IAP conversion might I lose as ad pressure increases?
- How much player lifespan might I lose?
- What is the resulting blended monetisation value?
- What ad density produces the highest modelled blended value?
- How far is my current configuration from that modelled optimum?
- Does the answer change materially depending on ad format?

This is a **scenario model**, not a prediction engine.

---

## 3. Important terminology

The calculator must distinguish between:

### Observed inputs

Values the studio can actually know:

- DAU
- IAP conversion
- AOV
- eCPM
- impressions/user/day
- ad format

### Model assumptions

Values that are difficult to know without experimentation:

- IAP elasticity `ε`
- churn elasticity `γ`
- ad-format friction multiplier

The UI must visually distinguish these two groups.

Do not present a modelled optimum as an empirical fact.

Use wording such as:

> **Modelled optimal ad density**

not:

> **Optimal ad density**

---

## 4. Primary users

- Monetisation designer
- Product manager
- Growth/UA manager
- Game producer
- Studio founder
- LiveOps / economy designer

The calculator must be understandable without requiring the user to know what an elasticity coefficient is.

---

## 5. Calculator modes

Use two modes.

### Simple — Default

The user enters normal game/business metrics.

GameTuneKit supplies transparent default elasticity/friction assumptions.

### Advanced

Exposes:

- IAP elasticity `ε`
- churn elasticity `γ`
- friction multiplier

The same underlying model is used in both modes.

Simple mode must clearly state:

> GameTuneKit is using editable modelling assumptions for how ads affect IAP conversion and player lifespan.

---

## 6. Core inputs

| Input | Type | Default | Validation |
|---|---|---:|---|
| Daily Active Users | Integer | 100,000 | ≥1 |
| Baseline IAP conversion | % | 2.0 | 0–100 |
| IAP Average Order Value | Currency | $10.00 | ≥0 |
| Ad format | Select | Rewarded | — |
| Blended eCPM | Currency | $10.00 | ≥0 |
| Current impressions/user/day | Number | 3 | 0–100 |
| Days/month | Integer | 30 | 1–31 |

For V1, use one common real-money currency.

Default formatting may be USD, but calculation logic must not depend on USD.

---

## 7. Ad format

Options:

- Rewarded
- Blended
- Interstitial
- Custom

Default friction assumptions:

| Format | Default friction |
|---|---:|
| Rewarded | 0.4 |
| Blended | 0.8 |
| Interstitial | 1.2 |
| Custom | User supplied |

These defaults originate from the documented TGS model.

They must be visible in Advanced mode.

Include:

> Friction represents the relative disruptive effect of the selected ad experience. It is a modelling assumption, not a universal benchmark.

For Custom:

`0–10`, decimals allowed.

---

## 8. Advanced model inputs

### IAP elasticity — `ε`

Default:

`0.05`

Suggested input range:

`0–1`

Tooltip:

> Controls how strongly IAP conversion declines as ad pressure increases. Higher values make IAP conversion more sensitive to ads.

### Churn elasticity — `γ`

Default:

`0.03`

Suggested input range:

`0–1`

Tooltip:

> Controls how strongly expected player lifespan declines as ad pressure increases. Higher values make retention/lifespan more sensitive to ads.

These GameTuneKit defaults are product assumptions for V1 and must be labelled as such.

They are not claimed to be TGS defaults.

---

## 9. Baseline lifespan input

The TGS research states that active lifespan decays with ad friction, but the original research note does not establish a public baseline-lifespan input/formula sufficient for an exact clone.

GameTuneKit should therefore make this explicit.

Add:

**Baseline expected active days**

Default:

`30`

Validation:

`> 0`

Tooltip:

> Estimated number of active player-days generated by one acquired/active player before applying additional ad-friction effects.

This makes the model mathematically transparent rather than hiding an assumed lifespan.

---

## 10. Friction-adjusted ad exposure

Let:

```text
d = ad impressions/user/day
f = format friction multiplier
```

Then:

\[
Exposure = d \times f
\]

This becomes the common friction-weighted exposure used by the elasticity models.

---

## 11. IAP conversion model

Let:

```text
C0 = baseline IAP conversion as decimal
ε = IAP elasticity
E = friction-weighted ad exposure
```

Then:

\[
IAPConversion(d)=C_0e^{-\epsilon E}
\]

or:

\[
IAPConversion(d)=C_0e^{-\epsilon(df)}
\]

At zero ad density:

\[
IAPConversion(0)=C_0
\]

The output must never be negative.

---

## 12. Player lifespan model

Let:

```text
L0 = baseline expected active days
γ = churn elasticity
E = friction-weighted ad exposure
```

Then:

\[
Lifespan(d)=L_0e^{-\gamma E}
\]

or:

\[
Lifespan(d)=L_0e^{-\gamma(df)}
\]

At zero ad density:

\[
Lifespan(0)=L_0
\]

---

## 13. IAP value model

For V1, assume:

\[
DailyIAPValue(d)=IAPConversion(d)\times AOV
\]

This represents a simplified expected IAP value per active player-day.

Then:

\[
IAPLTV(d)=DailyIAPValue(d)\times Lifespan(d)
\]

This is deliberately a simplified model.

The assumptions section must state that repeat purchase frequency is not separately modelled.

---

## 14. Ad value model

Let:

```text
d = impressions/user/day
eCPM = revenue per 1,000 impressions
```

Then:

\[
DailyAdARPU(d)=d\times\frac{eCPM}{1000}
\]

And:

\[
AdLTV(d)=DailyAdARPU(d)\times Lifespan(d)
\]

This means increasing ad density raises daily ad revenue while simultaneously reducing modelled lifespan.

That trade-off is the core of the calculator.

---

## 15. Blended LTV

\[
BlendedLTV(d)=IAPLTV(d)+AdLTV(d)
\]

Calculate this for every candidate ad density.

---

## 16. Search range

Evaluate ad density from:

`0 → 12 impressions/user/day`

to remain conceptually aligned with the TGS reference.

Use a sufficiently fine step:

`0.1 impressions/day`

This produces 121 candidate points.

Do not rely on integer-only density because the optimum may lie between integer values.

---

## 17. Modelled optimal density

Find:

\[
d^*=\arg\max_d BlendedLTV(d)
\]

Return:

### Modelled Optimal Ad Density

Example:

**4.2 impressions/user/day**

Also show:

### Current Density

Example:

**3.0/day**

### Difference

Example:

**+1.2/day**

Do not automatically tell the user to implement the modelled optimum.

Supporting copy:

> This is the maximum produced by the current scenario assumptions. Real-world validation should be performed through experimentation.

---

## 18. Current-state outputs

For the user's current ad density calculate:

### Current IAP Conversion

Percentage after modelled cannibalisation.

### IAP Conversion Change

Difference versus baseline.

Example:

```text
Baseline       2.00%
Modelled       1.77%
Change        -11.5%
```

### Expected Active Days

Current friction-adjusted lifespan.

### Lifespan Change

Difference versus baseline.

### Ad LTV

### IAP LTV

### Blended LTV

These are per-player model values.

---

## 19. Monthly revenue model

Use DAU to translate daily economics into a directional monthly view.

### Daily ad revenue

\[
DailyAdRevenue=
DAU\times d\times\frac{eCPM}{1000}
\]

### Monthly ad revenue

\[
MonthlyAdRevenue=
DailyAdRevenue\times DaysPerMonth
\]

### Daily IAP revenue

For V1:

\[
DailyIAPRevenue=
DAU\times IAPConversion(d)\times AOV
\]

### Monthly IAP revenue

\[
MonthlyIAPRevenue=
DailyIAPRevenue\times DaysPerMonth
\]

### Monthly gross revenue

\[
MonthlyGrossRevenue=
MonthlyAdRevenue+MonthlyIAPRevenue
\]

Important:

This monthly revenue view uses the supplied DAU as a steady-state daily audience.

Do not additionally multiply it by modelled lifespan.

The lifespan model belongs to per-player LTV.

This prevents double counting.

---

## 20. Revenue split

Show:

### Monetisation Mix

Example:

```text
IAP      $420,000      72%
Ads      $163,000      28%
```

Use a compact stacked bar or equivalent.

Also show:

**IAP share**

**Ad share**

---

## 21. Cross-elasticity chart

This is the primary chart.

Title:

# Ad Density vs Player Value

X-axis:

`Ad impressions / player / day`

Y-axis:

`Modelled LTV`

Plot three curves:

- IAP LTV
- Ad LTV
- Blended LTV

Mark:

- current density;
- modelled optimal density.

The user should visually see:

- IAP value falling;
- ad value initially increasing;
- lifespan friction affecting both;
- blended value reaching a peak.

---

## 22. Conversion and lifespan chart

Add a second chart.

Title:

# Player Impact

X-axis:

`Ad impressions / player / day`

Left/primary measure:

`IAP conversion %`

Second measure:

`Expected active days`

If the charting system supports dual axes cleanly, use them.

Otherwise use two aligned mini-charts rather than creating a confusing dual-axis chart.

Mark current and modelled optimal density.

---

## 23. Current vs modelled optimum

Create a compact comparison:

| Metric | Current | Modelled Optimum |
|---|---:|---:|
| Ads/user/day | X | X |
| IAP conversion | X% | X% |
| Expected active days | X | X |
| IAP LTV | $X | $X |
| Ad LTV | $X | $X |
| Blended LTV | $X | $X |
| Monthly gross revenue | $X | $X |

This should be one of the most useful parts of the calculator.

---

## 24. Optimisation lift

Calculate:

\[
LTVLift =
\frac{OptimalBlendedLTV-CurrentBlendedLTV}
{CurrentBlendedLTV}
\]

Display:

### Modelled LTV Lift

Example:

**+8.4%**

Also calculate directional monthly revenue difference using the same current DAU assumption.

Label:

### Modelled Monthly Revenue Difference

Example:

**+$42,100/month**

Supporting copy:

> Directional scenario result using constant DAU and the assumptions above. This is not a revenue forecast.

Handle current blended LTV = 0 safely.

---

## 25. Cannibalisation diagnostic

Show:

### IAP Cannibalisation

Calculate percentage loss from baseline:

\[
IAPCannibalisation =
1-\frac{IAPConversion(d)}{C_0}
\]

Example:

**11.5% modelled conversion loss**

### Lifespan Impact

\[
LifespanLoss =
1-\frac{Lifespan(d)}{L_0}
\]

Example:

**8.2% modelled lifespan loss**

These make the model easier to understand than elasticity coefficients alone.

---

## 26. Monetisation balance

Do not reproduce unknown TGS classification thresholds.

Instead use transparent structural language based on the model.

Show:

### Current Trade-off

Examples:

- **Ad-light**
- **Near modelled peak**
- **Above modelled peak**

Define transparently:

```text
Ad-light:
current density < 90% of modelled optimum

Near modelled peak:
current density is within ±10% of modelled optimum

Above modelled peak:
current density > 110% of modelled optimum
```

This classification is GameTuneKit's own simple positional diagnostic.

Do not label it as an industry benchmark.

If optimum = 0, handle the comparison separately.

---

## 27. Format comparison

Add a useful GameTuneKit extension:

# Compare Ad Formats

Using identical baseline inputs and the default format friction assumptions, show the modelled optimum for:

- Rewarded
- Blended
- Interstitial

Example:

| Format | Friction | Modelled Optimal Density | Peak Blended LTV |
|---|---:|---:|---:|
| Rewarded | 0.4 | X | $X |
| Blended | 0.8 | X | $X |
| Interstitial | 1.2 | X | $X |

If the user selects Custom, show it as an additional row.

This demonstrates why ad format matters without requiring multiple separate calculations.

---

## 28. Sensitivity controls

Add:

# What if?

Allow adjustments to:

- eCPM
- IAP AOV
- IAP elasticity
- churn elasticity

The purpose is to answer:

> Does my conclusion survive different assumptions?

Suggested adjustment range:

`-50% → +100%`

Do not mutate baseline inputs.

Show:

```text
Current modelled optimum     4.2 ads/day
Scenario optimum             3.5 ads/day

Current peak LTV             $X
Scenario peak LTV            $Y
```

This is particularly important because elasticity coefficients are assumptions.

---

## 29. Assumption sensitivity warning

If a small elasticity change causes the modelled optimum to move substantially, display:

> **This result is sensitive to the elasticity assumptions. Validate with an A/B test before making a major ad-load change.**

For V1, define "substantially" as:

- modelled optimal density changes by `>= 25%`; or
- peak blended LTV changes by `>= 20%`

when the scenario controls are used.

---

## 30. Formula transparency

Add collapsible:

# How is this calculated?

Explain:

```text
Ad pressure is represented by:

Ad Exposure =
Ads per Player per Day × Format Friction


IAP conversion is modelled as:

Conversion =
Baseline Conversion × e^(-IAP Elasticity × Exposure)


Player lifespan is modelled as:

Lifespan =
Baseline Lifespan × e^(-Churn Elasticity × Exposure)


IAP LTV:

IAP LTV =
Conversion × Average Order Value × Lifespan


Ad LTV:

Ad LTV =
(Ads per Day × eCPM / 1000) × Lifespan


Blended LTV:

Blended LTV =
IAP LTV + Ad LTV
```

Then show actual values for the current scenario.

---

## 31. Model assumptions

Add a visible/collapsible section.

State:

1. This is a scenario model, not an empirical prediction.
2. Ad friction is represented using a simplified format multiplier.
3. IAP conversion response is modelled exponentially.
4. Lifespan response is modelled exponentially.
5. IAP AOV is assumed constant as ad density changes.
6. eCPM is assumed constant as ad density changes.
7. Repeat-purchase frequency is not separately modelled.
8. DAU is assumed constant for the monthly revenue comparison.
9. Ad fill rate is not separately modelled.
10. Ad auction dynamics are not modelled.
11. Player segmentation is not modelled.
12. Real-world optimisation should be validated experimentally.

---

## 32. Sharing

Provide:

**Copy Link**

URL state should encode parameters equivalent to:

```text
mode
dau
iapConversion
aov
adFormat
ecpm
currentDensity
baselineLifespan
iapElasticity
churnElasticity
customFriction
daysPerMonth
```

Opening the link must reproduce the calculation.

Provide:

**Copy Results**

Example:

```text
GameTuneKit Ad vs IAP Cannibalisation

DAU: 100,000
Baseline IAP Conversion: 2.0%
AOV: $10
Ad Format: Rewarded
eCPM: $10
Current Density: 3 ads/player/day

Modelled Current State
IAP Conversion: X%
Expected Active Days: X
IAP LTV: $X
Ad LTV: $X
Blended LTV: $X

Modelled Optimal Density: X/day
Peak Blended LTV: $X
Modelled Lift: X%

Scenario assumptions:
IAP elasticity: X
Churn elasticity: X
Friction: X
```

---

## 33. Account behaviour

No account required.

Future connected GameTuneKit behaviour may:

- populate actual DAU;
- populate ad eCPM;
- populate IAP conversion;
- populate AOV;
- define player Segment;
- estimate elasticity from experiments;
- compare cohorts;
- send a proposed ad-load change into Experimentation;
- monitor actual post-change results.

None belongs in V1.

---

## 34. Relationship to shared GameTuneKit concepts

Future compatibility:

- Game
- Player
- Segment
- Cohort
- SKU
- Offer
- Ad Placement
- Metric
- Experiment
- Market

Do not require these objects in V1.

---

## 35. Relationship to other utilities

This utility should eventually share primitives with:

- `#1 LTV Calculator`
- `#7 ARPDAU / ARPPU Calculator`
- `#23 Ad Revenue Calculator`
- `#24 Mediation Yield Calculator`
- `#25 Mediation Leakage Calculator`
- `#27 A/B Test Sample Size Calculator`
- `#28 Whale-Skewed A/B Calculator`
- `#29 KPI Tree Calculator`

Do not merge them.

---

## 36. Responsive design

### Desktop

```text
┌───────────────────────────────────────────────────────┐
│ Ad vs IAP Cannibalisation                            │
│ Find where additional ad revenue begins destroying   │
│ more player/IAP value than it creates.               │
├────────────────────────┬──────────────────────────────┤
│ Observed Inputs        │ MODELLED BLENDED LTV         │
│ DAU                    │ $X                           │
│ IAP conversion         │                              │
│ AOV                    │ Current vs optimal density   │
│ Ad format              │                              │
│ eCPM                   │ Revenue split                │
│ Ads/user/day           │                              │
│ Baseline lifespan      │ Ad Density vs Player Value   │
│                        │ chart                        │
│ Model Assumptions      │                              │
│ ε                      │ Player Impact chart          │
│ γ                      │                              │
│ Friction               │                              │
├────────────────────────┴──────────────────────────────┤
│ Current vs Modelled Optimum                          │
├───────────────────────────────────────────────────────┤
│ Compare Ad Formats                                   │
├───────────────────────────────────────────────────────┤
│ What if? / Sensitivity                               │
├───────────────────────────────────────────────────────┤
│ How this is calculated / Model assumptions            │
└───────────────────────────────────────────────────────┘
```

### Mobile

Stack:

1. Intro
2. Observed inputs
3. Model assumptions
4. Current blended LTV
5. Modelled optimum
6. Cannibalisation metrics
7. Monetisation mix
8. Cross-elasticity chart
9. Player-impact chart
10. Current vs optimum
11. Format comparison
12. What If
13. Formula
14. Assumptions

---

## 37. Non-goals

V1 does **not**:

- ingest actual telemetry;
- optimise an ad mediation waterfall;
- model fill rate;
- model per-country eCPMs;
- model multiple placements separately;
- model payer/non-payer segments;
- estimate elasticity from historical data;
- run experiments;
- predict retention from raw cohort data;
- model repeat IAP frequency separately;
- save calculations;
- require an account;
- use AI.

---

## 38. Acceptance tests

### Test A — Zero ad density

Input:

```text
Baseline IAP conversion = 0.02
Baseline lifespan = 30
Density = 0
```

Expected:

```text
Modelled IAP conversion = 0.02
Modelled lifespan = 30
Ad LTV = 0
```

### Test B — Rewarded friction exposure

Input:

```text
Density = 5
Rewarded friction = 0.4
```

Expected:

```text
Exposure = 2
```

### Test C — IAP conversion

Input:

```text
Baseline conversion = 0.02
ε = 0.05
Exposure = 2
```

Expected:

```text
Conversion = 0.02 × exp(-0.1)
≈ 0.01809675
```

### Test D — Lifespan

Input:

```text
Baseline lifespan = 30
γ = 0.03
Exposure = 2
```

Expected:

```text
Lifespan = 30 × exp(-0.06)
≈ 28.25294
```

### Test E — Ad ARPU

Input:

```text
Density = 5
eCPM = 10
```

Expected:

```text
Daily Ad ARPU = 5 × 10 / 1000
= 0.05
```

### Test F — Monthly ad revenue

Input:

```text
DAU = 100000
Density = 5
eCPM = 10
Days = 30
```

Expected:

```text
Daily ad revenue = 5000
Monthly ad revenue = 150000
```

### Test G — Density search

The optimiser must evaluate every density from `0` through `12` inclusive using `0.1` steps and return the density with maximum blended LTV.

### Test H — Zero elasticity

Input:

```text
ε = 0
γ = 0
```

Expected:

- IAP conversion does not change with density.
- Lifespan does not change with density.
- Ad LTV increases linearly with density.
- Modelled optimum should therefore occur at the maximum search density when eCPM > 0.

### Test I — Higher friction

Using identical inputs:

```text
Rewarded friction = 0.4
Interstitial friction = 1.2
```

At any density > 0:

- interstitial modelled IAP conversion must be <= rewarded conversion;
- interstitial modelled lifespan must be <= rewarded lifespan.

### Test J — Zero scenario

All What-If changes at zero.

Expected:

```text
Scenario optimum = baseline optimum
Scenario peak LTV = baseline peak LTV
```

### Test K — URL state

Serialise state, parse it in a clean session, and reproduce identical inputs/results.

---

# Part C — Codex Implementation Prompt

```markdown
# CODEX TASK — Build GameTuneKit Ad vs IAP Cannibalisation Calculator

You are building GameTuneKit Utility #22: the **Ad vs IAP Cannibalisation Calculator**.

Read the entire specification before writing code.

Do not redesign the model, invent additional monetisation assumptions, add AI, or present scenario outputs as observed facts.

## PRODUCT GOAL

Build a free, no-login web calculator answering:

"At what point does adding more ads destroy more IAP and retention value than the ads generate?"

The calculator models the relationship between:

- ad density;
- ad-format friction;
- IAP conversion;
- player lifespan;
- ad value;
- IAP value;
- blended player value.

This is a Layer-0 GameTuneKit utility.

No account, telemetry, SDK, backend or AI is required.

## REFERENCE

Conceptual reference:

The Game Scientist — Ad-to-IAP Cannibalization Risk Model

https://thegamescientist.com/tools/ad-cannibalization/

Do not clone its design, wording, genre presets, proprietary content, or unknown implementation details.

The public TGS research establishes:

- exponential IAP-conversion decay with ad exposure;
- exponential lifespan decay with ad exposure;
- format friction;
- evaluation across 0–12 ads/user/day;
- maximisation of blended LTV.

TGS documents friction multipliers:

Rewarded = 0.4
Blended = 0.8
Interstitial = 1.2

GameTuneKit's exact implementation is defined below.

## SEMANTIC REQUIREMENT

All optimisation outputs must be labelled as MODELLED.

Use:

"Modelled Optimal Ad Density"

Do not use:

"Optimal Ad Density"

without qualification.

The result is a scenario result based on elasticity assumptions.

## MODES

Provide:

SIMPLE — default
ADVANCED

Simple mode shows normal business/game inputs.

Advanced mode exposes:

IAP elasticity
Churn elasticity
Format friction

Both modes use the same calculation engine.

## CORE INPUTS

Daily Active Users
- integer
- default 100000
- >= 1

Baseline IAP Conversion
- percentage
- default 2
- range 0–100

IAP Average Order Value
- currency
- default 10
- >= 0

Ad Format:
Rewarded
Blended
Interstitial
Custom

Default:
Rewarded

Blended eCPM
- currency
- default 10
- >= 0

Current impressions/user/day
- number
- default 3
- range 0–100

Baseline Expected Active Days
- number
- default 30
- > 0

Days/month
- integer
- default 30
- range 1–31

## FRICTION DEFAULTS

Rewarded = 0.4
Blended = 0.8
Interstitial = 1.2

Custom:
user supplied 0–10.

Always expose these assumptions in Advanced mode.

Explain:

"Friction represents the relative disruptive effect of the selected ad experience. It is a modelling assumption, not a universal benchmark."

## ELASTICITY DEFAULTS

GameTuneKit V1 defaults:

IAP elasticity ε = 0.05
Churn elasticity γ = 0.03

Input range:
0–1

These are GameTuneKit scenario defaults.

Do not claim they are TGS or industry benchmarks.

## CORE MODEL

Let:

d = ads/user/day
f = friction
ε = IAP elasticity
γ = churn elasticity
C0 = baseline IAP conversion as decimal
L0 = baseline expected active days
AOV = IAP average order value
eCPM = ad eCPM

Exposure:

E = d × f

IAP conversion:

C(d) = C0 × exp(-ε × E)

Lifespan:

L(d) = L0 × exp(-γ × E)

Daily IAP value per player:

IAPDaily(d) = C(d) × AOV

IAP LTV:

IAPLTV(d) = IAPDaily(d) × L(d)

Daily ad ARPU:

AdDaily(d) = d × eCPM / 1000

Ad LTV:

AdLTV(d) = AdDaily(d) × L(d)

Blended LTV:

BlendedLTV(d) = IAPLTV(d) + AdLTV(d)

Do not round intermediate calculations.

## OPTIMISATION SEARCH

Evaluate density:

0 through 12 inclusive

Step:

0.1

For every density calculate:

Exposure
IAP conversion
Lifespan
IAP LTV
Ad LTV
Blended LTV

Return density producing maximum Blended LTV.

If multiple points are mathematically equal within floating-point tolerance, choose the lower density.

## CURRENT OUTPUTS

At current density show:

Modelled IAP Conversion
IAP Conversion Change
Expected Active Days
Lifespan Change
IAP LTV
Ad LTV
Blended LTV

## MONTHLY REVENUE

Daily Ad Revenue:

DAU × density × eCPM / 1000

Monthly Ad Revenue:

Daily Ad Revenue × days/month

Daily IAP Revenue:

DAU × modelled IAP conversion × AOV

Monthly IAP Revenue:

Daily IAP Revenue × days/month

Monthly Gross Revenue:

Monthly Ad Revenue + Monthly IAP Revenue

IMPORTANT:

Do not multiply monthly DAU revenue by lifespan.

DAU is treated as a steady-state daily audience.

Lifespan belongs only to per-player LTV calculations.

## REVENUE SPLIT

Show:

IAP revenue
Ad revenue

absolute and percentage values.

Handle zero total revenue safely.

## PRIMARY CHART

Title:

Ad Density vs Player Value

X:
Ad impressions / player / day

Y:
Modelled LTV

Plot:

IAP LTV
Ad LTV
Blended LTV

Mark:

current density
modelled optimal density

## PLAYER IMPACT CHART

Title:

Player Impact

Show across ad density:

IAP conversion %
Expected active days

Prefer two aligned mini-charts if a dual-axis chart would be confusing.

Mark current and modelled optimal density.

## CURRENT VS MODELLED OPTIMUM

Show table:

Ads/user/day
IAP conversion
Expected active days
IAP LTV
Ad LTV
Blended LTV
Monthly gross revenue

Columns:

Current
Modelled Optimum

## OPTIMISATION LIFT

LTV Lift:

(Optimal Blended LTV - Current Blended LTV)
/
Current Blended LTV

Handle zero denominator.

Also calculate modelled monthly revenue difference at current DAU.

Label:

"Modelled Monthly Revenue Difference"

Add:

"Directional scenario result using constant DAU and the assumptions above. This is not a revenue forecast."

## CANNIBALISATION

IAP Cannibalisation:

1 - CurrentModelledConversion / BaselineConversion

Lifespan Loss:

1 - CurrentLifespan / BaselineLifespan

Handle baseline zero safely.

## CURRENT TRADE-OFF

Create GameTuneKit positional diagnostic.

If optimum > 0:

Ad-light:
current density < 90% of optimum

Near modelled peak:
current density between 90% and 110% of optimum inclusive

Above modelled peak:
current density > 110% of optimum

Handle optimum = 0 separately.

Do not present these labels as industry benchmarks.

## FORMAT COMPARISON

Using identical baseline inputs and default friction assumptions, calculate:

Rewarded
Blended
Interstitial

Show:

Format
Friction
Modelled Optimal Density
Peak Blended LTV

If Custom is selected, add Custom row.

## WHAT-IF / SENSITIVITY

Allow scenario adjustments to:

eCPM
IAP AOV
IAP elasticity
churn elasticity

Range:

-50% to +100%

Default:
0%.

Do not mutate baseline.

Show:

Current modelled optimum
Scenario optimum
Current peak LTV
Scenario peak LTV

## SENSITIVITY WARNING

When What-If is active, show warning if:

optimal density changes by >= 25%

OR

peak blended LTV changes by >= 20%

Text:

"This result is sensitive to the elasticity assumptions. Validate with an A/B test before making a major ad-load change."

Handle baseline zero safely.

## FORMULA TRANSPARENCY

Add collapsible:

"How is this calculated?"

Explain all formulas in plain language and display actual current-scenario values.

## MODEL ASSUMPTIONS

State:

1. This is scenario modelling, not empirical prediction.
2. Ad friction uses a simplified format multiplier.
3. IAP conversion response is exponential.
4. Lifespan response is exponential.
5. AOV remains constant as density changes.
6. eCPM remains constant as density changes.
7. Repeat purchase frequency is not separately modelled.
8. DAU is constant for monthly revenue comparison.
9. Fill rate is not separately modelled.
10. Auction dynamics are not modelled.
11. Player segments are not modelled.
12. Real changes should be validated experimentally.

## SHARE

Provide:

Copy Link
Copy Results

URL state parameters equivalent to:

mode
dau
iapConversion
aov
adFormat
ecpm
currentDensity
baselineLifespan
iapElasticity
churnElasticity
customFriction
daysPerMonth

Opening link must reproduce calculation.

## NO ACCOUNT

Do not implement:

authentication
database
saved calculations
user accounts

## NO BACKEND

Run calculations client-side.

Do not add backend infrastructure unless existing project architecture requires a route wrapper.

## NO AI

Do not add AI.

## RESPONSIVE UX

Desktop:

Two-column workspace.

Left:
Observed Inputs
Model Assumptions

Right:
Current Blended LTV
Modelled Optimal Density
Cannibalisation metrics
Revenue split
Charts

Below:
Current vs Modelled Optimum
Compare Ad Formats
What If
Formula
Assumptions

Mobile stack:

Intro
Observed Inputs
Model Assumptions
Current Blended LTV
Modelled Optimum
Cannibalisation Metrics
Revenue Split
Ad Density vs Player Value
Player Impact
Current vs Optimum
Format Comparison
What If
Formula
Assumptions

## VISUAL DIRECTION

Use existing GameTuneKit design system.

Do not create a separate visual language.

The product should feel like a professional monetisation-analysis tool.

Clearly distinguish:

OBSERVED INPUTS

from

MODEL ASSUMPTIONS

This distinction is important.

## CODE ARCHITECTURE

Separate calculation logic from UI.

At minimum create pure/testable functions equivalent to:

calculateAdExposure(density, friction)
calculateIAPConversion(baseline, elasticity, exposure)
calculateLifespan(baselineDays, churnElasticity, exposure)
calculateIAPLTV(...)
calculateAdLTV(...)
calculateBlendedLTV(...)
calculateMonthlyRevenue(...)
findOptimalDensity(...)
calculateCannibalisation(...)
calculateFormatComparison(...)
calculateSensitivityScenario(...)

Do not bury formulas inside React components.

Use existing charting, state, component and testing infrastructure.

## REQUIRED TESTS

### Zero density

Baseline conversion = 0.02
Baseline lifespan = 30
Density = 0

Expected:

Conversion = 0.02
Lifespan = 30
Ad LTV = 0

### Friction exposure

Density = 5
Friction = 0.4

Expected:

Exposure = 2

### Conversion

Baseline = 0.02
ε = 0.05
Exposure = 2

Expected approximately:

0.01809675

### Lifespan

Baseline = 30
γ = 0.03
Exposure = 2

Expected approximately:

28.25294

### Ad ARPU

Density = 5
eCPM = 10

Expected:

0.05/day

### Monthly ad revenue

DAU = 100000
Density = 5
eCPM = 10
Days = 30

Expected:

Daily = 5000
Monthly = 150000

### Search range

Optimiser evaluates 0 through 12 inclusive in 0.1 increments.

### Zero elasticity

ε = 0
γ = 0

Expected:

Conversion constant
Lifespan constant
Ad LTV linear with density

If eCPM > 0, modelled optimum = 12.

### Friction ordering

Identical inputs at density > 0:

Interstitial conversion <= Rewarded conversion

Interstitial lifespan <= Rewarded lifespan

### Zero sensitivity scenario

All scenario adjustments 0:

Scenario optimum = baseline optimum
Scenario peak LTV = baseline peak LTV

### URL persistence

Serialise state, parse it back, reproduce identical calculation.

## DEFINITION OF DONE

Complete when:

1. Simple and Advanced modes work.
2. Observed inputs and model assumptions are visually distinguished.
3. Core exponential models work.
4. Current metrics work.
5. Monthly revenue model works without lifespan double counting.
6. Density optimiser works from 0–12 at 0.1 increments.
7. Cross-elasticity chart works.
8. Player-impact chart works.
9. Current vs modelled optimum works.
10. Cannibalisation diagnostics work.
11. Revenue split works.
12. Format comparison works.
13. What-If sensitivity works.
14. Sensitivity warning works.
15. Formula transparency works.
16. Assumptions are visible.
17. Copy Link reproduces state.
18. Copy Results works.
19. Desktop/mobile layouts work.
20. No account required.
21. No unnecessary backend added.
22. Unit tests pass.
23. Existing project lint/typecheck/build tests pass.

Before coding, inspect the repository and identify:

- framework;
- routing conventions;
- component system;
- charting library;
- state conventions;
- test framework;
- GameTuneKit visual patterns.

Use existing project conventions.

Do not replace infrastructure merely because you prefer another library.
```

---

## Product Direction Note

The GameTuneKit version keeps the core idea in the reference research: ad density can create additional ad revenue while simultaneously reducing IAP conversion and player lifespan.

The important GameTuneKit additions are:

- explicit separation of **observed metrics** from **model assumptions**;
- an explicit baseline-lifespan input rather than hiding an unknown assumption;
- transparent exponential formulas;
- current versus modelled-optimum comparison;
- IAP cannibalisation and lifespan-loss diagnostics;
- rewarded/blended/interstitial format comparison;
- sensitivity testing for elasticity assumptions;
- a clear warning when the apparent optimum is highly assumption-sensitive;
- monthly revenue calculations that deliberately avoid double-counting lifespan.

The utility should help a monetisation lead form and test a hypothesis. It should not pretend to know the real causal effect of ad pressure until the studio supplies experiment-derived coefficients.
