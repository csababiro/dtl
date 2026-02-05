/**
 * API client – all HTTP via NEXT_PUBLIC_API_URL. No hardcoded URLs.
 */

export type ApiError = {
  kind: "network" | "http" | "parse";
  status?: number;
  message: string;
  retriable?: boolean;
};

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return "";
  return url.replace(/\/$/, "");
}

async function handleResponse<T>(res: Response): Promise<{ data: T } | { error: ApiError }> {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // ignore
    }
    return {
      error: {
        kind: "http",
        status: res.status,
        message,
        retriable: res.status >= 500,
      },
    };
  }
  try {
    const data = (await res.json()) as T;
    return { data };
  } catch {
    return {
      error: {
        kind: "parse",
        message: "Invalid JSON response",
        retriable: true,
      },
    };
  }
}

export async function get<T>(path: string): Promise<{ data: T } | { error: ApiError }> {
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
  try {
    const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return handleResponse<T>(res);
  } catch (err) {
    return {
      error: {
        kind: "network",
        message: err instanceof Error ? err.message : "Network error",
        retriable: true,
      },
    };
  }
}

export async function post<T>(
  path: string,
  body: unknown
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
  try {
    const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return handleResponse<T>(res);
  } catch (err) {
    return {
      error: {
        kind: "network",
        message: err instanceof Error ? err.message : "Network error",
        retriable: true,
      },
    };
  }
}
