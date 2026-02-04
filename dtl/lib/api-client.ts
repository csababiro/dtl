/**
 * Centralized API client. All HTTP calls go through this module.
 * Base URL from NEXT_PUBLIC_API_URL; no hardcoded URLs or secrets.
 * @see .cursor/rules/rest-api.mdc
 */

export type ApiErrorKind = "network" | "http" | "parse";

export interface ApiError {
  kind: ApiErrorKind;
  status?: number;
  message: string;
  retriable?: boolean;
}

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || typeof url !== "string") {
    return "";
  }
  return url.replace(/\/$/, "");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T } | { error: ApiError }> {
  const base = getBaseUrl();
  if (!base) {
    return {
      error: {
        kind: "network",
        message: "API URL not configured",
        retriable: false,
      },
    };
  }

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const init: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, init);

    if (!res.ok) {
      const retriable = res.status >= 500 || res.status === 429;
      return {
        error: {
          kind: "http",
          status: res.status,
          message: res.statusText || "Request failed",
          retriable,
        },
      };
    }

    const text = await res.text();
    if (!text) {
      return { data: undefined as unknown as T };
    }

    try {
      const data = JSON.parse(text) as T;
      return { data };
    } catch {
      return {
        error: {
          kind: "parse",
          message: "Invalid JSON response",
          retriable: false,
        },
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      error: {
        kind: "network",
        message,
        retriable: true,
      },
    };
  }
}
