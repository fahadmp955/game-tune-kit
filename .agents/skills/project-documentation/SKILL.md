---
name: project-documentation
description: >-
  Standardized project documentation scaffolding and backlog management skill.
  Use when initializing or normalizing project documentation in the `_docs/` directory,
  including `project-overview.md`, `current-status.md`, `TODO.md`, `DECISIONS.md`, and `context.md`.
---

# 📚 Project Documentation & Backlog Scaffolding Skill

This skill provides standard conventions, structural requirements, and templates for establishing and maintaining canonical project control documentation inside the `_docs/` directory.

---

## 🤖 Subagent Execution Contract

When assigned this skill by the Orchestrator, the subagent MUST adhere to the following contract:
- **Inputs Required**: Project scope, active sprint goals, architectural decisions, task breakdown matrices.
- **Strict Guidelines**: Maintain single source of truth under `_docs/`. Synchronize `current-status.md`, `TODO.md`, and `DECISIONS.md`. Eliminate manual documentation friction by updating status matrices automatically as subagents complete tasks.
- **Verification Command**: Verify all markdown links resolve correctly and formatting matches standard templates.
- **Deliverable**: Canonical project documentation under `_docs/` with active Orchestrator task matrices.

---

## 🎯 Purpose & Scope

Use this skill when:
- Initializing documentation for a new software project or microservice.
- Auditing, structuring, or normalizing existing documentation in an active repository.
- Setting up standardized task backlogs (`TODO.md`) and architectural decision logs (`DECISIONS.md`).

---

## 📁 Canonical Documentation Directory Structure

All canonical project control documentation resides under `_docs/` at the repository root:

```text
_docs/
├── project-overview.md  # Orientation doc (stack, architecture, layout, run instructions)
├── current-status.md    # Active implementation status & milestone tracking
├── TODO.md              # High-level feature backlog and shipping items
├── DECISIONS.md         # Canonical decision log (architecture, product, API choices)
├── context.md           # Disposable agent scratch space & temporary context
│
├── api/                 # Endpoint specs, Swagger notes, and payload schemas
├── architecture/        # Deep-dive architectural diagrams and pattern notes
├── setup/               # Detailed environment, VPS, and local setup guides
├── testing/             # Test strategy, integration runner docs
└── future/              # Vision documents and long-term proposals
```

---

## 📜 Core Formatting & Content Rules

### 1. Project Portability
- **No Hardcoded Project Specifics in Scaffolding Templates:** Use portable, reusable framing rather than specific repo names in header template intros (e.g., use *"This document tracks shipping requirements for this project"*).
- **Relative Pathing Only:** Never use absolute local filesystem paths (e.g., `/Users/name/...`). Use portable relative paths (e.g., `_docs/api/endpoints.md`).

### 2. Separation of Concerns
- **`README.md` is for Public Orientation:** Keep user-facing introduction, quickstart, and badges in `README.md`. Keep canonical project-control state in `_docs/`.
- **`context.md` is Disposable Scratch Space:** Treat `_docs/context.md` as temporary scratch space for AI agents. Never store canonical business logic or permanent project decisions here.

### 3. Normalization Principle
- **Preserve Existing Content:** When normalizing existing project documentation, do NOT overwrite useful documentation blindly. Reorganize and reformat content into the standard structure while preserving context.

---

## 📄 File Templates & Specifications

### 1. `_docs/project-overview.md` (Orientation Document)
Answers essential onboarding questions: project goal, tech stack, folder layout, build/run commands, and key architectural patterns.

```markdown
# 🚀 Project Overview

## 📌 Introduction
Brief overview of what this project does and the problem it solves.

## 🛠️ Tech Stack & Dependencies
- **Language / Runtime:** TypeScript / Node.js
- **Framework:** NestJS / Express
- **Database:** PostgreSQL (TypeORM) / Redis
- **Containerization / Deployment:** Docker (Multi-stage) / GitHub Actions / VPS

## 📁 Repository Layout
Brief summary of key source directories and modules.

## ⚙️ Local Development & Build
Commands to install dependencies, run locally, build, and test:
```bash
npm install
npm run start:dev
npm run build
npm run test
```

## 🏗️ Architecture & Conventions
Summary of primary design patterns, coding standards, and global infrastructure.
```

---

### 2. `_docs/current-status.md` (Active Status & Milestones)
Answers: *What is the state of the project right now?*

```markdown
# 📈 Current Project Status

## 📊 Phase Summary
| Phase | Status | Target Date | Notes |
| :--- | :--- | :--- | :--- |
| Phase 1: Core Setup | Completed | YYYY-MM-DD | Base architecture & CI/CD ready |
| Phase 2: Feature Implementation | In Progress | YYYY-MM-DD | Active development |

## ⚙️ Implemented State
- Current working features and active API endpoints.
- Current active database schema and cache integration state.
- Runtime environment configuration state.

## 🚧 Active & Remaining Tasks
- **Completed:** List of recent milestones achieved.
- **Remaining:** Core items currently under active execution.
```

---

### 3. `_docs/TODO.md` (Backlog & Shipping Items)
Focuses exclusively on **what needs to be shipped**, not detailed implementation instructions.

#### Status Markers & Rules:
- `[]` = Not Started
- `[A]` = Active / In Progress
- `[x]` = Done / Completed
- **No Nested Checkboxes** allowed.
- Tables must use simple `Item | Notes` columns (no status column in tables).

```markdown
# 📋 Project Backlog

This document tracks items that need to be shipped for this project.

## Backlog

[] Task Item 1
[A] Task Item 2
[x] Task Item 3

## Active Roadmap

### Immediate

| Item | Notes |
| :--- | :--- |
| Feature A | High priority shipping item |

### Later

| Item | Notes |
| :--- | :--- |
| Feature B | Planned for subsequent release |

### Skipped

| Item | Notes |
| :--- | :--- |
| Deprecated Feature | Replaced by alternative approach |
```

---

### 4. `_docs/DECISIONS.md` (Canonical Decision Log)
Tracks open, deferred, and decided architectural or product choices.

#### Allowed Decision Statuses:
- `Open` — Currently under evaluation or discussion.
- `Deferred` — Postponed until a future phase or prerequisite is met.
- `Decided` — Finalized decision with established rationale.

```markdown
# 🧠 Architectural & Technical Decision Log

This log records major technical, architectural, and API design decisions for the project.

## Decision Log

| Decision | Status | Category | Notes / Rationale |
| :--- | :--- | :--- | :--- |
| Choice of Database ORM | Decided | Architecture | Standardized on TypeORM for PostgreSQL support |
| Redis Cache Invalidation Strategy | Open | Performance | Evaluating TTL vs Event-driven invalidation |
| GraphQL Endpoint Support | Deferred | API | Re-evaluating after v1 REST API release |
```

---

### 5. `_docs/context.md` (Agent Working Scratchpad)
Disposable scratch space for transient notes during agent execution turns.

```markdown
# 📝 Agent Context Scratchpad

*Note: This file is a temporary scratchpad for agent working notes and may be reset or overwritten at any time.*
```

---

## 🛠️ Execution Checklist for Normalizing Documentation

When asked to set up or normalize project documentation:
- [ ] Ensure `_docs/` directory exists at root.
- [ ] Verify `_docs/project-overview.md`, `_docs/current-status.md`, `_docs/TODO.md`, `_docs/DECISIONS.md`, and `_docs/context.md` exist and conform to templates.
- [ ] Organize existing unstructured documentation into appropriate `_docs/` subfolders (`api/`, `architecture/`, `setup/`, `testing/`, `future/`).
- [ ] Verify `TODO.md` uses top-level `[]`, `[A]`, `[x]` markers without nested checkboxes.
- [ ] Verify `DECISIONS.md` status fields are limited to `Open`, `Deferred`, or `Decided`.
- [ ] Confirm no absolute local filesystem paths or hardcoded personal directories are present in `_docs/`.
