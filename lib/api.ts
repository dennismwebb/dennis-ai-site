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

export type AskResponse = { answer: string };

type ChatResponse = { reply?: string };

/**
 * POST /api/ask — sends the user's question through the backend RAG pipeline
 * (retrieval over portfolio context, then LLM synthesis) and returns a single answer.
 *
 * When the backend has not yet deployed /api/ask, falls back to POST /api/chat
 * and maps `{ reply }` → `{ answer }` so the UI contract stays stable.
 */
export async function postAsk(question: string): Promise<AskResponse> {
  try {
    const res = await apiFetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    return res.json() as Promise<AskResponse>;
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 404) {
      throw err;
    }
    console.info(
      "[api] /api/ask not available — using /api/chat until the RAG ask endpoint is deployed",
    );
  }

  const res = await apiFetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: question }),
  });
  const data = (await res.json()) as ChatResponse;
  if (typeof data.reply !== "string") {
    throw new ApiError("Backend chat response missing reply", 502);
  }
  return { answer: data.reply };
}
