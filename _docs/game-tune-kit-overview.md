# GameTuneKit — Working Product Architecture

GameTuneKit is an open(ish) ecosystem of tools for game developers focused on the work around building and operating games: research, monetisation, pricing, economy design, LiveOps, experimentation, messaging and tuning. It deliberately does **not** focus on code generation or asset generation.

The current thesis is to go wide first, understand the useful product surface, and prioritise later. Product boundaries and names remain provisional.

---

## 1. Core Product Thesis

GameTuneKit should be **Planka, not Trello**.

The free/self-hosted product should do the important job. Paid tiers should primarily sell convenience and operational value — managed hosting, upgrades, backups, security, SSO, support, data isolation, cross-product persistence and connected intelligence — rather than withholding memorable core features.

Working principles:

- Give away as much real functionality as practical.
- Self-hosting should be a first-class option where technically sensible.
- Open schemas, APIs, SDKs and import/export should reduce lock-in.
- Studio-specific definitions and data remain studio-owned and portable.
- Do not require production telemetry for tools that do not fundamentally need it.
- Integration should become valuable naturally as studios adopt more of the ecosystem.
- GameTuneKit is **not intended to become a general analytics platform**.

---

## 2. Three Ways to Classify the Ecosystem

GameTuneKit uses three independent classifications. They should not be conflated.

### Product Pillar — Where does the capability live?

The larger products that contain related features: LiveOps, Pricing & Monetisation, Intelligence, Visual Library, Simulation, Data & Experimentation, and eventually an Engine layer. Small utilities attach to these products rather than becoming an unrelated toolbox.

### Family — What job is the developer doing?

| Family       | Meaning                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Research** | Understand other games, market behaviour, features, monetisation and LiveOps patterns.        |
| **Design**   | Design and tune economies, progression, pricing, rewards, stores and events.                  |
| **Operate**  | Run the live game: events, config, messaging, targeting, experiments and operational changes. |
| **Acquire**  | Understand UA economics, LTV, ROAS, retention and monetisation viability.                     |

A product can serve more than one Family.

### Layer — How much does GameTuneKit know or do?

Layers describe **commitment, game knowledge and integration**, not function or pricing tier.

| Layer                           | Meaning                                                                                                               | Typical relationship with studio data                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **L0 — Generic / Open**         | Useful immediately. GameTuneKit knows nothing about the studio or game.                                               | None required.                                                          |
| **L1 — Game-Aware**             | The studio supplies assumptions, configuration and game-specific concepts.                                            | Game definitions/configuration; no production telemetry required.       |
| **L2 — Data-Aware**             | Tools can use actual studio/game data rather than assumptions. Prefer local/self-hosted processing where appropriate. | Studio-controlled operational or aggregate data.                        |
| **L3 — Connected Intelligence** | Products share studio context. A concept created in one product is understood by the others.                          | Shared GameTune semantic model and cross-product context.               |
| **L4 — Tuning Layer**           | Models/agents reason across the connected system to analyse, simulate, recommend and eventually orchestrate changes.  | Studio-specific models/context while preserving studio control of data. |

AI is therefore **not the product at L0**. It becomes progressively useful as GameTuneKit understands the game, and at L3/L4 becomes the connective tissue across products.

---

## 3. Current Product Pillars

These are the larger products GameTuneKit currently intends to build. Names are working descriptions only.

| #     | Product Pillar                      | Family                     | Purpose                                                                                                               | Core capabilities                                                                                                                                                               | Main references / competitors                                                   |
| ----- | ----------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **1** | **LiveOps Platform**                | Design + Operate           | Open alternative to Balancy for designing, scheduling and running a live game.                                        | LiveOps calendar, event designer, offers, rewards, scheduling, economy changes, event orchestration, remote-config hooks.                                                       | Balancy, PlayFab, Unity Gaming Services, Beamable                               |
| **2** | **Pricing & Monetisation Platform** | Design + Acquire + Operate | Mirava-like product for understanding, auditing and managing market/store pricing.                                    | PPP/regional pricing, store catalogue, IAP value, price audits, subscriptions, country overrides, price history/drift, store integrations, eventual publishing/synchronisation. | Mirava, store-native pricing tools                                              |
| **3** | **Game Intelligence Platform**      | Research                   | Liquid & Grit-style interpretation combined with Sensor Tower/GameRefinery-style structured competitive intelligence. | Game database, monetisation research, LiveOps research, feature research, benchmarks, rankings/store data, classifications, researched reports.                                 | Liquid & Grit, Sensor Tower, GameRefinery, AppMagic                             |
| **4** | **Visual Reference Library**        | Research                   | “Mobbin for games”: visual evidence and reference material for game teams.                                            | Searchable screenshots, UX flows, FTUE, stores, offers, battle passes, events, progression screens, feature/mechanic taxonomy.                                                  | Mobbin, Game UI Database                                                        |
| **5** | **Simulation Platform**             | Design                     | Machinations-like environment for testing game-design and monetisation theories before applying them.                 | Economy designer/simulator, progression curves, sources/sinks, currencies, loot tables, rewards, player archetypes, scenario simulation, economy-impact forecasting.            | Machinations, spreadsheets/internal tools                                       |
| **6** | **Engine Layer — Future**           | Design + Operate           | Bring GameTuneKit concepts and tuning into game engines/runtime. **Deliberately deferred.**                           | Future SDKs, Unity/Unreal integration, runtime configuration, deployment and potentially controlled tuning agents.                                                              | TBD                                                                             |
| **7** | **Data & Experimentation Platform** | Operate                    | Operational game-data primitives without becoming a general analytics platform.                                       | PNS, player identity, reusable segments, attributes, A/B testing, feature flags, remote config/data primitives.                                                                 | OpenPush, OneSignal, Firebase, PlayFab, Statsig                                 |
| **8** | **Publishing & Store Ops Platform** | Operate                    | Coordinate the non-build work required to publish and update a game across storefronts and territories.               | Store metadata/assets, release planning, version/rollout status, territory readiness, IAP readiness, localisation status and cross-product release coordination.                | App Store Connect, Google Play Console, Steamworks, internal release checklists |

### Supporting Utilities

Small tools are acquisition/on-ramp features **inside or in support of the larger products**, not the architecture themselves. They should usually work at L0 with little or no commitment, then become more useful when attached to a studio/game.

Examples include ROAS, LTV, retention, ARPDAU/ARPPU, UA break-even, PPP pricing, IAP value, loot/drop-rate and reward calculators.

---

## 4. Rewired Feature Matrix

The feature list is organised under its larger product rather than treating every capability as a standalone application.

| Product                    | Feature                                | Family             | What it does                                                                                                                                                                                                                                                                                                                                                                               | Layer path                                                                                               | Shared across products?                                                                         | Free / Paid direction                                                                                                                                           | Deployment                            | Competitors / references                                                     |
| -------------------------- | -------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| **Pricing & Monetisation** | PPP / Regional Pricing                 | Design / Acquire   | Recommends regional prices using purchasing power and market/store information.                                                                                                                                                                                                                                                                                                            | L0 generic → L1 catalogue → L2 store data → L3 connected                                                 | **Yes:** markets, SKUs, offers, segments                                                        | Core calculator free; managed sync/automation can be paid                                                                                                       | Hosted + self-host where practical    | Mirava                                                                       |
| **Pricing & Monetisation** | Store Catalogue                        | Design / Operate   | Central model of IAPs, subscriptions, currencies, packs and prices.                                                                                                                                                                                                                                                                                                                        | L1 → L3                                                                                                  | **Highly:** LiveOps, Simulation, LTV, Intelligence                                              | Core/open; managed persistence/integrations paid                                                                                                                | Hosted + self-host                    | Mirava                                                                       |
| **Pricing & Monetisation** | IAP Value / Store Planner              | Design             | Compare pack value, discounts, anchors, bundles and virtual-currency value.                                                                                                                                                                                                                                                                                                                | L0 → L3                                                                                                  | **Yes:** SKUs, currencies, offers, segments                                                     | Useful standalone version free; connected planning adds hosted value                                                                                            | Hosted + self-host                    | Mirava, spreadsheets                                                         |
| **Pricing & Monetisation** | Price Audit / History / Drift          | Research / Operate | Detect regional inconsistencies and track how prices change over time.                                                                                                                                                                                                                                                                                                                     | L1 → L3                                                                                                  | **Yes:** catalogue, markets, LiveOps                                                            | Core audit should remain useful free; monitoring/managed integration paid                                                                                       | Hosted primarily                      | Mirava                                                                       |
| **Pricing & Monetisation** | Store Publishing / Synchronisation     | Operate            | Push and synchronise pricing changes across supported stores.                                                                                                                                                                                                                                                                                                                              | L2 → L4                                                                                                  | **Yes:** catalogue, LiveOps, experiments                                                        | Integration/hosting/operations are natural paid value                                                                                                           | Hosted + possible self-host           | Mirava                                                                       |
| **Pricing & Monetisation** | LTV Calculator                         | Acquire            | Estimate player LTV using generic archetypes or studio-specific player definitions/data.                                                                                                                                                                                                                                                                                                   | L0 generic → L1 custom personas → L2 actual data → L3 connected                                          | **Highly:** segments/personas, retention, spend, offers                                         | Generic calculator free; studio persistence/connected data adds paid value                                                                                      | Hosted; self-host later possible      | Spreadsheets, analytics tools                                                |
| **Pricing & Monetisation** | ROAS / UA Break-even                   | Acquire            | Calculate ROAS, sustainable CPI/CPA and payback from LTV/monetisation assumptions.                                                                                                                                                                                                                                                                                                         | L0 → L2                                                                                                  | **Yes:** LTV, markets, segments                                                                 | Free core utility; connected data/monitoring can add paid value                                                                                                 | Hosted                                | Spreadsheets, UA calculators                                                 |
| **Pricing & Monetisation** | Retention / ARPDAU / ARPPU Utilities   | Acquire            | Simple calculators for common monetisation and retention metrics.                                                                                                                                                                                                                                                                                                                          | L0 → L2                                                                                                  | **Yes:** metrics, segments                                                                      | Free                                                                                                                                                            | Hosted                                | Spreadsheets, analytics platforms                                            |
| **LiveOps**                | LiveOps Calendar                       | Design / Operate   | Plan events, offers, rewards, content releases and timed changes.                                                                                                                                                                                                                                                                                                                          | L0/L1 → L4                                                                                               | **Highly:** events, offers, SKUs, rewards, segments, config                                     | Core calendar/open functionality free; managed connected operation paid                                                                                         | Hosted + self-host                    | Balancy                                                                      |
| **LiveOps**                | Event Designer                         | Design             | Define event configuration, rewards, currencies, offers, segments and dependencies.                                                                                                                                                                                                                                                                                                        | L1 → L4                                                                                                  | **Extremely:** touches Pricing, Simulation, Data                                                | Core/open                                                                                                                                                       | Hosted + self-host                    | Balancy, PlayFab                                                             |
| **LiveOps**                | Reward Designer / Calendar             | Design             | Build recurring/daily rewards and understand cumulative/economy value.                                                                                                                                                                                                                                                                                                                     | L0 → L3                                                                                                  | **Yes:** rewards, currencies, segments, Simulation                                              | Standalone free; connected modelling adds value                                                                                                                 | Hosted + self-host                    | Balancy, spreadsheets                                                        |
| **LiveOps**                | Event Orchestration / Scheduling       | Operate            | Coordinate timed changes to events, offers, config, segments and messages.                                                                                                                                                                                                                                                                                                                 | L2 → L4                                                                                                  | **Extremely**                                                                                   | Operational hosting/reliability is natural paid value                                                                                                           | Hosted + self-host                    | Balancy, PlayFab, UGS                                                        |
| **LiveOps**                | Economy Impact                         | Design             | Forecast how an event/reward/offer changes sources, sinks and progression.                                                                                                                                                                                                                                                                                                                 | L1 assumptions → L2 data → L3 connected → L4 tuning                                                      | **Yes:** Simulation, Pricing, segments                                                          | Core simulation can remain open; connected intelligence/hosting paid                                                                                            | Hosted + self-host where feasible     | Balancy + Machinations                                                       |
| **Intelligence**           | Game Database                          | Research           | Structured catalogue of games, stores, features, mechanics, monetisation and LiveOps observations.                                                                                                                                                                                                                                                                                         | L0 shared data → L3 studio comparison                                                                    | **Foundational:** feeds Pricing, LiveOps, Simulation, Visual Library                            | Public/open data as free as licensing permits; deeper derived intelligence can be paid                                                                          | Hosted + open API/data where possible | Sensor Tower, GameRefinery, AppMagic                                         |
| **Intelligence**           | Monetisation Research                  | Research           | Well-researched analysis of specific monetisation features, games and trends.                                                                                                                                                                                                                                                                                                              | L0 → L3                                                                                                  | **Yes:** features, offers, pricing, screenshots                                                 | Bias toward freely accessible research; advanced/connected intelligence may be paid                                                                             | Hosted                                | Liquid & Grit                                                                |
| **Intelligence**           | LiveOps / Feature Research             | Research           | Analyse how games implement events, features and LiveOps patterns and why they matter.                                                                                                                                                                                                                                                                                                     | L0 → L3                                                                                                  | **Yes:** events, mechanics, Visual Library                                                      | Same open-first direction                                                                                                                                       | Hosted                                | Liquid & Grit, GameRefinery                                                  |
| **Intelligence**           | Benchmarks / Market Intelligence       | Research / Acquire | Compare games/genres/markets using public, derived and opt-in data.                                                                                                                                                                                                                                                                                                                        | L0 generic → L2 studio comparison → L3 connected                                                         | **Yes:** metrics, genres, markets, segments                                                     | Generic benchmarks free where possible; studio-specific comparison/derived data can be paid                                                                     | Hosted                                | Sensor Tower, GameRefinery, AppMagic                                         |
| **Visual Library**         | Game Screenshots                       | Research           | Search game UI by game, genre, feature, mechanic, monetisation pattern or screen type.                                                                                                                                                                                                                                                                                                     | L0                                                                                                       | **Yes:** evidence for Intelligence, LiveOps, Pricing                                            | Broad free access preferred; hosting/search depth may support paid convenience                                                                                  | Hosted                                | Mobbin, Game UI Database                                                     |
| **Visual Library**         | UX Flows                               | Research           | Capture complete flows such as FTUE → gameplay → reward → store rather than isolated screenshots.                                                                                                                                                                                                                                                                                          | L0                                                                                                       | **Yes:** Intelligence and design references                                                     | Open/free bias; advanced search/history/collections may be hosted value                                                                                         | Hosted                                | Mobbin                                                                       |
| **Visual Library**         | Feature / Mechanic Taxonomy            | Research           | Classify screenshots/flows around reusable game concepts such as battle passes, starter packs or daily rewards.                                                                                                                                                                                                                                                                            | L0 → L3                                                                                                  | **Highly:** Intelligence and shared game model                                                  | Core taxonomy should be open where possible                                                                                                                     | Hosted + export/API                   | GameRefinery indirectly                                                      |
| **Simulation**             | Economy Designer                       | Design             | Define currencies, sources, sinks, items, costs, rewards and relationships visually.                                                                                                                                                                                                                                                                                                       | L0/L1 → L4                                                                                               | **Highly:** LiveOps, Pricing, Data                                                              | Core/open and self-hostable direction                                                                                                                           | Hosted + self-host                    | Machinations                                                                 |
| **Simulation**             | Economy Simulator / Balancer           | Design             | Simulate player behaviour to identify inflation, bottlenecks, progression speed and balance problems.                                                                                                                                                                                                                                                                                      | L1 assumptions → L2 data → L4 tuning                                                                     | **Highly:** segments, currencies, offers, events                                                | Core simulation open/free; hosted data-aware intelligence paid                                                                                                  | Hosted + self-host                    | Machinations                                                                 |
| **Simulation**             | Progression Designer                   | Design             | Build XP, level, upgrade-cost and unlock curves visually.                                                                                                                                                                                                                                                                                                                                  | L0/L1 → L3                                                                                               | **Yes:** economy, rewards, segments                                                             | Free/open core                                                                                                                                                  | Hosted + self-host                    | Machinations, spreadsheets                                                   |
| **Simulation**             | Loot / Drop-rate Designer & Simulator  | Design             | Model probabilities, nested loot tables, pity mechanics and run large simulations.                                                                                                                                                                                                                                                                                                         | L0 → L3                                                                                                  | **Yes:** items, rewards, segments                                                               | Free/open core                                                                                                                                                  | Hosted + self-host                    | Machinations, spreadsheets/custom tools                                      |
| **Simulation**             | Player Archetype / Scenario Simulation | Design             | Test the same system against different player behaviours such as casual, payer or studio-defined Whale.                                                                                                                                                                                                                                                                                    | L1 → L4                                                                                                  | **Extremely:** shared personas/segments are core connective tissue                              | Generic archetypes free; persistent studio-specific models create hosted value                                                                                  | Hosted + self-host                    | Machinations / internal models                                               |
| **Publishing & Store Ops** | Release Coordination                   | Operate            | Coordinate everything surrounding a game release/update across stores and GameTuneKit systems without becoming a CI/CD or binary-build platform. Tracks platform versions/rollouts, store readiness, IAP approval, pricing, localisation, store assets, Remote Config, LiveOps events and PNS timing; can flag cross-system conflicts such as an event starting before rollout completion. | L1 planning → L2 connected store/config status → L3 cross-product coordination → L4 tuning/orchestration | **Extremely:** releases, versions, SKUs, prices, markets, LiveOps events, config, PNS campaigns | Core planning/checklist functionality should be useful free/open; managed store connections, monitoring and cross-product coordination are natural hosted value | Hosted + self-host where practical    | App Store Connect, Google Play Console, Steamworks, internal release tooling |
| **Publishing & Store Ops** | Storefront Management                  | Operate            | Maintain the operational representation of a game across storefronts: territories, listing metadata, promotional assets, localisation status, IAP/subscription readiness and release state.                                                                                                                                                                                                | L1 → L3                                                                                                  | **Highly:** Pricing, Intelligence, Visual Library, LiveOps                                      | Open-first; managed integrations/monitoring can be paid                                                                                                         | Hosted + self-host where practical    | App Store Connect, Google Play Console, Steamworks                           |
| **Data & Experimentation** | PNS / Push Notifications               | Operate            | OpenPush/OneSignal-style push using the studio's APNs/FCM credentials: device management, campaigns, scheduling and targeting.                                                                                                                                                                                                                                                             | L1 → L4                                                                                                  | **Highly:** segments, events, offers, experiments                                               | Full useful core free/open; charge for managed hosting/operations/enterprise needs                                                                              | Hosted + self-host                    | OpenPush, OneSignal, FCM/APNs                                                |
| **Data & Experimentation** | Player Identity / Attributes           | Operate            | Common operational representation of a player and game-specific attributes used by connected tools.                                                                                                                                                                                                                                                                                        | L1 → L3                                                                                                  | **Foundational:** segments, PNS, experiments, LiveOps                                           | Core/open                                                                                                                                                       | Hosted + self-host                    | PlayFab, Firebase                                                            |
| **Data & Experimentation** | Segmentation                           | Operate            | Define reusable player groups such as Whale, non-payer, lapsed or high-skill player.                                                                                                                                                                                                                                                                                                       | L1 definitions → L2 data → L4 tuning                                                                     | **One of the primary shared objects**                                                           | Core/open; managed persistence/compute/scale paid                                                                                                               | Hosted + self-host                    | OneSignal, PlayFab, Firebase                                                 |
| **Data & Experimentation** | A/B Testing                            | Operate            | Assign players to variants and test offers, config, economy or features.                                                                                                                                                                                                                                                                                                                   | L2 → L4                                                                                                  | **Highly:** Pricing, LiveOps, Simulation, Engine                                                | Core capability should not be artificially gated; hosted scale/ops paid                                                                                         | Hosted + self-host where practical    | Firebase A/B, PlayFab, Statsig                                               |
| **Data & Experimentation** | Feature Flags / Remote Config          | Operate            | Change or target game configuration without a client release; version, schedule and roll back changes.                                                                                                                                                                                                                                                                                     | L2 → L4                                                                                                  | **Highly:** LiveOps, experiments, Engine                                                        | Open/self-hostable core; managed service paid                                                                                                                   | Hosted + self-host                    | Firebase Remote Config, LaunchDarkly, PlayFab                                |
| **Engine Layer — Future**  | Runtime / Engine Integration           | Design / Operate   | Carry shared GameTune concepts/configuration into Unity/Unreal and eventually allow controlled deployment/tuning.                                                                                                                                                                                                                                                                          | L3 → L4                                                                                                  | **Everything**                                                                                  | Deliberately undecided/deferred                                                                                                                                 | SDK + hosted/self-host backend        | TBD                                                                          |

---

## 5. Shared Game Model — The Connective Tissue

The important integration is not a shared login. GameTuneKit should progressively build a reusable **semantic model of the studio's game**. A concept defined once should be understood across products.

| Shared Object                | Example                                                        | Used by                                                        |
| ---------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Player Segment / Persona** | `Whale = lifetime spend > $500`; non-payer; lapsed; high-skill | PNS, LiveOps, Pricing/LTV, Simulation, experiments, benchmarks |
| **Currency**                 | Gems, Coins, Energy                                            | Simulation, Store/Pricing, Rewards, LiveOps, LTV               |
| **SKU / Product**            | Starter Pack, 500 Gems, Monthly Pass                           | Pricing, LiveOps, LTV, Simulation, Intelligence                |
| **Offer**                    | Whale-only bundle; first-purchase discount                     | Pricing, LiveOps, PNS, Simulation, experiments                 |
| **Reward**                   | 100 Gems + chest + 30 minutes energy                           | Simulation, progression, LiveOps, PNS                          |
| **Event**                    | Halloween 2026; Double XP Weekend                              | LiveOps, PNS, Remote Config, Simulation, Pricing               |
| **Feature / Mechanic**       | Battle Pass, Daily Reward, Guild War                           | Intelligence, Visual Library, LiveOps, experiments             |
| **Metric / KPI**             | LTV, ROAS, retention, payer conversion                         | Utilities, experiments, Intelligence/benchmarks                |
| **Country / Market**         | India, US, Brazil, Japan                                       | Pricing, PNS, acquisition tools, benchmarks                    |
| **Experiment**               | Starter Pack A vs B                                            | Pricing, LiveOps, Simulation, Remote Config                    |
| **Game**                     | The title plus its common definitions                          | Everything                                                     |

### Why this matters commercially

A studio-specific concept such as **Whale** should be created once and then work everywhere. Pricing can model Whale value, LiveOps can target Whale offers, PNS can message Whales, Simulation can model Whale behaviour, and experiments can include/exclude the same segment.

This creates a reason to use the connected/hosted ecosystem **without crippling the free products**. The paid value is persistence, shared context, secure operations, managed infrastructure and connected intelligence.

At L4, the tuning layer can reason over this semantic model rather than merely ingesting raw telemetry. The long-term moat is therefore not “a better calculator”; it is that **GameTuneKit understands how the different systems of a specific game interact**.

---

## 6. Open Data Foundation

**GameTune Open Data** is a foundation beneath several products rather than a standalone product pillar.

Potential sources include public/store-accessible game metadata, historical snapshots, prices/IAP information where exposed, rankings, screenshots, updates, reviews, genres/tags, observable monetisation mechanics and LiveOps observations. GameTuneKit can add its own classifications and research on top.

Where licensing permits, the direction is open/free data and documented APIs. Proprietary estimates such as Sensor Tower-style downloads/revenue/DAU should not be assumed available unless GameTuneKit develops a legitimate source/model for them.

The Visual Library supplies evidence; the Game Database supplies structured information; the Intelligence product supplies interpretation. These are related but distinct outputs from the same foundation.

---

## 7. Reference Products — What to Learn

### Mirava — Pricing & Monetisation

Mirava demonstrates that PPP pricing can grow into a much larger product. Relevant concepts include connecting App Store/Google Play accounts, pulling the product catalogue, auditing regional prices, willingness-to-pay/PPP recommendations, regional and psychological rounding, country overrides, SKU/subscription management, price-history/drift monitoring, cross-store synchronisation and pushing pricing changes.

GameTuneKit's L0 entry can remain a simple PPP/pricing utility while higher Layers progressively understand the studio catalogue and stores.

### Balancy — LiveOps

Balancy is a reference for treating LiveOps as an orchestration/control layer rather than merely a calendar. Relevant concepts include events, currencies/inventory, shops/offers, segmentation, A/B tests, progression, scheduled LiveOps activity and deployment/configuration without builds.

This reinforces that Calendar, Event Designer, Economy Impact and orchestration belong inside one larger LiveOps product.

### Liquid & Grit — Intelligence

Liquid & Grit is important as a model for **researched interpretation**, not merely a database. Its useful pattern is detailed work on specific features, games and trends, backed by visual examples and recommendations.

For GameTuneKit Research, distinguish:

1. **Evidence** — screenshots and UX flows.
2. **Structured information** — searchable games/features/monetisation/LiveOps data.
3. **Interpretation** — researched pieces explaining patterns, significance and conclusions.

### Sensor Tower / GameRefinery / AppMagic — Market Intelligence

References for structured competitive/market intelligence, benchmarks and game-feature data. GameTuneKit should not depend on commercial competitor datasets as its foundation; the goal is to build legitimate public/open/derived data where possible.

### Mobbin / Game UI Database — Visual Reference

References for searchable screenshots and flows. GameTuneKit's distinction is a game-specific taxonomy: FTUE, stores, starter packs, battle passes, daily rewards, events, progression and other game mechanics.

### Machinations — Simulation

Reference for economy design and simulation: sources/sinks, progression, probabilities, player scenarios and system modelling.

### OpenPush — PNS Direction

OpenPush is close to the desired PNS philosophy: use the studio's APNs/FCM credentials and provide the useful push workflow — device/subscription management, segments, templates, scheduling, frequency caps/quiet hours, analytics, API and migration — without making basic push functionality an artificial premium gate.

The GameTuneKit opportunity is to make PNS one participant in the shared game model: a LiveOps event can reuse the same segments, offers, schedules and game concepts.

### SuperTuned — Validation of the Tuning-Layer Thesis

SuperTuned is a useful reference for the long-term connective-tissue thesis: a tuning layer that becomes studio-specific while keeping studio telemetry under studio control. GameTuneKit does not need to copy its exact ML architecture, but the principle fits: **common knowledge can be shared/open; studio knowledge belongs to the studio; models/tools come to that knowledge rather than demanding ownership of it.**

---

## 8. How the Layers Create the Glue

A feature can stay inside the same Product Pillar while progressing vertically through Layers.

Example — **Pricing**:

- **L0:** Anyone uses the PPP calculator anonymously.
- **L1:** The studio defines its currencies, SKUs and markets.
- **L2:** Pricing reads the actual store catalogue/history.
- **L3:** It understands that a LiveOps event contains a Whale-only offer using a particular SKU and reward economy.
- **L4:** The tuning layer can simulate/recommend a pricing or offer change in the context of the game's economy, segments, LiveOps plan and experiments.

Example — **LiveOps**:

- A designer changes the Halloween event.
- Pricing understands the affected offers/SKUs.
- Simulation forecasts economy impact.
- Segmentation supplies the target cohorts.
- PNS understands the associated campaign.
- Remote Config understands the timed configuration changes.
- Experiments can compare variants.
- Eventually the tuning layer reasons across the whole change.

This cross-product understanding is the intended **connective tissue**.

---

## 9. Product Naming

Names are deliberately unresolved. Mythological and astronomical/interstellar naming are both promising, but recognisability matters; product names should not require users to decode an obscure reference to understand what they are using.

`Pricey` is a legacy working name for the Pricing & Monetisation product and can change. Naming should happen after the product boundaries stabilise.

---

## 10. Scope Deliberately Deferred

The Engine Layer is intentionally skipped for the initial initiative. The current work should establish useful Research, Design, Operate and Acquire products plus the shared data model first. Engine/runtime integration can later bring those concepts directly into Unity/Unreal and provide the final operational bridge to the running game.

---

## 11. Common Layers Across GameTuneKit

These are distinct from the L0–L4 commitment/intelligence layers. They are shared domain objects and services that multiple GameTuneKit products can understand and reuse. A studio should define an object such as a cohort, SKU, event or currency once and then reuse it throughout the ecosystem.

| Common layer                     | What it represents                                                                                        | Used by                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Players / Cohorts / Segments** | Whale, payer, non-payer, D7 retained, Level 20+, India, dormant player, or any studio-defined player type | LiveOps, Pricing, Intelligence, Simulation, Data/PNS, potentially Publishing |
| **Game / App Identity**          | Game, platform, bundle/package ID, store IDs, environments and versions                                   | Everything                                                                   |
| **Markets / Geography**          | Country, currency, region, PPP group and store territory                                                  | Pricing, Intelligence, PNS, Publishing, Simulation                           |
| **Products / SKUs**              | IAPs, subscriptions, bundles, virtual goods and real-money prices                                         | Pricing, LiveOps, Intelligence, Simulation, Publishing                       |
| **Game Economy**                 | Soft/hard currencies, items, sources, sinks and exchange/value relationships                              | Simulation, LiveOps, Pricing, Intelligence                                   |
| **Offers & Rewards**             | Starter packs, discounts, login rewards, compensation and event rewards                                   | LiveOps, Pricing, Simulation, Intelligence, PNS                              |
| **Events / Calendar**            | Halloween, tournaments, double XP, sales, seasons and other timed activity                                | LiveOps, Pricing, PNS, Publishing, Intelligence, Simulation                  |
| **Metrics / KPIs**               | LTV, retention, conversion, ARPDAU, ROAS, CPI and related metrics                                         | Utilities, Intelligence, Simulation, Pricing, Experimentation                |
| **Experiments / Variants**       | Control/A/B groups, config variants and offer variants                                                    | Data, LiveOps, Pricing, Simulation                                           |
| **Config / Rules**               | Feature flags, parameters, eligibility rules and schedules                                                | Data, LiveOps, Simulation; eventually Engine                                 |
| **Game Versions / Releases**     | Version, rollout percentage, store approval and compatibility                                             | Publishing, LiveOps, PNS, Config                                             |
| **Taxonomy / Mechanics**         | Battle pass, gacha, daily reward, energy, starter pack, FTUE and other mechanics                          | Intelligence, Visual Library, Simulation, LiveOps                            |
| **Assets / Evidence**            | Screenshots, flows, store creatives and observed implementations                                          | Visual Library, Intelligence, Publishing                                     |
| **Historical State**             | What a price, event, config or storefront looked like at a particular point in time                       | Almost everything                                                            |

### Foundational shared objects

The first common objects to establish should be:

**Game → Segment → Market → SKU**

These recur across the ecosystem while requiring relatively little knowledge of a studio's internal game systems.

A second wave can add:

**Offer → Event → Currency → Reward → Metric**

These give GameTuneKit a much richer semantic understanding of the game and make the L3 Connected Intelligence and L4 Tuning Layer progressively more useful.

A studio-specific cohort is a good example of the business value. If a studio defines **Whale = lifetime spend > $100**, that definition can be reused by PNS, LiveOps, Pricing, Simulation and Experimentation rather than recreated independently in every tool.

---

## 12. Product Complexity and Likely Build Order

Complexity here means the difficulty of delivering a genuinely useful V1, not the maximum sophistication each product could eventually reach.

|   Rank | Product / capability                  | V1 complexity | Studio information required                   | Why                                                                                                          |
| -----: | ------------------------------------- | ------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
|  **0** | **Utilities**                         | ★             | None / manual inputs                          | Primarily formulas, models and good UX                                                                       |
|  **1** | **PNS**                               | ★★            | FCM/APNs credentials plus device registration | APNs/FCM already provide transport; GameTuneKit manages users, devices, campaigns and delivery orchestration |
|  **2** | **Segmentation**                      | ★★            | Player ID plus attributes/tags                | A useful V1 can be straightforward attribute/rule-based segmentation                                         |
|  **3** | **Visual Library**                    | ★★            | Nothing                                       | Technically straightforward; the larger effort is collection, classification and taxonomy                    |
|  **4** | **Pricing & Monetisation**            | ★★–★★★        | Store catalogue; optionally store credentials | PPP calculation is simple; Mirava-style catalogue sync, auditing and store management add complexity         |
|  **5** | **Publishing / Release Coordination** | ★★★           | Store and release information                 | Can start with manually managed release state; integrations progressively increase capability and complexity |
|  **6** | **LiveOps**                           | ★★★           | Events, offers, rewards and segments          | Calendar/planning is relatively simple; useful orchestration increasingly depends on the shared game model   |
|  **7** | **Intelligence**                      | ★★★★          | Nothing from the studio initially             | The software itself is manageable; building and maintaining a useful dataset is the difficult part           |
|  **8** | **A/B Testing / Experimentation**     | ★★★★          | Identity, assignment and outcome data         | Correct assignment, persistence, measurement and interpretation matter                                       |
|  **9** | **Simulation**                        | ★★★★★         | Significant economy/game definition           | Requires a flexible modelling engine, approachable UX and meaningful simulation behaviour                    |
| **10** | **Engine Layer — FUTURE**             | ★★★★★+        | Deep runtime/game integration                 | SDK/runtime compatibility and engine integration; intentionally deferred                                     |

### Why PNS + Segmentation are attractive early products

PNS does not require GameTuneKit to ingest a studio's entire analytics stream. A useful initial model can be limited to:

**App → Player → Device → Push Token → Attributes → Segment → Campaign**

For example, a studio might provide `player_id`, country, level, spender status and lifetime spend. It can then define a reusable **Whale** segment. That same segment can later be consumed by LiveOps, Pricing, Simulation and Experimentation, making PNS/Segmentation an early route to establishing the shared game model without demanding excessive studio data.

The natural infrastructure progression is:

**PNS → Segments → Remote Config → Feature Flags → Experiments**

A practical early-development cluster is therefore:

**Utilities + PNS + Segmentation + Visual Library**

These are not necessarily the eventual flagship products. They are comparatively inexpensive ways to establish traffic, game identity, player identity, reusable segments and the beginnings of the research dataset required by the more complex products.
