# 🚀 GameTuneKit Production Deployment Guide

This guide details how to deploy the GameTuneKit stack across **Supabase (Database)**, **Render (NestJS Backend)**, and **Cloudflare Pages (Frontend SPA)**.

---

## 🏛️ Deployment Architecture Overview

```text
┌──────────────────────────────┐
│       Cloudflare Pages       │ ──► Client Browser SPA
│  (Frontend React + Vite)     │
└──────────────┬───────────────┘
               │
               │ HTTPS REST Calls (/api/v1)
               ▼
┌──────────────────────────────┐
│         Render.com           │ ──► NestJS Microservice
│  (Backend Web Service)       │     (Port 10000)
└──────────────┬───────────────┘
               │
               │ PostgreSQL Connection with SSL
               ▼
┌──────────────────────────────┐
│         Supabase             │ ──► Managed PostgreSQL DB
│  (Database & Storage)        │     (Tables auto-synchronized)
└──────────────────────────────┘
```

---

## 1. 🗄️ Database Setup: Supabase (PostgreSQL)

You only need **one string** from Supabase: your PostgreSQL connection URI.

### Steps:
1. Sign in to [supabase.com](https://supabase.com/) and create a new project (e.g. `gametune-pns-prod`).
2. Go to **Project Settings** (gear icon in sidebar) → **Database**.
3. Scroll to **Connection string** section.
4. Select the **URI** tab and choose **Transaction Pooler** (recommended for serverless/containers) or **Direct**:
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password.
6. Copy this complete URI — this will be your `DATABASE_URL`.

> [!NOTE]
> No manual SQL tables or migrations need to be created in Supabase! When the NestJS backend starts up, TypeORM automatically creates and synchronizes all tables (`games`, `devices`, `players`, `segments`, `campaigns`) automatically.

---

## 2. ⚡ Backend Deployment: Render.com

The backend is configured to run as a Web Service on Render.

### Option A: 1-Click Blueprint via `render.yaml` (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com/) → Click **New +** → **Blueprint**.
2. Connect your GitHub repository: `fahadmp955/game-tune-kit`.
3. Render will detect `render.yaml` at the root of the repository automatically.
4. When prompted for `DATABASE_URL`, paste your Supabase connection URI.
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect repository `fahadmp955/game-tune-kit`.
3. Configure settings:
   * **Name:** `gametune-kit-backend`
   * **Region:** Same region as your Supabase DB (e.g. Oregon US-West or Frankfurt).
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
   * **Instance Type:** `Free`
4. Add **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `10000`
   * `SWAGGER_ENABLED`: `true`
   * `PUSH_MOCK_MODE`: `true` *(set to false once real APNs/FCM keys are uploaded in game settings)*
   * `LOG_LEVEL`: `info`
   * `DATABASE_TYPE`: `postgres`
   * `DB_SSL`: `true`
   * `DATABASE_URL`: *(Your Supabase connection string)*
5. Click **Deploy Web Service**.
6. Once deployed, copy your Render URL (e.g., `https://gametune-kit-backend.onrender.com`).

---

## 3. 🌐 Frontend Setup: Cloudflare Pages

Your frontend is already on Cloudflare Pages. It only needs **one environment variable** so it knows how to communicate with your Render backend.

### Steps:
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**.
2. Click on your `game-tune-kit` Pages project.
3. Go to **Settings** → **Environment variables**.
4. Click **Add variable**:
   * **Variable name:** `VITE_API_BASE_URL`
   * **Value:** `https://gametune-kit-backend.onrender.com/api/v1` *(replace with your actual Render URL)*
   * **Environment:** Select **Production** (and **Preview** if desired).
5. Save.
6. Go to **Deployments** → Click the three dots on your latest deployment → **Retry deployment** (or simply git push a commit).

---

## 4. ✅ Post-Deployment Verification Checklist

1. **Verify Backend Health:**
   Open in your browser: `https://gametune-kit-backend.onrender.com/api/v1/health`
   - Should return: `{"status": "healthy", "checks": {"database": {"status": "up"}}}`
2. **Verify Swagger API Docs:**
   Open: `https://gametune-kit-backend.onrender.com/api/v1/docs`
   - Interactive Swagger UI will load with all endpoints.
3. **Verify Frontend Live Connection:**
   Open your Cloudflare Pages URL → Click **PNS Studio** in the top navigation bar.
   - Go to **Instant Test Console** → Click **Send Test Notification**.
   - Result will show live gateway response from your Render backend!
