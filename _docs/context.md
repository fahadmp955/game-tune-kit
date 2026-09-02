# 📝 Agent Context Scratchpad — GameTuneKit

## Live Production Architecture
- **Frontend (Cloudflare Pages):**
  - Git connected: Auto-deploys from `main` branch.
  - Dynamic API Base: Defaults to `https://gametune-kit-backend.onrender.com/api/v1`.
- **Backend (Render.com Web Service):**
  - Live Base URL: `https://gametune-kit-backend.onrender.com`
  - Health Probe: `https://gametune-kit-backend.onrender.com/api/v1/health`
  - Prometheus Telemetry: `https://gametune-kit-backend.onrender.com/api/v1/metrics`
  - Swagger Documentation: `https://gametune-kit-backend.onrender.com/api/v1/docs`
- **Database (Supabase PostgreSQL):**
  - Host: `aws-0-ap-south-1.pooler.supabase.com:5432` (AWS Mumbai pooler)
  - Tables: `games`, `devices`, `players`, `segments`, `campaigns` (active and indexed).

## Active Task
- Designing implementation plan for **Web Version of Push Notifications** (W3C Push API, VAPID keys, Service Worker `sw.js`, and `WebPushAdapter`).
