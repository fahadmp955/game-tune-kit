# Product Idea & Discovery Protocol

This rule governs how Antigravity handles new product ideas, feature requests, and `/grill-me` interviews in this workspace.

---

## 🛑 MANDATORY DISCOVERY RULES

1. **NO EARLY IMPLEMENTATION**: Never jump straight into code execution or repository scaffolding after an initial prompt or grill-me session.
2. **ACTIVE FEATURE BRAINSTORMING**: When presented with a product idea, you MUST:
   - Suggest complementary features the user did not mention.
   - Critique and question proposed features, trade-offs, and potential edge cases.
   - Discuss UX, database strategy, security, rate limiting, and failure modes.
3. **DOCUMENTATION-FIRST BLUEPRINTING**: Before writing any implementation code, create complete canonical documentation in `_docs/`:
   - `_docs/project-overview.md` (Full overview & stack)
   - `_docs/architecture/database-schema.md` (Complete DB ERD, all tables, columns, types, FKs, indexes)
   - `_docs/architecture/working-mechanisms.md` (Step-by-step technical workflows)
   - `_docs/DECISIONS.md` (Architectural decision log)
   - `_docs/TODO.md` (Itemized feature backlog)
4. **EXPLICIT USER APPROVAL**: Present the documented blueprint to the user and obtain explicit sign-off before writing any codebase files.

---

## ⚡ Skill Reference

Activate `.agents/skills/idea-to-product-discovery/SKILL.md` whenever a user introduces a new product concept or invokes `/grill-me`.
