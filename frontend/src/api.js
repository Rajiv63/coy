/**
 * Base URL for all API calls.
 * - localhost → empty string (Vite proxy forwards /api/* to localhost:5000)
 * - Any other host (Vercel, Netlify, etc.) → Render backend URL
 */
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

export const API_BASE = isLocalhost ? '' : 'https://coy-t6ef.onrender.com';
