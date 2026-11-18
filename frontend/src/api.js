/**
 * Base URL for all API calls.
 * - In development: empty string → Vite proxy forwards /api/* to localhost:5000
 * - In production: set VITE_API_URL=https://coy-t6ef.onrender.com in your host's env vars
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '';
