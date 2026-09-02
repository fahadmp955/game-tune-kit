# 📝 Agent Context Scratchpad — GameTuneKit

> **Welcome Agent!** This document provides the complete, authoritative operational context for GameTuneKit with a focus on the **Push Notification Service (PNS)**, the live database, backend microservice, frontend state, and how PNS connects with the **Game Economy & Growth Calculators**.

---

## 🌐 1. Live Production Topology & Credentials

- **Frontend Application (Cloudflare Pages):**
  - Production URL: `https://game-tune-kit.pages.dev`
  - GitHub Repo: `fahadmp955/game-tune-kit` (Branch: `main`)
  - Continuous Deployment: Auto-deploys upon push to `main`.
  - API Client Default: Automatically routes to the live Render backend via [`frontend/src/utils/apiConfig.ts`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/utils/apiConfig.ts) (`https://gametune-kit-backend.onrender.com/api/v1`).

- **Backend Microservice (Render.com Web Service):**
  - Live Base URL: `https://gametune-kit-backend.onrender.com`
  - REST API Base: `https://gametune-kit-backend.onrender.com/api/v1`
  - Health & Diagnostics Probe: `GET /api/v1/health`
  - Prometheus Telemetry: `GET /api/v1/metrics`
  - Interactive Swagger Docs: `GET /api/v1/docs`
  - Tenant Isolation Header: `X-Game-Key: <apiKey>` (e.g. `gtk_live_cyberclash_8892`)

- **Database (Supabase Managed PostgreSQL):**
  - Host: `aws-0-ap-south-1.pooler.supabase.com:5432` (AWS Mumbai pooler)
  - Connection Mode: Transaction Pooler via IPv4, `DB_SSL=true` (`rejectUnauthorized: false`).
  - Active Entity Tables: `games`, `segments`, `campaigns`, `players`, `devices`.

---

## 🗄️ 2. Database Schema & Multi-Tenant Entities

```text
┌─────────────────────────┐       ┌────────────────────────────────────────────────────────┐
│          GAMES          │       │                        SEGMENTS                        │
├─────────────────────────┤       ├────────────────────────────────────────────────────────┤
│ id (UUID, PK)           │◄──────│ id (UUID, PK), gameId (FK)                             │
│ name (varchar)          │       │ name (varchar), description (varchar)                  │
│ bundleId (varchar)      │       │ combinator ('AND' | 'OR')                              │
│ apiKey (varchar, unique)│       │ rules (JSON: [{field, operator, value}])               │
│ fcmServiceAccountJson   │       │ cachedReach (integer, e.g. 48200, 2450)                │
│ apnsKeyP8, apnsKeyId    │       └────────────────────────────────────────────────────────┘
│ apnsTeamId              │
└───────────┬─────────────┘
            │
            │                     ┌────────────────────────────────────────────────────────┐
            ├────────────────────►│                       CAMPAIGNS                        │
            │                     ├────────────────────────────────────────────────────────┤
            │                     │ id (UUID, PK), gameId (FK)                             │
            │                     │ name (varchar), title (varchar), body (varchar)        │
            │                     │ targetSegmentId (UUID, nullable)                       │
            │                     │ status ('draft' | 'scheduled' | 'sent')                │
            │                     │ sentCount, successCount, failedCount (integer)         │
            │                     │ data (JSON, e.g. { screen: "dungeon_hub" })            │
            │                     └────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────┐       ┌────────────────────────────────────────────────────────┐
│         PLAYERS         │       │                        DEVICES                         │
├─────────────────────────┤       ├────────────────────────────────────────────────────────┤
│ id (UUID, PK)           │◄──────│ id (UUID, PK), gameId (FK), playerId (FK)              │
│ gameId (FK)             │       │ deviceToken (varchar), platform ('ios'|'android'|'web')│
│ playerId (varchar)      │       │ timezone (varchar), appVersion (varchar)               │
│ attributes (JSON)       │       │ isActive (boolean), lastActiveAt (timestamp)           │
└─────────────────────────┘       └────────────────────────────────────────────────────────┘
```

### Active Studio Tenants in Database:
1. **`Cyber Clash 2088`** (`bundleId: com.studio.cyberclash`, `apiKey: gtk_live_cyberclash_8892`)
2. **`Puzzle Quest Saga`** (`bundleId: com.studio.puzzlequest`, `apiKey: gtk_live_puzzlequest_1024`)
3. **`Realm of Legends RPG`** (`bundleId: com.studio.realmoflegends`, `apiKey: gtk_live_realmoflegends_4096`)
4. **`Default Game Project`** (`bundleId: com.gametune.defaultgame`, `apiKey: gtk_live_0d31c8e4912447eda5b822fe`)

### Seeded Cohort Segments per Game:
- **`All Active Players`** (`device.isActive == true`, `cachedReach: 48,200`)
- **`Whales & High VIPs ($100+)`** (`attributes.lifetimeSpend >= 100`, `cachedReach: 2,450`)
- **`Lapsed Players (7+ Days)`** (`attributes.daysInactive >= 7 AND <= 14`, `cachedReach: 6,890`)
- **`Engaged Non-Payers (Minnows)`** (`attributes.level >= 15 AND attributes.lifetimeSpend == 0`, `cachedReach: 14,200`)
- **`New Install Onboarding (D1 - D3)`** (`attributes.daysSinceInstall <= 3`, `cachedReach: 9,350`)

### Seeded Historical Campaigns per Game:
- **`🎃 Halloween Double XP Weekend`** (Status: `sent`, Sent: 14,200, Delivered: 13,950, Failed: 250)
- **`⚡ Energy Refill Flash Alert`** (Status: `sent`, Sent: 8,400, Delivered: 8,310, Failed: 90)
- **`👑 VIP Exclusive Vault (80% Off)`** (Status: `sent`, Delivered: 2,450, Failed: 0)
- **`🏆 Guild Wars Championship`** (Status: `scheduled`, Sent: 0)

---

## 💻 3. Frontend Architecture (`frontend/src/pages/PnsDashboardPage.tsx`)

The frontend is **100% API-driven with 0 hardcoded fallback arrays**:
1. **Top Bar — Multi-Tenant Game Switcher**:
   - Fetches live games from `GET /api/v1/games`.
   - On selecting a game, immediately fetches that game's isolated cohorts (`GET /api/v1/segments`) and campaigns (`GET /api/v1/campaigns`) using `headers: { 'X-Game-Key': selectedGame.apiKey }`.
2. **Tab 1 — Campaign Composer & Simulator**:
   - **Campaign Preset Selector**: Dropdown listing all saved database campaigns for that game + `✨ + Create New Blank Campaign`. Selecting a preset automatically populates `title`, `body`, `targetSegmentId`, and `deepLinkScreen` (`data.screen`), and shows its status badge (`DISPATCHED` / `SCHEDULED`).
   - **Target Player Cohort Dropdown**: Dynamically renders all live cohorts with exact player reach (e.g. `Whales & High VIPs ($100+) (~2,450 players)`).
   - **Dispatch Button**: Sends real `POST /api/v1/campaigns` request to Render with tenant key, immediately persisting to PostgreSQL and refreshing live logs.
3. **Tab 2 — Instant Test Console (W3C Web Push & Mobile)**:
   - **Web Push Registration**: 1-click browser push registration (`subscribeToWebPush()`) requesting RFC 8292 VAPID public key from `GET /api/v1/web-push/public-key` and registering device in `POST /api/v1/devices/register`.
   - **Test Send**: Calls `POST /api/v1/campaigns/test-send` and displays gateway dispatch metadata with direct desktop notification fallback.
4. **Tab 3 — Cohorts & Segments**:
   - Renders live rule logic cards and cached audience reach.
   - **"+ Create New Cohort" modal**: Dispatches `POST /api/v1/segments` to create custom rule logic dynamically.
5. **Tab 4 — Delivery History & Analytics**:
   - Real-time KPI cards calculated dynamically from live database campaigns:
     - `Total Notifications Sent`: $\sum(\text{campaigns.sentCount})$
     - `Delivery Success Rate`: $\frac{\sum(\text{successCount})}{\sum(\text{sentCount})} \times 100\%$
     - `Campaigns Executed`: $\text{campaigns.length}$
     - `Registered Cohorts`: $\text{cohorts.length}$
   - Live historical table displaying all dispatched campaigns, status badges, delivery counts, and timestamps.

---

## 🔗 4. How to Sync PNS with GameTuneKit Calculators (For Incoming Agent)

GameTuneKit includes four core growth and economic calculators in [`frontend/src/engine/`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/):
1. **LTV & Revenue Calculator** ([`frontend/src/engine/calculators.ts`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/calculators.ts))
2. **Retention Curve & Decay Model**
3. **Virality & K-Factor Engine**
4. **Ad ROAS & Payback Simulator**

### Synchronization Touchpoints Between PNS and Calculators:

#### 1. LTV & Revenue Forecasting Sync
- **The Concept**: When a studio sends a monetization push (e.g., `👑 VIP Exclusive Vault (80% Off)` or `Engaged Non-Payers Starter Pack`), the revenue impact can be projected directly using the LTV model.
- **Formulas**:
  $$\text{Target Audience} = \text{Segment.cachedReach}$$
  $$\text{Estimated Conversions} = \text{cachedReach} \times \text{Push Open Rate (e.g. 8\%)} \times \text{Offer Conversion Rate (e.g. 5\%)}$$
  $$\text{Direct Campaign Revenue} = \text{Conversions} \times \text{Offer Price (e.g. \$4.99)}$$
  $$\Delta \text{ARPPU Uplift} = \frac{\text{Direct Campaign Revenue}}{\text{Active Spenders}}$$
- **Integration**: PNS Composer can include a small live widget: *"Projected Revenue Impact: +$1,220 with 8% open rate based on your LTV parameters."*

#### 2. Retention Decay & Re-Engagement Uplift Sync
- **The Concept**: Lapsed player campaigns (`Lapsed Players (7+ Days)`) directly alter the game's retention curve ($\text{Ret}(t) = a \cdot t^{-b}$).
- **The Mechanism**: Re-engaging 6,890 lapsed players shifts the retention curve baseline, lifting D14 and D30 retention by an estimated $+1.5\%$ to $+3.2\%$.
- **Integration**: Allow the Retention Calculator to import cohort counts from PNS: *"Active PNS Re-engagement Campaign applied: D7 Retention boosted from 22% $\to$ 24.5%"*.

#### 3. Virality & K-Factor Synchronization
- **The Concept**: Broadcast push notifications for weekend guild tournaments or friend gift events (`screen: "guild_hall"`) trigger viral referral loops.
- **The Mechanism**: A broadcast to 48,200 active players with invite incentives increases the invite sending rate ($i$) and conversion rate ($c$), yielding $\Delta K = i \times c$.
- **Integration**: Tie PNS Guild / Social push templates directly into the Virality Calculator's $K$-Factor slider.

#### 4. Shared Attribute Contract
The attributes stored on `Player.attributes` match 1:1 with calculator inputs:
- `lifetimeSpend` $\longleftrightarrow$ LTV historical spender tiers
- `daysInactive` $\longleftrightarrow$ Retention decay inflection point
- `level` $\longleftrightarrow$ Game progression and monetization readiness
- `country` / `timezone` $\longleftrightarrow$ Regional ARPU and Quiet Hours compliance

---

## 🛠️ 5. Key File Locations & References

- **Backend Controllers & Services**:
  - Campaigns: [`backend/src/modules/campaigns/campaigns.controller.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/modules/campaigns/campaigns.controller.ts) & [`campaigns.service.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/modules/campaigns/campaigns.service.ts)
  - Segments: [`backend/src/modules/segments/segments.controller.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/modules/segments/segments.controller.ts) & [`segments.service.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/modules/segments/segments.service.ts)
  - Web Push: [`backend/src/modules/web-push/web-push.service.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/modules/web-push/web-push.service.ts) & [`web-push.controller.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/modules/web-push/web-push.controller.ts)
  - Push Ports & Adapters: [`backend/src/ports/push-adapter.resolver.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/ports/push-adapter.resolver.ts) & [`adapters/web-push.adapter.ts`](file:///Users/fahadchougle/Work/game-tune-kit/backend/src/ports/adapters/web-push.adapter.ts)
- **Frontend Dashboard**:
  - Main Page: [`frontend/src/pages/PnsDashboardPage.tsx`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/pages/PnsDashboardPage.tsx)
  - API Base Config: [`frontend/src/utils/apiConfig.ts`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/utils/apiConfig.ts)
  - Web Push Client: [`frontend/src/utils/webPushManager.ts`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/utils/webPushManager.ts) & [`frontend/public/sw.js`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/public/sw.js)
  - Calculators Engine: [`frontend/src/engine/calculators.ts`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/calculators.ts) & [`ltvCalculator.ts`](file:///Users/fahadchougle/Work/game-tune-kit/frontend/src/engine/ltvCalculator.ts)
