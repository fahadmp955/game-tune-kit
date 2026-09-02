# 🧠 Architectural & Technical Decision Log — GameTuneKit

This log records major technical, architectural, product, and UI design decisions for GameTuneKit.

---

## Decision Log

| Decision | Status | Category | Notes / Rationale |
| :--- | :--- | :--- | :--- |
| **Product Scope Strategy** | Decided | Product | Focus initially on Layer-0 standalone calculators ("Planka, not Trello") with zero onboarding friction before building connected platform features. |
| **Full-Stack Monorepo Structure** | Decided | Architecture | Monorepo layout containing `frontend/` (Vite SPA) and `backend/` (NestJS microservice) for unified tooling and seamless end-to-end development. |
| **PNS OpenPush Philosophy** | Decided | Business / Arch | Studios own their APNs (.p8) and FCM credentials. Eliminates per-subscriber/per-MAU third-party SaaS markups and guarantees complete data sovereignty. |
| **Port-Adapter-Resolver Pattern** | Decided | Architecture | External push gateways are decoupled from business logic via `NotificationPushPort`. `PushAdapterResolver` dynamically routes between `FcmPushAdapter`, `ApnsPushAdapter`, and `MockPushAdapter` based on platform and environment. |
| **Multi-Tenancy Scoping** | Decided | Architecture | Every database table is scoped to `game_id`. Client requests pass `X-Game-Key` headers validated by `GameAuthGuard` to ensure complete game isolation. |
| **Zero-Migration Custom Attributes** | Decided | Database | Player in-game attributes are stored as dynamic JSONB/simple-json. Allows games to send new arbitrary attributes without requiring database schema migrations. |
| **Non-Negotiable Push Guardrails** | Decided | Product / Ops | Enforce **Quiet Hours** (suppression between 10:00 PM – 8:00 AM local time) and **Frequency Capping** (max 1 push/24h default) to prevent player churn and push burnout. |
| **Dual Database Strategy** | Decided | Infrastructure | `better-sqlite3` for fast, zero-dependency local development and CI test runners; PostgreSQL via TypeORM for production deployments. |
| **Zero Vulnerability Policy** | Decided | Security | All dependencies across `frontend/` and `backend/` must pass `npm audit` with **0 vulnerabilities**. Transitive risks mitigated via explicit `overrides`. |
| **Autonomous Browser UI Testing** | Decided | Quality / Testing | Mandate subagent browser testing (`browser-ui-testing` skill) to visually and interactively verify UI layouts, theme changes, and API dispatches with recorded session evidence. |
