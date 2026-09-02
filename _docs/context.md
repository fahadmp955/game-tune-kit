# 📝 Agent Context Scratchpad — GameTuneKit

## Current Operational State
- **Monorepo Architecture:**
  - `frontend/`: Vite 6 + React 18 SPA serving all 36 standalone calculators + PNS Studio Dashboard.
  - `backend/`: NestJS 12 microservice implementing the complete Push Notification Service (PNS).
  - `_docs/`: Canonical specifications, overview, PNS context (`pns-overview.md`), PRDs, and logs.
  - `.agents/skills/`: Complete suite of 14 Superpowers skills + `browser-ui-testing` + `backend-architecture`.

## Key Verification & Testing Commands
- **Backend Tests:** `cd backend && npm test` (Vitest unit tests: 5 passed).
- **Backend Build & Audit:** `cd backend && npm run build && npm audit` (0 TS errors, 0 vulnerabilities).
- **Frontend Tests:** `cd frontend && npm test` (Vitest unit tests: 8 passed).
- **Frontend Build & Audit:** `cd frontend && npm run build && npm audit` (0 TS errors, 0 vulnerabilities).

## Running Dev Services
- Frontend dev server runs on `http://localhost:3000` (or `5173`).
- Backend NestJS server runs on `http://localhost:3000` (API prefix: `/api/v1`).
- Swagger OpenAPI documentation at `http://localhost:3000/api/v1/docs`.
- Health probe at `http://localhost:3000/api/v1/health`.
- Prometheus metrics at `http://localhost:3000/api/v1/metrics`.

## GitHub Sync State
- Repository: [github.com/fahadmp955/game-tune-kit](https://github.com/fahadmp955/game-tune-kit)
- Branch: `main` (clean sync).
