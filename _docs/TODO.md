# 📋 Project Backlog — GameTuneKit

This document tracks shipping requirements and feature milestones for GameTuneKit.

## Backlog

[x] Scaffold canonical project documentation under `_docs/`
[x] Discovery interview and technical alignment with user
[x] Setup Vite + React + TypeScript + Tailwind CSS project in `frontend/` folder
[x] Implement global ThemeProvider (Dark default, prefers-color-scheme auto-detection)
[x] Implement reusable UI components (KpiCard, SliderInput, ShareModal, Toast, Header, FaqAccordion)
[x] Implement Navigation Shell & Utility Catalog Dashboard (`CatalogPage.tsx`)
[x] Build Utility #01: LTV Calculator (Power-Law retention decay & cumulative ARPU)
[x] Build Utility #02: ROAS Calculator (Cohort payback & spend profitability)
[x] Build Utility #32: DAU / MAU Stickiness Calculator (Stickiness ratio & engagement tiers)
[x] Build Utility #14: Loot / Drop-Rate Calculator (Binomial probabilities & CDF curve)
[x] Build Utility #36: Offer Discount Calculator (Base value vs bundle pricing & multipliers)
[x] Build Utility #27: A/B Test Sample Size Calculator (MDE, statistical power & runtime)
[x] 1-Click Clipboard Share Button & Toast Notification
[x] Local `localStorage` preset saving & URL parameter state hydration
[] Build Utility #08: PPP Price Calculator (Purchasing Power Parity regional tiering)
[] Build Utility #09: IAP Pack Value Calculator (Currency pack efficiency & anchor values)
[] Build Utility #10: Currency Exchange Calculator (Hard/Soft/Real-money conversion matrices)
[] Build Utility #12: Economy Inflation Calculator (Source vs Sink daily net delta)
[] Build Utility #15: Pity System Calculator (Soft/Hard pity pull expectations)
[] Build Utility #17: XP / Progression Curve Generator (Linear, exponential & custom power curves)

---

## Active Roadmap

### Immediate (Completed Phase 1 Release)

| Item | Notes |
| :--- | :--- |
| Core Navigation & Design System | Dark/Light mode UI shell in `frontend/` with catalog filters |
| 6 Core Launch Utilities | LTV (#01), ROAS (#02), Stickiness (#32), Loot (#14), Offer (#36), A/B Test (#27) |
| URL State Compression & Clipboard Share | 1-click share button with toast notification |

### Next Phase (Extension Set)

| Item | Notes |
| :--- | :--- |
| PPP Price Calculator (#08) | Regional store tier recommendations |
| IAP Pack Value (#09) | Currency quantity vs bonus percentage |
| Currency Exchange (#10) | Real money -> Hard currency -> Soft currency matrices |
| XP / Progression Curve (#17) | Exponential & power progression curves |
