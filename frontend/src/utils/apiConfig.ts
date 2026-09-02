/**
 * Base URL for the GameTuneKit backend REST API.
 * Reads VITE_API_BASE_URL environment variable if provided,
 * otherwise defaults to the live Render production backend.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://gametune-kit-backend.onrender.com/api/v1';
