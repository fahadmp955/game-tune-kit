# GameTuneKit Utilities Catalogue

## Purpose

This document defines the standalone utility/calculator catalogue for GameTuneKit.

Utilities are intended to be the lowest-friction entry point into the ecosystem:

- useful without an account;
- little or no studio integration;
- generous/free functionality;
- focused on specific game-development, monetisation, LiveOps, economy, intelligence, experimentation, and growth questions;
- designed so that individual utilities can later benefit from shared GameTuneKit concepts and connected studio data.

The catalogue is intentionally broader than the initial launch set. Each selected utility can later be formalised into an individual product specification for implementation.

---

## Utility Catalogue

|   # | Utility                               | What it does                                                                                                            | Parent Product / Function | Priority                                    |
| --: | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------- |
|   1 | LTV Calculator                        | Uses retention and monetisation assumptions to project player or cohort lifetime value.                                 | Pricing / Growth          | Core                                        |
|   2 | ROAS Calculator                       | Uses acquisition spend, installs and revenue to calculate ROAS across relevant time windows and overall profitability.  | Growth                    | Core                                        |
|   3 | Break-even CPI Calculator             | Calculates the maximum sustainable CPI/bid from expected player LTV or monetisation assumptions.                        | Growth                    | Core                                        |
|   4 | UA Payback Calculator                 | Calculates how long an acquired cohort takes to repay its acquisition cost.                                             | Growth                    | Core                                        |
|   5 | Retention Curve Calculator            | Uses retention checkpoints such as D1, D3, D7, D14 and D30 to model/project a retention curve.                          | Intelligence / Growth     | Core                                        |
|   6 | Retention Benchmark                   | Compares a game's retention against relevant genre/platform benchmark ranges.                                           | Intelligence              | Later — requires benchmark data             |
|   7 | ARPDAU / ARPPU Calculator             | Uses DAU, revenue and payer data to calculate ARPDAU, ARPPU, payer conversion and related monetisation metrics.         | Pricing / Growth          | Core                                        |
|   8 | PPP Price Calculator                  | Takes a reference price and target market and suggests a purchasing-power-adjusted regional price.                      | Pricing                   | Core                                        |
|   9 | IAP Pack Value Calculator             | Compares IAP packs by currency quantity, bonus percentage, effective unit price, anchor value and relative value.       | Pricing                   | Core                                        |
|  10 | Currency Exchange Calculator          | Models relationships between real money, hard currency, soft currency and other game currencies.                        | Simulation / Economy      | Core                                        |
|  11 | Whale Spend Ceiling Calculator        | Estimates the meaningful maximum spend supported by progression, gacha, LiveOps and other sinks.                        | Simulation / Monetisation | Good                                        |
|  12 | Economy Inflation Calculator          | Models currency creation versus destruction to estimate inflation or deflation over time.                               | Simulation / Economy      | Core                                        |
|  13 | Source / Sink Calculator              | Provides a lightweight daily/weekly economy balance without requiring the full simulation product.                      | Simulation / Economy      | Core                                        |
|  14 | Loot / Drop-rate Calculator           | Calculates expected drops, probabilities, attempts required and outcome distributions for loot systems.                 | Simulation / Economy      | Core                                        |
|  15 | Pity System Calculator                | Calculates expected pulls and effective probabilities for systems with soft pity, hard pity or guaranteed outcomes.     | Simulation / Economy      | Core                                        |
|  16 | Gacha Cost Calculator                 | Estimates the expected currency and real-money cost required to obtain a target item at a specified probability.        | Simulation / Monetisation | Core                                        |
|  17 | XP / Progression Curve Generator      | Generates and visualises linear, exponential or custom XP, level and progression curves.                                | Simulation                | Core                                        |
|  18 | Reward Value Calculator               | Calculates the effective economy value of daily rewards, event rewards, compensation and similar reward structures.     | LiveOps / Simulation      | Good                                        |
|  19 | LiveOps Event Impact Forecaster       | Estimates the potential engagement, revenue and economy effects of a planned event.                                     | LiveOps                   | Later — more substantial modelling required |
|  20 | Battle Pass Calculator                | Models pass duration, levels, XP requirements, player engagement requirements and reward value.                         | LiveOps / Simulation      | Very interesting                            |
|  21 | Energy System Calculator              | Models energy caps, regeneration rates and costs to estimate sessions per day and progression constraints.              | Simulation                | Very interesting                            |
|  22 | Ad vs IAP Cannibalisation Calculator  | Models whether changes in rewarded/interstitial advertising could affect IAP revenue.                                   | Pricing / Growth          | Good                                        |
|  23 | Ad Revenue Calculator                 | Uses DAU, impressions, fill rate and eCPM to estimate advertising revenue.                                              | Growth                    | Core                                        |
|  24 | Mediation Yield Calculator            | Compares ad networks, fill rates and eCPMs to estimate blended mediation yield.                                         | Growth                    | Good                                        |
|  25 | Mediation Leakage Calculator          | Estimates potential revenue loss caused by mediation waterfall latency, floors or related inefficiencies.               | Growth                    | Niche                                       |
|  26 | Subscription LTV Calculator           | Uses price, trial conversion, renewal and churn assumptions to estimate subscriber lifetime value.                      | Pricing / Growth          | Good                                        |
|  27 | A/B Test Sample Size Calculator       | Estimates the user count and/or runtime required for a statistically useful game experiment.                            | Data & Experimentation    | Core                                        |
|  28 | Whale-Skewed A/B Calculator           | Adjusts experiment expectations for monetisation metrics where a small number of high spenders can dominate ARPU/ARPPU. | Data & Experimentation    | Good                                        |
|  29 | KPI Tree Calculator                   | Lets users vary retention, conversion, ARPDAU and related inputs and see their downstream business impact.              | Intelligence / Growth     | Very interesting                            |
|  30 | K-Factor Calculator                   | Calculates viral/referral coefficient and related paid-to-organic effects.                                              | Growth                    | Good                                        |
|  31 | ATT / Attribution Dilution Calculator | Estimates the effect of missing or limited attribution signals on campaign measurement.                                 | Growth                    | Niche                                       |
|  32 | DAU / MAU Stickiness Calculator       | Uses DAU, WAU and MAU to calculate engagement/stickiness ratios.                                                        | Intelligence              | Core                                        |
|  33 | Churn Calculator                      | Uses retention/activity assumptions to estimate churn and player-loss trajectories.                                     | Intelligence / Growth     | Core                                        |
|  34 | Soft-launch Scorecard                 | Combines metrics such as retention, CPI, crash rate and ARPDAU into a structured soft-launch readiness assessment.      | Intelligence / Growth     | Very interesting                            |
|  35 | LiveOps Cadence Calculator            | Models event duration, overlap and cooldown to visualise event load and potential player fatigue.                       | LiveOps                   | Good                                        |
|  36 | Offer Discount Calculator             | Compares base economy value with offer price to calculate actual discount, value multiplier and offer positioning.      | Pricing / LiveOps         | Core                                        |

---

## Suggested Initial Release Set

The complete catalogue should be retained, but the initial utility release should focus on approximately 15–18 calculators that are useful, understandable, and relatively inexpensive to implement.

### Monetisation & Growth

1. LTV Calculator
2. ROAS Calculator
3. Break-even CPI Calculator
4. UA Payback Calculator
5. ARPDAU / ARPPU Calculator
6. Ad Revenue Calculator
7. PPP Price Calculator
8. IAP Pack Value Calculator
9. Offer Discount Calculator

### Retention & Product

10. Retention Curve Calculator
11. DAU / MAU Stickiness Calculator
12. Churn Calculator

### Economy & Systems

13. Currency Exchange Calculator
14. Economy Inflation Calculator
15. Source / Sink Calculator
16. Loot / Drop-rate Calculator
17. Pity System Calculator
18. XP / Progression Curve Generator

A/B Test Sample Size, Battle Pass, Energy System and Gacha Cost are strong candidates immediately after this first set.

---

## Utility Families

The utilities should be browsable by the job they support rather than presented as one undifferentiated calculator list.

### Pricing & Monetisation

- LTV Calculator
- ARPDAU / ARPPU Calculator
- PPP Price Calculator
- IAP Pack Value Calculator
- Offer Discount Calculator
- Subscription LTV Calculator
- Whale Spend Ceiling Calculator
- Gacha Cost Calculator
- Ad vs IAP Cannibalisation Calculator

### Growth / UA

- ROAS Calculator
- Break-even CPI Calculator
- UA Payback Calculator
- Ad Revenue Calculator
- Mediation Yield Calculator
- Mediation Leakage Calculator
- K-Factor Calculator
- ATT / Attribution Dilution Calculator
- Soft-launch Scorecard
- KPI Tree Calculator

GameTuneKit should remain focused on calculators and decision-support utilities here rather than attempting to become an attribution/MMP platform.

### Intelligence & Product Metrics

- Retention Curve Calculator
- Retention Benchmark
- DAU / MAU Stickiness Calculator
- Churn Calculator
- KPI Tree Calculator
- Soft-launch Scorecard

Benchmark-dependent utilities can eventually consume the GameTuneKit Intelligence/Open Data layer.

### Economy & Simulation

- Currency Exchange Calculator
- Economy Inflation Calculator
- Source / Sink Calculator
- Loot / Drop-rate Calculator
- Pity System Calculator
- Gacha Cost Calculator
- XP / Progression Curve Generator
- Energy System Calculator
- Reward Value Calculator
- Whale Spend Ceiling Calculator

These should provide lightweight answers without requiring users to open the full simulation product.

### LiveOps

- Reward Value Calculator
- LiveOps Event Impact Forecaster
- Battle Pass Calculator
- LiveOps Cadence Calculator
- Offer Discount Calculator

### Data & Experimentation

- A/B Test Sample Size Calculator
- Whale-Skewed A/B Calculator

---

## Relationship to the Larger GameTuneKit Products

Utilities should not become isolated mini-products. Each utility belongs conceptually to one or more larger GameTuneKit product pillars.

For example:

- PPP Price Calculator → Pricing & Monetisation
- Offer Discount Calculator → Pricing + LiveOps
- Loot Calculator → Simulation
- Battle Pass Calculator → LiveOps + Simulation
- A/B Sample Size → Data & Experimentation
- Retention Benchmark → Intelligence

The standalone utility is the Layer 0 experience. The same concepts can later become richer when a studio chooses to save its game configuration or connect data.

Example:

**Standalone LTV Calculator**

User manually enters retention and monetisation assumptions and receives an LTV estimate.

**Game-aware LTV**

The studio can reuse its own saved player archetypes or segments, such as Whale, Dolphin, Minnow, New Player or Dormant Payer.

**Connected LTV**

The calculator can consume studio data or aggregate metrics rather than requiring manual entry.

**Connected Intelligence**

The same segment definition can be reused by Pricing, LiveOps, PNS, Simulation and Experimentation.

The free calculator is therefore useful by itself while remaining a natural entry point into the larger ecosystem.

---

## Shared Concepts

Calculator specifications should use consistent GameTuneKit terminology from the beginning.

Likely shared concepts include:

- Game
- Player
- Cohort
- Segment / Persona
- Whale / payer type
- Market / Country
- Currency
- SKU / Product
- Offer
- Reward
- Event
- DAU / WAU / MAU
- Retention
- Revenue
- Payer
- CPI / CPA
- LTV
- ARPDAU / ARPPU
- Experiment

At Layer 0 these are simply calculator inputs. They do not require an account or persistent GameTuneKit representation.

At higher layers, they can map directly to the studio's shared GameTuneKit model.

---

## Calculator Framework

The utilities should be implemented using a common calculator framework rather than as dozens of unrelated applications.

A calculator should be definable primarily through:

1. **Metadata**
   - Name
   - Description
   - Category
   - Related GameTuneKit product
   - Related calculators

2. **Inputs**
   - Field name
   - Data type
   - Units
   - Validation
   - Defaults where appropriate
   - Optional/required status
   - Tooltips/explanation

3. **Calculation Engine**
   - Formulae
   - Derived values
   - Assumptions
   - Scenario logic

4. **Outputs**
   - Primary result
   - Supporting metrics
   - Interpretation
   - Warnings
   - Charts where useful

5. **Interaction**
   - Recalculate immediately when inputs change where practical
   - Reset
   - Copy/share results
   - Shareable URL where inputs can safely be encoded
   - Export where useful

6. **Education**
   - What the metric means
   - Formula
   - How to interpret the result
   - Common mistakes
   - Related calculators

This framework should make adding calculator #20 significantly cheaper than building calculator #1.

---

## Free / Paid Philosophy

The utilities are primarily an acquisition and ecosystem-entry surface.

Following the broader GameTuneKit principle of **"Planka, not Trello"**, useful calculator functionality should not be artificially crippled to manufacture a paid tier.

The default should be:

### Free

- Full core calculation
- Useful results
- Formula transparency
- Charts where relevant
- Common/default scenarios or archetypes
- No account required where practical

### Reasons to use a connected/hosted account

- Save studio-specific assumptions
- Define custom segments/personas
- Reuse the same concepts across calculators
- Import connected data
- Maintain historical scenarios
- Share internally with a team
- Compare against GameTuneKit intelligence/benchmarks
- Allow other GameTuneKit products to consume the same definitions

The business case should come from convenience, persistence, shared studio knowledge, hosting and connected intelligence rather than withholding the calculator's useful answer.

---

## Research References

The utility catalogue was informed partly by the calculator/tool catalogue reviewed on **The Game Scientist**, particularly its work around monetisation, UA/growth, ad mediation, experimentation and product analytics.

Ideas identified there that expand the original GameTuneKit utility list include:

- Whale spend ceiling
- Ad/IAP cannibalisation
- Mediation yield
- Mediation leakage
- K-factor
- Whale-skewed experimentation
- KPI-tree modelling
- LiveOps impact forecasting

These are reference/inspiration points rather than requirements to reproduce the original implementations.

---

## Next Step

Each selected utility should receive its own implementation-ready product specification before being handed to Codex.

A calculator specification should define at minimum:

- Purpose
- Intended question answered
- Inputs
- Units
- Defaults
- Validation
- Exact formulas
- Assumptions
- Outputs
- Result interpretation
- Charts/visualisation
- Edge cases
- UX flow
- Mobile behaviour
- Sharing/export behaviour
- Related utilities
- Shared GameTuneKit concepts
- Future connected-data behaviour

The specification—not Codex—should make the product and calculation decisions. Codex should primarily implement the defined behaviour.
