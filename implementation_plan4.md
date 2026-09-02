# Implementation Plan — GameTuneKit Push Notification Service (PNS)

This document outlines the end-to-end plan to implement the **Push Notification Service (PNS)** for GameTuneKit, encompassing credential acquisition, a production-grade **NestJS backend microservice** (adhering to `.agents/skills/backend-architecture`), dashboard UI, and automated subagent testing.

---

## 🔑 Part 1: Steps to Acquire Required Push Credentials

The studio connects their own push accounts to maintain zero per-message vendor fees:

### 1. Google Firebase Cloud Messaging (Android & Web Push)
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g. `gametune-kit-prod`).
3. Click **Project Settings** (gear icon) → **Service Accounts** tab.
4. Select **Node.js** and click **Generate new private key**.
5. Save the downloaded JSON file (e.g., `firebase-service-account.json`).
   - Required fields extracted: `project_id`, `client_email`, `private_key`.
6. *(Optional Web Push)*: Under **Project Settings** → **Cloud Messaging** tab → **Web Configuration**, click **Generate Key Pair** to get your **VAPID Key**.

### 2. Apple Push Notification service (APNs — iOS)
1. Sign in to the [Apple Developer Member Center](https://developer.apple.com/account).
2. Go to **Certificates, Identifiers & Profiles** → **Keys**.
3. Click the **+** button to create a new key.
4. Enter Key Name (e.g. `GameTuneKit APNs Key`), check **Apple Push Notifications service (APNs)**, and click **Continue** → **Register**.
5. Download the `.p8` key file (e.g., `AuthKey_ABCD1234EF.p8`). Note: Apple only allows downloading this once.
6. Note down:
   - **Key ID:** 10-character string (e.g. `ABCD1234EF`).
   - **Team ID:** Found in the top right corner of your Apple Developer account.
   - **App Bundle ID:** Your game's bundle identifier (e.g. `com.gametune.kit`).

> [!NOTE]
> During local development, the backend will feature a **`MockPushAdapter`** so you can develop, test, and preview push workflows without needing live APNs/FCM credentials immediately!

---

## 🏗️ Part 2: Backend Architecture (`backend/`)

Built strictly to `.agents/skills/backend-architecture` specifications:
- **Framework:** NestJS 10 + TypeScript + TypeORM.
- **Database:** PostgreSQL (with SQLite fallback for local development).
- **Architecture Pattern:** Port-Adapter-Resolver.

```text
backend/
├── src/
│   ├── common/                 # Global filters, logging interceptor, DTOs
│   │   ├── exceptions/http-exception.filter.ts
│   │   ├── interceptors/logging.interceptor.ts
│   │   └── dto/api-response.dto.ts
│   ├── config/                 # Env validation with class-validator
│   ├── database/               # TypeORM DataSource & migrations
│   ├── modules/
│   │   ├── health/             # GET /api/v1/health probe
│   │   ├── telemetry/          # GET /api/v1/metrics (Prometheus)
│   │   ├── devices/            # POST /api/v1/devices/register
│   │   ├── players/            # Player attributes & metadata
│   │   ├── segments/           # Cohort query & segmentation rules
│   │   └── campaigns/          # Campaign creation, scheduling & dispatch
│   └── ports/                  # Push transport Port-Adapter-Resolver
│       ├── notification-push.port.ts
│       ├── adapters/
│       │   ├── fcm-push.adapter.ts
│       │   ├── apns-push.adapter.ts
│       │   └── mock-push.adapter.ts
│       └── push-adapter.resolver.ts
├── test/                       # Vitest / Supertest E2E tests
└── package.json
```

---

## 🖥️ Part 3: Frontend Dashboard UI (`frontend/src/pages/PnsDashboardPage.tsx`)

A modern studio portal integrated into GameTuneKit:
1. **Live Notification Simulator:** Real-time preview card for iOS Lockscreen and Android Notification Bar with custom title, body, icon, and buttons.
2. **Instant Test Console:** Send a live test notification to a specific token or web push device.
3. **Campaign Composer & Scheduler:** Set title, deep-links, targeting segment, quiet hours, and delivery time.
4. **Delivery Logs & Analytics Table:** Track sent counts, delivery success rates, and token churn.

---

## ⚡ Part 4: Token-Efficient Subagent Execution Pipeline (4 Batches)

To ensure zero token bloat and complete modularity:

| Batch | Scope & Deliverables | Verification |
|---|---|---|
| **Batch 1: Backend Foundation** | Scaffold NestJS in `backend/`, global filters, health/telemetry endpoints, TypeORM setup. | `npm run build` (0 TS errors), `npm audit` (0 vulnerabilities). |
| **Batch 2: Domain Modules & Push Adapters** | `devices`, `players`, `campaigns` modules + Port-Adapter-Resolver (`FcmPushAdapter`, `MockPushAdapter`). | Vitest unit & E2E integration tests passing. |
| **Batch 3: Frontend Dashboard UI** | Build `PnsDashboardPage.tsx`, Notification Preview, Test Console, and routing. | `npm run build`, verified in browser. |
| **Batch 4: Browser UI Testing & Subagent Verification** | Launch `browser_subagent` to test UI inputs, simulated push dispatch, and responsive layout. | Automated browser recording & snapshot evidence. |
