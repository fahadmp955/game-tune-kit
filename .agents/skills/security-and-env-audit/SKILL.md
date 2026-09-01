---
name: security-and-env-audit
description: >-
  Environment variable auditing, secret leakage prevention, dependency vulnerability scan,
  and API security compliance skill. Use when adding environment configurations or auditing security.
---

# 🛡️ Security & Environment Audit Skill

Comprehensive guidelines for auditing application environment variables, preventing secret leakage, scanning node dependencies, and enforcing API security standards.

---

## 🤖 Subagent Execution Contract

When assigned this skill by the Orchestrator, the subagent MUST adhere to the following contract:
- **Inputs Required**: New environment variables, API endpoints, dependency changes, authentication logic.
- **Strict Guidelines**: Perform vulnerability & secret leak scans from Day 1. Ensure `.env.example` is updated, `.env` is gitignored, and OWASP Top 10 vulnerabilities (SQLi, XSS, broken auth) are checked across frontend, backend, and DB layers.
- **Verification Command**: `npm audit` / secret scan check
- **Deliverable**: Security audit report with actionable items, updated `.env.example`, and vulnerability fixes.

---

## 🛠️ Security Audit Checklist

### 1. Environment Variables & Secret Safety
- [ ] `.env` is listed in `.gitignore` and NEVER checked into source control.
- [ ] `.env.example` is kept 100% updated with all required configuration keys (with dummy/placeholder values).
- [ ] No hardcoded passwords, API keys, or private tokens exist in codebase source files.

### 2. Dependency Vulnerability Scans
Run standard dependency audit before merging code:
```bash
npm audit --audit-level=high
```

### 3. API Security & CORS Constraints
- [ ] `allowedCorsOrigin` strictly limits allowed origin domains in production (`app.enableCors(...)`).
- [ ] Sensitive headers (`x-api-key`, `Authorization`) masked in logging interceptors.
- [ ] Validation pipes explicitly configure `forbidNonWhitelisted: true` and `whitelist: true`.
- [ ] Database credentials and TypeORM `synchronize: false` enforced in production.

---

## 📄 `.env.example` Synchronization Standard

Whenever a new environment property is added to `src/config/app.config.ts`, immediately update `.env.example`:

```ini
# Application Configurations
PORT=3000
NODE_ENV=dev
APP_NAME=my-new-service
LOG_LEVEL=debug
SWAGGER_ENABLED=true
ALLOWED_CORS_ORIGIN=*

# Database Configurations
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=app_db
DB_SYNCHRONIZE=true

# Outbound Provider Keys (Placeholder values only)
TEXT_TRANSLATION_PROVIDER=dummy
GOOGLE_CLOUD_API_KEY=your_api_key_here
```
