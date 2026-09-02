/**
 * Base URL for the GameTuneKit backend REST API.
 * 1. Reads VITE_API_BASE_URL environment variable if set.
 * 2. In production builds (Cloudflare Pages), automatically defaults to live Render backend.
 * 3. In local development, defaults to local server at http://localhost:3000/api/v1.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://gametune-kit-backend.onrender.com/api/v1'
    : 'http://localhost:3000/api/v1');
