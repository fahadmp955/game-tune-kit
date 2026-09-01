# 🎮 GameTuneKit — Project Overview

## 📌 Introduction
**GameTuneKit** is an open-first ecosystem of decision-support tools, calculators, simulation engines, LiveOps planners, and monetisation platforms designed specifically for game developers, economy designers, user acquisition (UA) managers, and product managers. 

GameTuneKit explicitly focuses on **game operation, pricing, retention, LiveOps, and economy tuning** rather than code/asset generation or general analytics.

### Core Product Thesis ("Planka, not Trello")
- **Open & Free Layer 0 (L0):** All standalone core calculators operate frictionlessly without requiring an account or production telemetry.
- **Progressive Intelligence Layers (L0 → L4):**
  - **L0 (Generic / Open):** Zero-friction standalone calculators using raw assumptions.
  - **L1 (Game-Aware):** Studio config, reusable personas, store catalogues, custom assumptions.
  - **L2 (Data-Aware):** Processing aggregate operational studio data locally or in self-hosted deployments.
  - **L3 (Connected Intelligence):** Cross-product semantic models (e.g. `Whale` persona, currency systems, reward tables shared between LiveOps, Simulation, and Pricing).
  - **L4 (Tuning Layer):** Models & AI agents reasoning across connected systems to simulate, recommend, and orchestrate updates.

---

## 🛠️ Target Tech Stack & Architecture Strategy

- **Frontend Framework:** Vite + React + TypeScript (Strict Mode) + Tailwind CSS
- **Design System & Aesthetics:**
  - Modern typography (*Inter* / *Outfit*) with `lucide-react` icons.
  - Dark mode by default with auto-detecting system preference (`prefers-color-scheme`), persisted via `ThemeContext`.
  - Sleek dark mode gradients (`#090d16`, `#0f172a`), HSL tailored accents, glassmorphic panels (`backdrop-blur-md bg-slate-900/80 border border-slate-800`).
  - Dynamic charts (Recharts / Chart.js / Canvas math visualizations for curves, retention decay, loot tables, and ROI projections).
- **Backend / Engine (Future / Layer 1+):** Node.js / NestJS or lightweight API services with PostgreSQL & TypeORM / Prisma.
- **State Management & Persistence:**
  - Client-side zero-backend local execution for Layer 0 standalone utilities (`localStorage` persistence, shareable URL query state).
  - Export capabilities (JSON, CSV, formatted PDF summary reports).

---

## 📁 Repository Layout

```text
game-tune-kit/
├── _docs/
│   ├── game-tune-kit-overview.md       # Long-term vision & 8 product pillars
│   ├── utilities-catalog.md            # Master catalogue of 36+ standalone utilities
│   ├── project-overview.md            # Canonical orientation & stack blueprint
│   ├── current-status.md              # Active phase status & milestone tracking
│   ├── TODO.md                         # Itemized feature backlog & shipping checklist
│   ├── DECISIONS.md                    # Architectural & product decision log
│   ├── context.md                      # Agent temporary working scratchpad
│   ├── architecture/
│   │   ├── database-schema.md         # Data models, schema ERD, and local state models
│   │   └── working-mechanisms.md      # Technical workflows & calculation pipelines
│   └── utilities/                      # 37 PRD & Codex spec files per utility
├── .agents/
│   ├── rules/                          # System rules & governance protocols
│   └── skills/                         # Workflows (idea discovery, frontend arch, etc.)
```

---

## ⚙️ Development Strategy & Phases

- **Phase 1 (Current Focus — Initial Utilities Suite):** Launching the initial release set (~15-18 calculators) covering Monetisation, Growth, Retention, Economy, LiveOps, and Experimentation.
- **Phase 2 (Game-Aware L1 Platform):** Introducing local project workspace storage, custom game personas, and SKU/pack management.
- **Phase 3 (Connected Intelligence L2/L3):** Multi-utility data sharing (e.g., LTV feeding Break-even CPI & ROAS).
- **Phase 4 (LiveOps & Simulation Engines L4):** Full LiveOps calendar, economy simulator, and store synchronisation.
