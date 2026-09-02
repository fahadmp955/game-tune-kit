---
name: api-testing-and-curl
description: >-
  API endpoint verification, curl command generation, HTTP request collections,
  and NestJS Supertest end-to-end integration testing skill. Use when creating or testing API routes.
---

# 🧪 API Testing & Curl Generation Skill

Standardized guidelines for testing NestJS API endpoints, generating reproducible `curl` commands, creating HTTP request files, and writing Supertest integration test suites.

---

## 🤖 Subagent Execution Contract

When assigned this skill by the Orchestrator, the subagent MUST adhere to the following contract:
- **Inputs Required**: Controller/route endpoints, request DTO payloads, expected HTTP status codes, error schemas.
- **Strict Guidelines**: Aim for 100% route coverage from Day 1. Include positive test cases, validation failure cases (400 Bad Request), authentication failure cases (401/403), and internal error fallbacks (500).
- **Verification Command**: `npm run test:e2e` / `npm test`
- **Deliverable**: Supertest file under `test/<feature>.e2e-spec.ts` and reproducible `curl` commands in documentation.

---

## ⚡ Standard `curl` Command Format

When documenting or testing endpoints, generate clean, formatted `curl` commands:

```bash
curl -X POST "http://localhost:3000/api/v1/translation/translate"   -H "Content-Type: application/json"   -H "Authorization: Bearer <YOUR_JWT_TOKEN>"   -H "x-request-id: test-request-001"   -d '{
    "text": "Hello world",
    "destinationLanguage": "es"
  }' | jq .
```

---

## 📄 HTTP Request Collection File (`api-requests.http`)

Store `.http` files under `_docs/api/requests.http` for quick execution in VS Code / JetBrains HTTP Client:

```http
### Health Check
GET http://localhost:3000/api/v1/health
Accept: application/json

### Translate Text (English to Spanish)
POST http://localhost:3000/api/v1/translation/translate
Content-Type: application/json
x-request-id: http-client-req-001

{
  "text": "Hello, welcome to the microservice API!",
  "sourceLanguage": "en",
  "destinationLanguage": "es"
}
```

---

## 🧪 NestJS Supertest E2E Template

Write end-to-end integration tests under `test/[feature].e2e-spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TranslationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health should return status ok', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.services.database).toBeDefined();
      });
  });
});
```
