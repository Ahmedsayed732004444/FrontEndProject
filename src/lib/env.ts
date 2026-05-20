// src/lib/env.ts
function normalizeApiBaseUrl(raw: string | undefined): string {
  const fallback = "https://localhost:7283/api";
  if (!raw?.trim()) return fallback;
  let base = raw.trim().replace(/\s+/g, "");
  if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
  return base.replace(/\/+$/, "");
}

export const env = {
  API_BASE_URL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  get AUTH_BASE_URL() {
    return this.API_BASE_URL.replace(/\/api$/, "");
  },
  APP_NAME: import.meta.env.VITE_APP_NAME || "Freeqy",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === "true" || import.meta.env.DEV,
} as const;
