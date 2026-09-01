---
name: code-review-and-pr
description: >-
  Pre-flight code review, conventional git commits, pull request summary generation,
  and release preparation skill. Use when creating PRs, performing self-reviews, or formatting commits.
---

# 🐙 Code Review & Pull Request Skill

Standardized workflow for conducting pre-flight self-reviews, formatting git commits, and generating comprehensive GitHub Pull Request documentation.

---

## 🤖 Subagent Execution Contract

When assigned this skill by the Orchestrator, the subagent MUST adhere to the following contract:
- **Inputs Required**: Unstaged/staged git diffs, changed file lists, commit history, ticket links.
- **Strict Guidelines**: Perform code review looking for redundant code, missing helper functions, dummy code, formatting issues, and conventional commit rules. Ensure developer review time is minimized by providing explicit diff breakdowns.
- **Verification Command**: `git diff`, `npm run lint`
- **Deliverable**: Pre-flight review summary, formatted commit messages, and PR description document.

---

## 🎯 Workflow Overview

1. **Pre-flight Automated Checks:** Run build, linting, and unit tests before opening a PR.
2. **Conventional Commit Formatting:** Enforce structured commit messages (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
3. **Structured PR Generation:** Generate a standardized PR summary outlining changes, rationale, testing verification, and breaking change risks.

---

## 📝 Conventional Commit Format

Use the standard conventional commit format:
```text
<type>(<scope>): <short summary in present tense>

[optional body providing technical details]
```

### Allowed Types:
- `feat`: A new user-facing feature or API endpoint.
- `fix`: A bug fix.
- `docs`: Documentation changes (`_docs/`, comments, README).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Updating dependencies, build scripts, or environment configs.

---

## 📄 Pull Request Description Template

When generating PR descriptions, use this standard template:

```markdown
## 📌 Summary of Changes
Brief high-level description of what this PR accomplishes.

## 🏗️ Architectural & Technical Notes
- Component or module modified (`src/[feature]/`).
- Design patterns or abstractions added or modified.

## 🧪 Verification & Testing
- [ ] Unit tests added / updated and passing.
- [ ] End-to-end integration tests verified.
- [ ] Tested manually via Swagger / `curl`.

```bash
# Verification commands executed:
npm run test
npm run build
```

## 🛡️ Security & Quality Checklist
- [ ] No secrets, hardcoded credentials, or `.env` files committed.
- [ ] Inputs parsed using NestJS validation pipes (`class-validator`).
- [ ] `_docs/current-status.md` and `_docs/TODO.md` updated if applicable.
```

---

## 🛠️ Pre-Flight Self-Review Checklist
Before requesting peer review or merging:
- [ ] Are all exports and imports used without dead code?
- [ ] Are docstrings and inline comments preserved for non-obvious logic?
- [ ] Does the code build cleanly without TypeScript compiler warnings?
