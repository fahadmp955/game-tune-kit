# 📋 Project Backlog & Roadmap — GameTuneKit

This document tracks completed milestones, current deliverables, and future architectural roadmaps for GameTuneKit.

---

## 🏆 Completed Milestones

### Phase 0 & 1: Documentation, Design System & 36 Utilities (L0)
- [x] Scaffold canonical project documentation under `_docs/` (Overview, 37 PRDs, Architecture).
- [x] Setup Vite + React + TypeScript + Tailwind CSS project in `frontend/` folder.
- [x] Implement global `ThemeContext` (Dark default with auto-detecting system preferences).
- [x] Implement complete 36-calculator suite across 4 parallel batches:
  - [x] **Monetisation Family:** LTV (#01), ARPDAU/ARPPU (#07), PPP Pricing (#08), Pack Value (#09), Currency Exchange (#10), Whale Spend Ceiling (#11).
  - [x] **Growth & UA Family:** ROAS (#02), Break-even CPI (#03), UA Payback (#04), LTV-to-CAC & Runway (#05), Retention Benchmark (#06).
  - [x] **Economy & Systems Family:** Inflation (#12), Source/Sink (#13), Loot/Drop-Rate (#14), Pity System (#15), Gacha Cost (#16), XP Curve (#17), Reward Value (#18), Battle Pass (#20), Energy Systems (#21), Cannibalisation (#22), Ad Revenue (#23).
  - [x] **Data & LiveOps Families:** Ad Yield (#24), Mediation Latency (#25), Subscription Funnel (#26), A/B Sample Size (#27), Whale A/B (#28), KPI Tree (#29), K-Factor (#30), ATT Dilution (#31), DAU/MAU Stickiness (#32), Churn (#33), Soft Launch Scorecard (#34), Cadence (#35), Offer Discount (#36), Season Impact (#19).
- [x] 1-Click Clipboard Share Button & State Encoding (`?util=...&state=...`) with Toast notifications.

### Phase 2: Superpowers Skills & Quality Automation
- [x] Cloned and installed `obra/superpowers` suite (all 14 skills in `.agents/skills/` and globally).
- [x] Installed custom `browser-ui-testing` skill for autonomous subagent browser verification.
- [x] Installed `vitest` + `@testing-library/react` and configured `npm test` suites.

### Phase 3: Push Notification Service (PNS) — Layer 1 Operational Platform
- [x] Scaffolding NestJS 12 microservice backend in `backend/` adhering to `.agents/skills/backend-architecture`.
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
- [x] Autonomous browser subagent testing session recorded to WebP video artifact.
- [x] Strict 0 dependency vulnerabilities across both `frontend/` and `backend/`.

---

## 🚀 Active & Future Roadmap

### Phase 4: Remote Config & Feature Flags (Layer 2 / Layer 3)
- [ ] Implement `RemoteConfigModule` in backend to serve dynamic configuration JSON per game.
- [ ] Connect Remote Config to PNS Cohorts (e.g. serve different remote config values to "Whales" vs "Minnows").
- [ ] Feature Flags API: Rollout percentages and gradual release toggles.

### Phase 5: LiveOps Calendar & Event Orchestration (Layer 4)
- [ ] Unified LiveOps Event Calendar in Studio Dashboard.
- [ ] Automatic PNS campaign scheduling synced with event launch and countdown reminders.
- [ ] Cross-system conflict detection (prevent event launch before app update rollout completes).
