import "server-only";

/**
 * Server-side API client for the Dennis AI backend.
 *
 * Environment variables:
 * - NEXT_PUBLIC_API_URL — base URL of the backend (e.g. http://localhost:5049)
 * - API_KEY — private key sent as `Authorization: Bearer …` (server-only)
 *
 * Local development (.env.local in the project root):
 *   NEXT_PUBLIC_API_URL=http://localhost:5049
 *   API_KEY=your-secret-key
 *
 * Production (Vercel → Project → Settings → Environment Variables):
 *   NEXT_PUBLIC_API_URL=https://api.example.com
 *   API_KEY=your-production-key
 *
 * Never prefix API_KEY with NEXT_PUBLIC_. That embeds the value in the
 * browser bundle and exposes it to anyone who views page source or network traffic.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.API_KEY;

/** Shown in the UI when the backend rejects our API key (401). */
export const API_UNAUTHORIZED_MESSAGE =
  "The assistant is temporarily unavailable. Please try again later.";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getConfig() {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  if (!API_KEY) {
    throw new Error("API_KEY is not configured");
  }
  return {
    baseUrl: BASE_URL.replace(/\/$/, ""),
    apiKey: API_KEY,
  };
}

/**
 * Authenticated fetch to the backend. Use only from Server Components,
 * Server Actions, or Route Handlers — never from client components.
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const { baseUrl, apiKey } = getConfig();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);

  const method = init.method ?? "GET";
  console.info(`[api] ${method} ${normalizedPath}`);

  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers,
  });

  if (res.status === 401) {
    console.error(
      "[api] 401 Unauthorized — verify API_KEY matches the backend configuration",
    );
    throw new ApiError(
      "Authentication failed. The API key was rejected by the backend.",
      401,
    );
  }

  if (!res.ok) {
    console.error(`[api] ${method} ${normalizedPath} failed with ${res.status}`);
    throw new ApiError(`Backend error: ${res.status}`, res.status);
  }

  return res;
}

/** POST /api/chat — returns the raw streaming response from the backend. */
export async function postChat(message: string): Promise<Response> {
  return apiFetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}
