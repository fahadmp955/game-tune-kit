/**
 * Base URL for the GameTuneKit backend REST API.
 * In development, defaults to local NestJS server: http://localhost:3000/api/v1.
 * In production (Cloudflare Pages), configured via VITE_API_BASE_URL environment variable.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
