/**
 * API client for backend. All HTTP requests use NEXT_PUBLIC_API_URL.
 * No hardcoded API URLs.
 */

export type ApiErrorKind = "network" | "http" | "parse";

export interface ApiError {
  kind: ApiErrorKind;
  status?: number;
  message: string;
  retriable?: boolean;
}

export type ApiResult<T> = { data: T } | { error: ApiError };

function getBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || typeof url !== "string" || url.trim() === "") return null;
  return url.replace(/\/$/, "");
}

export async function get<T>(path: string): Promise<ApiResult<T>> {
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
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      let message = res.statusText || `HTTP ${res.status}`;
      try {
        const body = await res.json();
        if (body?.message) message = body.message;
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
    const data = (await res.json()) as T;
    return { data };
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

export async function post<T, B = unknown>(
  path: string,
  body: B
): Promise<ApiResult<T>> {
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
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      let message = res.statusText || `HTTP ${res.status}`;
      try {
        const bodyRes = await res.json();
        if (bodyRes?.message) message = bodyRes.message;
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
    const text = await res.text();
    if (!text) return { data: undefined as T };
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

export async function put<T, B = unknown>(
  path: string,
  body: B
): Promise<ApiResult<T>> {
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
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      let message = res.statusText || `HTTP ${res.status}`;
      try {
        const bodyRes = await res.json();
        if (bodyRes?.message) message = bodyRes.message;
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
    const text = await res.text();
    if (!text) return { data: undefined as T };
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

export async function patch<T, B = unknown>(
  path: string,
  body: B
): Promise<ApiResult<T>> {
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
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      let message = res.statusText || `HTTP ${res.status}`;
      try {
        const bodyRes = await res.json();
        if (bodyRes?.message) message = bodyRes.message;
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
    const text = await res.text();
    if (!text) return { data: undefined as T };
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

export async function del<T>(path: string): Promise<ApiResult<T>> {
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
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.ok) {
      let message = res.statusText || `HTTP ${res.status}`;
      try {
        const bodyRes = await res.json();
        if (bodyRes?.message) message = bodyRes.message;
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
    const text = await res.text();
    if (!text) return { data: undefined as T };
    try {
      const data = JSON.parse(text) as T;
      return { data };
    } catch {
      return { data: undefined as T };
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
