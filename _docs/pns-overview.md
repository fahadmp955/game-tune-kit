# 📲 GameTuneKit — Push Notification Service (PNS) Context & Overview

## 📌 1. Executive Summary & Product Thesis
*(Extracted from `_docs/game-tune-kit-overview.md` §7, §8, and §9)*

**PNS (Push Notification Service)** is the operational messaging foundation of GameTuneKit. It provides an open, developer-controlled, studio-owned push notification and campaign management platform that interfaces directly with **Apple APNs**, **Google FCM**, and **W3C Web Push** using the studio's own credentials.

### The OpenPush Philosophy ("Planka, not Trello")
Traditional marketing platforms (OneSignal, Braze, Airship) charge exorbitant per-subscriber or per-MAU tiers, gating basic push delivery behind artificial enterprise paywalls. 

GameTuneKit adopts the **OpenPush philosophy**:
- **Transport is a Commodity:** Apple (APNs), Google (FCM), and browsers (W3C Web Push) already provide push transport for free.
- **Studio-Owned Credentials:** The studio supplies their own APNs `.p8` key, Firebase Service Account JSON, or VAPID keys. GameTuneKit manages users, devices, templates, scheduling, and delivery orchestration without charging per-message markup.
- **Data Sovereignty:** Studio telemetry and player identities remain under studio control.

---

## 🏛️ 2. Core Architectural Model

PNS establishes the first persistent operational connection between GameTuneKit, game clients, and player cohorts:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER                                  │
│              [Game Client: Unity / Mobile (iOS, Android) / Web]             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
               POST /api/v1/devices/register & /players/attributes
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NESTJS BACKEND MICROSERVICE                          │
│                                                                             │
│  ┌───────────────────────────┐           ┌───────────────────────────────┐  │
│  │   API Ingestion Gateway   │──────────►│  Supabase PostgreSQL Database │  │
│  └─────────────┬─────────────┘           └───────────────────────────────┘  │
│                │                                                            │
│                ▼                                                            │
│  ┌───────────────────────────┐           ┌───────────────────────────────┐  │
│  │  BullMQ / Delivery Queue  │──────────►│ NotificationPushPort (Domain) │  │
│  └───────────────────────────┘           └───────────────┬───────────────┘  │
│                                                          │                  │
│                                           PushAdapterResolver               │
│                                                          │                  │
│               ┌──────────────────────────┬───────────────┼───────────────┐  │
│               ▼                          ▼               ▼               ▼  │
│      ┌─────────────────┐        ┌─────────────────┐ ┌─────────┐ ┌─────────┐ │
│      │ FcmPushAdapter  │        │ ApnsPushAdapter │ │ WebPush │ │ Mock    │ │
│      └────────┬────────┘        └────────┬────────┘ └────┬────┘ └─────────┘ │
│               │                          │               │                  │
└───────────────┼──────────────────────────┼───────────────┼──────────────────┘
                │                          │               │
                ▼                          ▼               ▼
┌────────────────────────────────┐ ┌────────────────┐ ┌─────────────────────┐
│   Google Firebase FCM (v1)     │ │ APNs (HTTP/2)  │ │ W3C Web Push (VAPID)│
└────────────────────────────────┘ └────────────────┘ └─────────────────────┘
```

---

## 🌐 3. The "Shared Game Model" Connection
*(Extracted from `_docs/game-tune-kit-overview.md` §5 & §6)*

In typical game stacks, push notifications live in an isolated marketing silo that knows nothing about the game's economy, pricing, or LiveOps. In GameTuneKit, **PNS is an active participant in the Shared Game Model**:

| Shared Entity | Studio Example | How PNS Uses It Across the Ecosystem |
|---|---|---|
| **Player Segment / Persona** | `Whale = lifetime spend > $100`<br>`Lapsed = inactive >= 7 days` | Defined **once**, then reused everywhere: PNS messages Whales, LiveOps targets Whale offers, Pricing evaluates Whale LTV, and Experiments test Whale variants. |
| **Offers & Packs** | Whale-only bundle, First-purchase starter pack (80% off) | PNS sends targeted discount reminders with localized currency pricing before the offer expires. |
| **Rewards & Currency** | 100 Gems + Rare Chest + 30 min infinite energy | PNS delivers compensation or daily login reward claim notifications directly tied to in-game currency items. |
| **Events & Calendar** | Halloween 2026, Double XP Weekend, Weekend Raid | PNS triggers countdown alarms and event launch notifications synchronized with the LiveOps calendar. |
| **Store & Release Ops** | App Version 1.4.0 rollout at 25% | PNS cross-checks rollout progress to prevent notifying players about new features before their app update is live in their region. |

---

## 🎯 4. Why PNS + Segmentation are the Ideal Layer 1 Product
*(Extracted from `_docs/game-tune-kit-overview.md` §9)*

### Data Minimization Principle
PNS does **not** require GameTuneKit to ingest a studio's high-volume analytics stream (like GameAnalytics, Mixpanel, or Amplitude). A complete operational push system requires only a lightweight pipeline:

$$\text{App} \longrightarrow \text{Player} \longrightarrow \text{Device} \longrightarrow \text{Push Token} \longrightarrow \text{Attributes} \longrightarrow \text{Segment} \longrightarrow \text{Campaign}$$

A studio only needs to provide:
1. `playerId`
2. `deviceToken` & platform (`ios` / `android` / `web`)
3. Optional attributes: `country`, `level`, `spenderStatus`, `lifetimeSpend`

### The Infrastructure Evolution Ladder
PNS serves as the natural bridge from offline calculators to live operational tooling:

$$\textbf{Utilities (L0)} \longrightarrow \textbf{PNS \& Devices (L1)} \longrightarrow \textbf{Segments (L2)} \longrightarrow \textbf{Remote Config (L3)} \longrightarrow \textbf{LiveOps \& Experiments (L4)}$$

GameTuneKit's strategic initial product cluster is:
$$\textbf{Utilities} + \textbf{PNS} + \textbf{Segmentation} + \textbf{Visual Library}$$

---

## 👥 5. Setting Up Cohorts & Player Segments

### The Universal Rule Filter Engine
A cohort is defined by a compound array of boolean rules evaluated against player attributes and device metadata:

```json
{
  "name": "Whales & High VIPs ($100+)",
  "description": "High-value spenders with lifetime spend >= $100",
  "combinator": "AND",
  "rules": [
    { "field": "attributes.lifetimeSpend", "operator": ">=", "value": 100 },
    { "field": "device.isActive", "operator": "==", "value": true }
  ],
  "cachedReach": 2450
}
```

### Supported Operators
- Numerical comparison: `==`, `!=`, `>`, `>=`, `<`, `<=`
- Array containment: `in`, `contains`
- String matching: case-insensitive substring search

---

## ⚙️ 6. Key Operational Rules & Guardrails

1. **Quiet Hours:** Automatic suppression of non-critical push notifications between 10:00 PM and 8:00 AM in the recipient's local timezone.
2. **Frequency Capping:** Default limit of **1 push per player per 24 hours** (configurable per campaign priority) to prevent player churn and push burnout.
3. **Timezone-Aware Scheduling:** Campaigns scheduled for "7:00 PM Friday" are dispatched in progressive hourly waves matching each user's local timezone.
4. **Token Hygiene & Pruning:** Instant unregistration of dead or uninstalled device tokens upon receiving `410 Gone` (APNs/WebPush) or `UNREGISTERED` (FCM) responses.

---

## 🔌 7. Port-Adapter-Resolver Implementation
*(Adheres to `.agents/skills/backend-architecture`)*

* **Port (`NotificationPushPort`):** Interface defining `send(message: PushMessage): Promise<PushResult>`.
* **Adapters:**
  * `FcmPushAdapter`: Google FCM HTTP v1 REST API with OAuth2 / Service Account JWT.
  * `ApnsPushAdapter`: Apple APNs HTTP/2 client authenticated with `.p8` private key tokens.
  * `WebPushAdapter`: Native W3C Web Push Protocol (RFC 8030) using VAPID public-key encryption (RFC 8292). Delivers encrypted payloads directly to browser push gateways (Google FCM Web, Mozilla Autopush, Apple Web Push) with background Service Worker (`sw.js`) execution.
  * `MockPushAdapter`: In-memory sandbox adapter for zero-credential local development and automated CI testing.
* **Resolver (`PushAdapterResolver`):** Dynamically inspects device platform (`ios` vs `android` vs `web`) and credentials to route payloads cleanly.

---

## 🏢 8. Multi-Game (Multi-Tenant) Architecture

GameTuneKit is designed as a **multi-game studio platform**. Every database table is strictly scoped with a foreign key:
* `games`: `id`, `name`, `bundleId`, `apiKey`.
* `players`: `(game_id, player_id)` unique composite index.
* `devices`: `(game_id, device_token)` — device tokens and push registration remain 100% segregated.
* `segments`: Cohorts created for Game A (e.g. *"Level 50 Cyber Knights"*) never pollute Game B (*"Level 50 Gem Matchers"*).
* `campaigns`: Campaigns target only devices belonging to that specific game.

### Client API Authentication via Game Keys
Each game client passes its specific Game API Key in requests:
```http
POST /api/v1/devices/register
X-Game-Key: gtk_live_cyberclash_8892
Content-Type: application/json

{
  "playerId": "user_7482",
  "deviceToken": "token_abc...",
  "platform": "android"
}
```

---

## 🖥️ 9. 100% Dynamic Dashboard & Audience Caching

The PNS Studio dashboard (`frontend/src/pages/PnsDashboardPage.tsx`) is **100% API-driven with zero hardcoded mock arrays**:

### A. Campaign Preset / Template Selector
Located at the top of the **Campaign Composer & Simulator**, this selector allows game teams to pick from saved database campaigns or start from scratch:
- Selecting a campaign auto-populates `title`, `body`, `targetSegmentId`, and `deepLinkScreen` (`data.screen`).
- Displays a status badge indicating whether it is `DISPATCHED` (with sent count) or `SCHEDULED`.
- Provides a **"+ New Blank Campaign"** button to reset the form.

### B. The `cachedReach` Lifecycle in PostgreSQL
Evaluating complex compound rules across 500,000+ player records is computationally heavy. Therefore, `segments.cachedReach` provides instant audience estimation, updated through:
1. **Campaign Dispatch:** When a campaign is dispatched, the exact count of deliverable players is evaluated and persisted back to `cachedReach`.
2. **Cohort Creation:** When saved via `POST /api/v1/segments`, the audience is computed from current players.
3. **On-Demand Probe (`GET /api/v1/segments/:id/reach`):** Evaluates live matching players and updates the database cache.

### C. Live Delivery History & Analytics
Computes real-time KPI metrics from all campaigns in PostgreSQL:
- $\text{Total Sent} = \sum(\text{campaigns.sentCount})$
- $\text{Delivery Success Rate} = \frac{\sum(\text{successCount})}{\sum(\text{sentCount})} \times 100\%$
- Displays an interactive table of all historical and scheduled dispatches.

---

## 🔗 10. PNS $\longleftrightarrow$ Calculators Synchronization (Guide for Agents)

GameTuneKit's 36 standalone calculators ([`frontend/src/engine/`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/)) directly connect to PNS operational workflows:

```text
┌─────────────────────────┐                                ┌─────────────────────────┐
│       PNS STUDIO        │                                │   GROWTH CALCULATORS    │
├─────────────────────────┤                                ├─────────────────────────┤
│ Target Segment Reach    │─────── [Audience Size] ───────►│ LTV & Revenue Model     │
│ (e.g., 2,450 Whales)    │                                │ (Projected Conversion)  │
│                         │                                │                         │
│ Lapsed Player Campaign  │─── [Re-engagement Rate] ────►│ Retention Curve Model   │
│ (daysInactive >= 7)     │                                │ (D7 / D14 / D30 Uplift) │
│                         │                                │                         │
│ Guild / Referral Alert  │──── [Viral Invite Rate] ─────►│ Virality & K-Factor     │
│ (screen: "guild_hall")  │                                │ (Invite Loop Boost)     │
└─────────────────────────┘                                └─────────────────────────┘
```

### 1. LTV & Revenue Projection Sync
When composing a monetization campaign (e.g. `👑 VIP Exclusive Vault (80% Off)`):
- **Audience:** `Segment.cachedReach` (e.g. 2,450 players).
- **Projected Purchases:** $\text{cachedReach} \times \text{Push Open Rate (8\%)} \times \text{Conversion (5\%)} = 9.8 \approx 10\text{ sales}$.
- **Projected Revenue:** $10 \times \$4.99 = \$49.90$.
- **Sync Point:** The PNS Composer can render a live forecast card referencing parameters from the **LTV Calculator**.

### 2. Retention Curve & Re-Engagement Uplift
- Re-engaging 6,890 lapsed players shifts the retention curve baseline ($\text{Ret}(t) = a \cdot t^{-b}$).
- **Sync Point:** The **Retention Calculator** can ingest PNS re-engagement campaign metrics to model the retention curve uplift (e.g. D14 retention $+2.1\%$).

### 3. Virality & Social Referral Synchronization
- Broadcast pushes announcing guild events or referral rewards directly increase the invite rate per user ($i$).
- **Sync Point:** When a social campaign is active, the **Virality Calculator** can adjust the baseline $K$-Factor ($\Delta K = i \times c$).

### 4. Shared Attribute Contract
The attributes stored on `Player.attributes` match 1:1 with calculator inputs:
- `lifetimeSpend` $\longleftrightarrow$ LTV historical spender tiers
- `daysInactive` $\longleftrightarrow$ Retention decay inflection point
- `level` $\longleftrightarrow$ Player progression & monetization readiness
- `country` / `timezone` $\longleftrightarrow$ Regional ARPU & Quiet Hours compliance

---

## 🌐 11. Production Verification & Endpoints

| Resource | URL | Status |
| :--- | :--- | :---: |
| **Cloudflare Frontend** | `https://game-tune-kit.pages.dev` | Live |
| **Render Backend Base** | `https://gametune-kit-backend.onrender.com` | Live |
| **Health Probe** | `GET /api/v1/health` | `200 OK` |
| **Prometheus Metrics** | `GET /api/v1/metrics` | `200 OK` |
| **Swagger API Docs** | `GET /api/v1/docs` | Live |
| **Public VAPID Key** | `GET /api/v1/web-push/public-key` | `200 OK` |
| **Supabase PostgreSQL** | `aws-0-ap-south-1.pooler.supabase.com:5432` | Connected |
