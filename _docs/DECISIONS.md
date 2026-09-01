# 🧠 Architectural & Technical Decision Log — GameTuneKit

This log records major technical, architectural, product, and UI design decisions for GameTuneKit.

## Decision Log

| Decision | Status | Category | Notes / Rationale |
| :--- | :--- | :--- | :--- |
| **Product Scope Strategy** | Decided | Product | Focus initially on Layer-0 standalone calculators ("Planka, not Trello") with zero onboarding friction before building connected platform features. |
| **Tech Stack Foundation** | Decided | Architecture | Vite + React + TypeScript + Tailwind CSS SPA for client-side calculation speed, instant responsiveness, and zero server latency. |
| **Dark Mode & Aesthetics** | Decided | Design | Default to dark mode with glassmorphic cards, vibrant gradient accents (cyan/violet/emerald per utility family), and modern typography (*Inter*/*Outfit*). |
| **Client-Side Calculation Engine** | Decided | Architecture | Implement pure TypeScript math utilities for retention curves (power law), binomial drop rates, pity simulations, and payback periods without requiring backend API round-trips. |
| **State Persistence Model** | Open | Architecture | Evaluating URL search query string parameter encoding (shareable links) vs `localStorage` workspace presets vs IndexedDB. |
| **Backend Integration (L1+)** | Deferred | Infrastructure | Postponed NestJS / PostgreSQL backend until standalone calculators (L0) and game profile save capabilities are validated. |
| **PDF & Chart Export Engine** | Open | UI / Export | Evaluating `jsPDF` + Canvas rendering vs SVG export for downloadable calculator summary reports. |
