# 📋 Project Backlog & Roadmap — GameTuneKit

This document tracks completed milestones, active deliverables, and future architectural roadmaps for GameTuneKit.

---

## 🏆 Completed Milestones

### Phase 0 & 1: Documentation, Design System & 36 Utilities (L0)
- [x] Scaffold canonical project documentation under `_docs/` (Overview, 37 PRDs, Architecture).
- [x] Setup Vite + React + TypeScript + Tailwind CSS project in `frontend/` folder.
- [x] Implement global `ThemeContext` (Dark default with auto-detecting system preferences).
- [x] Implement complete 36-calculator suite across 4 parallel batches.
- [x] 1-Click Clipboard Share Button & State Encoding (`?util=...&state=...`) with Toast notifications.

### Phase 2: Superpowers Skills & Quality Automation
- [x] Cloned and installed `obra/superpowers` suite (all 14 skills in `.agents/skills/` and globally).
- [x] Installed custom `browser-ui-testing` skill for autonomous subagent browser verification.
- [x] Installed `vitest` + `@testing-library/react` and configured `npm test` suites.

### Phase 3: Push Notification Service (PNS) — Layer 1 Operational Platform
- [x] Scaffolding NestJS microservice backend in `backend/` adhering to `.agents/skills/backend-architecture`.
- [x] Implement Port-Adapter-Resolver push engine (`NotificationPushPort`, `FcmPushAdapter`, `ApnsPushAdapter`, `MockPushAdapter`, `PushAdapterResolver`).
- [x] Multi-tenancy support (`GamesModule`) with API key authentication (`X-Game-Key` / `GameAuthGuard`).
- [x] Idempotent Device Registration (`DevicesModule`) with token pruning on `410 / UNREGISTERED`.
- [x] Dynamic Player Attributes Ingestion (`PlayersModule`) with zero-migration JSON storage.
- [x] Compound Rule Cohort Engine (`SegmentsModule`) with live estimated reach calculation.
- [x] Campaign Management (`CampaignsModule`) with **Quiet Hours** (10 PM – 8 AM) and frequency capping.
- [x] Observability: Health Probe (`GET /api/v1/health`), Prometheus Metrics (`GET /api/v1/metrics`), and Swagger Docs (`/api/v1/docs`).
- [x] Frontend PNS Studio Dashboard (`frontend/src/pages/PnsDashboardPage.tsx`):
  - [x] Live Mobile Lockscreen Simulator (iOS 17 glassmorphic card & Android 14 notification drawer).
  - [x] Instant Single-Device Test Console with gateway response preview.
  - [x] Cohorts & Segments visual manager with "+ Create New Cohort" modal.
  - [x] Delivery History & Analytics KPI cards.

### Phase 4: Production Cloud Deployment & Database Sync
- [x] Supabase PostgreSQL Database connected via IPv4 Connection Pooler in `ap-south-1` (`aws-0-ap-south-1.pooler.supabase.com`).
- [x] TypeORM table synchronization across all 5 tables (`games`, `devices`, `players`, `segments`, `campaigns`).
- [x] Render.com Web Service live at `https://gametune-kit-backend.onrender.com`.
- [x] NestJS 11 LTS migration ensuring native CommonJS compatibility, 0 stack overflows, and 0 vulnerabilities.
- [x] Cloudflare Pages frontend configured with dynamic `API_BASE_URL` defaulting to Render backend.

---

## 🚀 Active & Planned Roadmap

### Phase 5: Web Push Notifications (W3C Push API & VAPID) — [ACTIVE PLANNING]
- [ ] VAPID key generation (`web-push` standard) and public key distribution endpoint (`GET /api/v1/web-push/public-key`).
- [ ] Dedicated `WebPushAdapter` implementing `NotificationPushPort` in backend.
- [ ] Client Service Worker (`sw.js`) to intercept push events, show system notifications, and handle notification clicks.
- [ ] Frontend 1-Click "Enable Web Push on This Browser" button in PNS Studio to register real browser endpoints and test live delivery.

### Phase 6: Remote Config & Feature Flags (Layer 2 / Layer 3)
- [ ] Implement `RemoteConfigModule` in backend to serve dynamic configuration JSON per game.
- [ ] Connect Remote Config to PNS Cohorts.

### Phase 7: LiveOps Calendar & Event Orchestration (Layer 4)
- [ ] Unified LiveOps Event Calendar in Studio Dashboard.
- [ ] Automatic PNS campaign scheduling synced with event launch.
