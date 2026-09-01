---
name: orchestrator-master
description: >-
  Master orchestration skill for multi-agent development workflows.
  Use when planning, decomposing, delegating, tracking, and verifying multi-domain feature implementation,
  bug fixes, security audits, database migrations, and deployments using specialized subagents.
---

# 🧭 Master Orchestrator Runbook & Delegation Guide

This skill equips Antigravity to act as a **Master Orchestrator**, managing state across complex software tasks, delegating domain-specific work to subagents with targeted skills, and eliminating developer friction (code blindness, dummy stubs, regression bugs, manual deployment steps).

---

## 🎯 Master Orchestration Matrix

The Orchestrator routes subtasks to specific skills based on the domain:

| Domain | Assigned Skill | Target Location / Scope | Verification Command |
|---|---|---|---|
| **Architecture & APIs** | `backend-architecture` | `src/modules/<feature>` | `npm run build` |
| **Database & Migrations** | `db-migration-and-seeding` | `src/database/` | `npm run typeorm:migration:generate` |
| **Testing & Verification** | `api-testing-and-curl` | `test/` | `npm run test:e2e` |
| **Bug Triage & RCA** | `bug-triage-and-root-cause` | Entire codebase / logs | `npm test` |
| **Security & Secrets** | `security-and-env-audit` | `.env*`, `package.json`, APIs | Audit scripts / scanner |
| **Documentation & State** | `project-documentation` | `_docs/` | Link / formatting check |
| **Deployment & VPS** | `vps-deployment-and-monitoring` | `Dockerfile`, `deploy.yml` | Health check endpoint |
| **Code Review & PR** | `code-review-and-pr` | Git diff / commits | `git status`, diff audit |

---

## 📋 Standard Workflow Runbook

### Step 1: Pre-Execution Impact & Side-Effect Assessment
Before writing code or spawning subagents, answer:
1. **Affected Layers**: Which modules, DB tables, endpoints, and docs are touched?
2. **Breaking Changes**: Does this alter existing request/response DTOs, DB columns, or environment configs?
3. **Security Implications**: Are new endpoints public or authenticated? Are input validations strictly enforced?

---

### Step 2: Initialize Task Matrix in Project Docs
Update `_docs/current-status.md` with the active subagent task breakdown:

```markdown
### Active Orchestrator Task Matrix

- **Goal**: [Describe overall feature/fix goal]
- **Target Completion**: [Date/Timestamp]

| Task ID | Task Description | Skill Assigned | Status | Subagent Output / Artifact | Verification Status |
|---|---|---|---|---|---|
| TASK-01 | DB Schema & Migration | `db-migration-and-seeding` | `DONE` | `src/database/migrations/...` | ✅ PASSED |
| TASK-02 | Feature Module & Controller | `backend-architecture` | `IN_PROGRESS` | `src/modules/feature/` | ⏳ PENDING |
| TASK-03 | E2E Supertest Suite | `api-testing-and-curl` | `PENDING` | `test/feature.e2e-spec.ts` | ⏳ PENDING |
| TASK-04 | Security & Input Audit | `security-and-env-audit` | `PENDING` | Audit summary report | ⏳ PENDING |
```

---

### Step 3: Subagent Prompting Strategy
When delegating work to a subagent, format the task prompt with context:

```text
[SUBAGENT PROMPT TEMPLATE]
You are a specialized subagent executing TASK-XX: <Task Title>.
Your primary skill is: .agents/skills/<skill-name>/SKILL.md

Instructions:
1. Read .agents/skills/<skill-name>/SKILL.md using view_file before writing code.
2. Follow all guidelines in the skill strictly (No dummy code, production-grade logic only).
3. Perform your modifications exclusively within the assigned scope.
4. Run empirical verification commands (<verification command>).
5. Return a summary of changes made, files modified, and verification results.
```

---

### Step 4: Verification & Anti-Regression Loop
After each subagent completes its work:
1. **Diff Audit**: Verify no unrelated code was deleted or modified.
2. **Build Check**: Run `npm run build` or equivalent to ensure TypeScript types compile cleanly.
3. **Automated Testing**: Run unit/E2E tests (`npm run test:e2e`).
4. **Log & RCA Check**: If tests fail, dispatch `bug-triage-and-root-cause` to extract tracebacks and propose targeted fixes.

---

### Step 5: Final Delivery & Documentation Sync
- Update `_docs/current-status.md`, `_docs/TODO.md`, and `_docs/DECISIONS.md` using `project-documentation`.
- Perform pre-flight code review using `code-review-and-pr`.
- Report synthesized results to the user with link references to all modified files.
