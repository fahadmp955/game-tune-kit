# 📲 GameTuneKit — Push Notification Service (PNS) Context & Overview

## 📌 1. Executive Summary & Product Thesis
*(Extracted from `_docs/game-tune-kit-overview.md` §7, §8, and §9)*

**PNS (Push Notification Service)** is the operational messaging foundation of GameTuneKit. It provides an open, developer-controlled, studio-owned push notification and campaign management platform that interfaces directly with **Apple APNs** and **Google FCM** using the studio's own credentials.

### The OpenPush Philosophy ("Planka, not Trello")
Traditional marketing platforms (OneSignal, Braze, Airship) charge exorbitant per-subscriber or per-MAU tiers, gating basic push delivery behind artificial enterprise paywalls. 

GameTuneKit adopts the **OpenPush philosophy**:
- **Transport is a Commodity:** Apple (APNs) and Google (FCM) already provide push transport for free.
- **Studio-Owned Credentials:** The studio supplies their own APNs `.p8` key and Firebase Service Account JSON. GameTuneKit manages users, devices, templates, scheduling, and delivery orchestration without charging per-message markup.
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
│  │   API Ingestion Gateway   │──────────►│     PostgreSQL Database       │  │
│  └─────────────┬─────────────┘           └───────────────────────────────┘  │
│                │                                                            │
│                ▼                                                            │
│  ┌───────────────────────────┐           ┌───────────────────────────────┐  │
│  │  BullMQ / Delivery Queue  │──────────►│ NotificationPushPort (Domain) │  │
│  └───────────────────────────┘           └───────────────┬───────────────┘  │
│                                                          │                  │
│                                           PushAdapterResolver               │
│                                                          │                  │
│               ┌──────────────────────────┬───────────────┴───────────────┐  │
│               ▼                          ▼                               ▼  │
│      ┌─────────────────┐        ┌─────────────────┐             ┌─────────────────┐ │
│      │ FcmPushAdapter  │        │ ApnsPushAdapter │             │ MockPushAdapter │ │
│      └────────┬────────┘        └────────┬────────┘             │   (Dev / Test)  │ │
│               │                          │                      └─────────────────┘ │
└───────────────┼──────────────────────────┼──────────────────────────────────────────┘
                │                          │
                ▼                          ▼
┌────────────────────────────────┐ ┌────────────────────────────────┐
│   Google Firebase FCM (v1)     │ │     Apple APNs (HTTP/2)        │
└────────────────────────────────┘ └────────────────────────────────┘
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

Cohorts in GameTuneKit are **dynamic, rule-based player filters** defined once and evaluated in real time.

### A. How Cohort Data is Ingested
When a game client connects, it sends player attributes along with the device token via:
`POST /api/v1/devices/register` or `POST /api/v1/players/attributes`:

```json
{
  "playerId": "usr_10482",
  "country": "US",
  "timezone": "America/Los_Angeles",
  "platform": "ios",
  "appVersion": "1.2.0",
  "attributes": {
    "level": 28,
    "lifetimeSpend": 124.50,
    "isSpender": true,
    "vipTier": 3,
    "guildMember": true,
    "lastPurchaseDate": "2026-08-15"
  }
}
```

### B. The 3 Dimensions of Cohort Targeting

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COHORT TARGETING DIMENSIONS                       │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ 1. Device & Geographic   │ 2. Lifecycle & Activity  │ 3. Economic & Game    │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ • Platform (iOS/Android) │ • Days Inactive (Lapsed) │ • Lifetime Spend ($)  │
│ • Country / Territory    │ • Install Cohort Date    │ • Player Level        │
│ • App Version (Outdated) │ • Session Count          │ • VIP Tier / Spender  │
│ • Timezone Offset        │ • Churn Risk Prediction  │ • Virtual Balance     │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

### C. Cohort Rule Structure (JSON Definition)
Cohorts are stored in the `segments` table as flexible, compound JSON rules:

```json
{
  "name": "Lapsed Whales",
  "description": "High-value spenders inactive for 7 or more days",
  "combinator": "AND",
  "rules": [
    { "field": "attributes.lifetimeSpend", "operator": ">=", "value": 100 },
    { "field": "daysInactive", "operator": ">=", "value": 7 },
    { "field": "device.isActive", "operator": "==", "value": true }
  ]
}
```

### D. Default Pre-Configured Cohort Templates
GameTuneKit provides out-of-the-box templates so studios don't start from scratch:

1. **Whales & VIPs:** Spenders with lifetime spend > \$100 (triggers exclusive pack previews & VIP events).
2. **Lapsed Players (D7 / D14 / D30):** Registered users who have not opened the game in 7+ days (triggers re-engagement comeback gifts).
3. **Engaged Non-Payers (Minnows):** Players with Level >= 15 and \$0 spend (triggers high-discount 80% starter pack offers).
4. **Outdated App Version:** Players on app versions older than the latest store release (triggers update reminder notifications).

### E. How Campaigns Target Cohorts at Runtime
1. In the **PNS Campaign Composer**, the studio selects a target cohort from a dropdown.
2. The UI calculates **Live Estimated Reach** (e.g., *"Targets ~4,250 eligible active devices"*).
3. At dispatch time, the backend dynamically queries the matching active device tokens, applies **Quiet Hours** and **Frequency Capping**, and enqueues the messages.

### F. Creating a New Custom Cohort (Step-by-Step)
You can create new cohorts at any time through the **Visual Cohort Builder** in the dashboard or via the **REST API**:

#### 1. In the GameTuneKit UI (Visual Builder)
1. In the PNS Dashboard, navigate to **Cohorts / Segments** and click **"+ Create New Cohort"**.
2. **Name & Description:** e.g., *"Guild Masters Level 40+"*.
3. **Add Filter Conditions:** Use dropdowns to pick any standard or custom attribute:
   - `Field`: e.g., `level`, `lifetimeSpend`, `country`, `daysInactive`, `guildMember`.
   - `Operator`: `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `contains`.
   - `Value`: e.g., `40`, `true`, `["US", "CA", "UK"]`.
4. **Group Rules:** Combine rules with `AND` (all conditions must match) or `OR` (any condition matches).
5. **Preview Estimated Reach:** Click **"Calculate Live Reach"** to immediately see how many active devices qualify in your database.
6. **Save:** Once saved, the new cohort instantly appears in your Campaign Composer targeting dropdown.

#### 2. Programmatically via REST API
Your game backend, analytics pipeline, or LiveOps scripts can register cohorts automatically:

```bash
curl -X POST http://localhost:3000/api/v1/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Brazil High Churn Risk",
    "description": "Brazilian players inactive for 5+ days with high gold balance",
    "combinator": "AND",
    "rules": [
      { "field": "country", "operator": "==", "value": "BR" },
      { "field": "daysInactive", "operator": ">=", "value": 5 },
      { "field": "attributes.goldBalance", "operator": ">=", "value": 500 }
    ]
  }'
```

#### 3. Zero-Migration Custom Attributes
If your game introduces a new metric tomorrow (e.g., `hasBattlePass: true`, `heroType: "Mage"`), you **do not** need a database migration. The backend stores player attributes as dynamic JSON, so any new key sent by the game is immediately queryable in the Cohort Builder.

---

## ⚙️ 6. Key Operational Rules & Guardrails

1. **Quiet Hours:** Automatic suppression of non-critical push notifications between 10:00 PM and 8:00 AM in the recipient's local timezone.
2. **Frequency Capping:** Default limit of **1 push per player per 24 hours** (configurable per campaign priority) to prevent player churn and push burnout.
3. **Timezone-Aware Scheduling:** Campaigns scheduled for "7:00 PM Friday" are dispatched in progressive hourly waves matching each user's local timezone.
4. **Token Hygiene & Pruning:** Instant unregistration of dead or uninstalled device tokens upon receiving `410 Gone` (APNs) or `UNREGISTERED` (FCM) responses.

---

## 🔌 7. Port-Adapter-Resolver Implementation
*(Adheres to `.agents/skills/backend-architecture`)*

* **Port (`NotificationPushPort`):** Interface defining `send(message: PushMessage): Promise<PushResult>`.
* **Adapters:**
  * `FcmPushAdapter`: Google FCM HTTP v1 REST API with OAuth2 / Service Account JWT.
  * `ApnsPushAdapter`: Apple APNs HTTP/2 client authenticated with `.p8` private key tokens.
  * `WebPushAdapter`: Native W3C Web Push Protocol (RFC 8030) using VAPID public-key encryption (RFC 8292). Delivers encrypted payloads directly to browser push gateways (Google FCM Web, Mozilla Autopush, Apple Web Push) with background Service Worker (`sw.js`) execution.
  * `MockPushAdapter`: In-memory sandbox adapter for zero-credential local development and automated CI testing.
* **Resolver (`PushAdapterResolver`):** Dynamically inspects device platform (`ios` vs `android` vs `web`) and `.env` flags to route payloads cleanly.

---

## 🏢 8. Multi-Game (Multi-Tenant) Architecture

GameTuneKit is designed from the ground up as a **multi-game studio platform**. A studio can manage 1 game or 50 games from a single instance:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STUDIO / TENANT ACCOUNT                          │
│                                                                             │
│   ┌───────────────────────────┐           ┌───────────────────────────────┐ │
│   │   🎮 Game A: "CyberClash" │           │   🧩 Game B: "PuzzleQuest"    │ │
│   │   Bundle: com.std.clash   │           │   Bundle: com.std.puzzle      │ │
│   │   FCM: Key A | APNs: .p8  │           │   FCM: Key B | APNs: .p8      │ │
│   └─────────────┬─────────────┘           └───────────────┬───────────────┘ │
│                 │                                         │                 │
│                 ▼                                         ▼                 │
│   ┌───────────────────────────┐           ┌───────────────────────────────┐ │
│   │ Players, Devices, Cohorts │           │ Players, Devices, Cohorts     │ │
│   │ & Campaigns for Game A    │           │ & Campaigns for Game B        │ │
│   └───────────────────────────┘           └───────────────────────────────┘ │
│                                                                             │
│                 ▲                                         ▲                 │
│                 └─────────────────┬───────────────────────┘                 │
│                                   │                                         │
│                       STUDIO PORTFOLIO MANAGER                              │
│                • Cross-Game Promotion Campaigns                             │
│                • Global Studio Game Switcher Dropdown                       │
│                • Portfolio-wide Whale & Spender Analytics                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### A. Database Scoping (`game_id` on every entity)
Every database table is strictly scoped with a foreign key:
* `games`: `id`, `name`, `bundleId`, `createdAt`.
* `game_credentials`: Encrypted APNs (`.p8`, Team ID, Key ID) and FCM Service Account JSON per game.
* `players`: `(game_id, player_id)` unique composite index.
* `devices`: `(game_id, device_token)` — device tokens and push registration remain 100% segregated.
* `segments`: Cohorts created for Game A (e.g. *"Level 50 Cyber Knights"*) never pollute Game B (*"Level 50 Gem Matchers"*).
* `campaigns`: Campaigns target only devices belonging to that specific game.

### B. Client API Authentication via Game Keys
Each game client passes its specific Game API Key in requests:
```http
POST /api/v1/devices/register
X-Game-Key: gtk_live_app_cyberclash_84920482
Content-Type: application/json

{
  "playerId": "user_7482",
  "deviceToken": "token_abc...",
  "platform": "android"
}
```
The backend gateway middleware resolves the `X-Game-Key` to the corresponding `game_id` automatically, ensuring complete isolation.

### C. Studio Dashboard Experience
1. **Game Switcher Dropdown:** In the top navigation bar, users switch seamlessly between active games (`[ 🎮 Cyber Clash ▼ ]` -> `[ 🧩 Puzzle Quest ]`).
2. **Game Settings & Credential Vault:** Each game has its own credentials tab where developers upload that game's APNs `.p8` file and FCM JSON.
3. **Cross-Promotion Superpower:** Studios can create cross-game campaigns: e.g., target *"Lapsed Players in Game A"* with a push notification inviting them to install *"Game B with a 500-gem welcome gift"*.

