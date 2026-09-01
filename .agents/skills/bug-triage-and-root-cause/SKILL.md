---
name: bug-triage-and-root-cause
description: >-
  Systematic bug investigation, log extraction, root-cause diagnostic analysis,
  and regression test scaffolding skill. Use when investigating failures or fixing bugs.
---

# 🔍 Bug Triage & Root Cause Analysis Skill

A step-by-step diagnostic workflow for investigating application runtime failures, tracing log output, identifying underlying root causes, and preventing regressions.

---

## 🤖 Subagent Execution Contract

When assigned this skill by the Orchestrator, the subagent MUST adhere to the following contract:
- **Inputs Required**: Error log tracebacks, failing test results, transaction IDs (`x-request-id`), or bug reports.
- **Strict Guidelines**: Scrape/inspect full un-truncated logs. Form hypotheses strictly based on empirical evidence. Create RCA report with root cause, impacted components, and a regression test that fails before fix and passes after.
- **Verification Command**: Run failing regression test suite to confirm clean pass.
- **Deliverable**: RCA Report with actionable items, bug fix PR/diff, and regression test code.

---

## 🛠️ Diagnostic Protocol

1. **Inspect Un-truncated Logs First:** Never guess root causes without extracting exact error messages and stack traces.
2. **Trace Request ID (`x-request-id`):** Correlate failing HTTP logs with database queries and external resolver calls.
3. **Reproduce via Isolation Test:** Write a failing unit test or explicit payload script that reproduces the crash reliably.
4. **Fix Contract at Upstream Source:** Never wrap broken endpoints in silent try-catch blocks or dummy fallbacks. Address why the contract failed.
5. **Document in `_docs/DECISIONS.md`:** Document non-trivial architectural bug fixes in the decision log.

---

## 📄 Root Cause Analysis (RCA) Document Template

When triaging major incidents, document the finding in `_docs/architecture/rca-[bug-name].md`:

```markdown
# 🔍 Root Cause Analysis: [Bug Summary]

## 🚨 Incident Summary
- **Symptom:** Brief description of what failed in runtime.
- **Impact:** Severity and affected endpoints/modules.

## 🔬 Root Cause Findings
Detailed explanation of why the failure occurred (e.g. unhandled null property, missing database index, vendor API timeout).

## 🛠️ Resolution Implemented
- **Code Fix:** Clickable reference to modified files (e.g. `[service.ts](file:///path/to/service.ts)`).
- **Regression Test:** Path to newly added test case.

## 🛡️ Prevention Measures
Steps taken to prevent similar issues in the future.
```
