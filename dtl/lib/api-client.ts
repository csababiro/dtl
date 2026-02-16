export type ApiError = {
  kind: "network" | "http" | "parse";
  status?: number;
  message: string;
  retriable?: boolean;
};

/** Base URL for API. In the browser always same-origin so admin/auth and cookies work. On server uses NEXT_PUBLIC_API_URL or same-origin. */
export function getBaseUrl(): string {
  // Browser: always same-origin so PUT/POST from admin hit this app's API (JWT cookie, no "Failed to fetch")
  if (typeof window !== "undefined") return window.location.origin + "/api";
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url != null && url !== "") return url.replace(/\/$/, "");
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "") + "/api";
}

/** For server-side fetches: get Cookie header with JWT so protected API routes accept the request. */
async function getAuthCookieHeader(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") return {};
  try {
    const { cookies } = await import("next/headers");
    const { JWT_COOKIE } = await import("@/lib/auth/jwt");
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_COOKIE)?.value;
    if (!token) return {};
    return { Cookie: `${JWT_COOKIE}=${encodeURIComponent(token)}` };
  } catch {
    return {};
  }
}

export async function get<T>(path: string): Promise<{ data: T } | { error: ApiError }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      error: { kind: "network", message: "No API URL", retriable: false },
    };
  }
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  const authHeaders = await getAuthCookieHeader();
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        error: {
          kind: "http",
          status: res.status,
          message: body || res.statusText,
          retriable: res.status >= 500,
        },
      };
    }
    try {
      const result = (await res.json()) as T;
      return { data: result };
    } catch (e) {
      return {
        error: {
          kind: "parse",
          message: e instanceof Error ? e.message : "Invalid JSON",
          retriable: false,
        },
      };
    }
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

export async function post<T, B = unknown>(
  path: string,
  body: B
): Promise<{ data: T } | { error: ApiError }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      error: { kind: "network", message: "No API URL", retriable: false },
    };
  }
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  const authHeaders = await getAuthCookieHeader();
  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const bodyText = await res.text();
      return {
        error: {
          kind: "http",
          status: res.status,
          message: bodyText || res.statusText,
          retriable: res.status >= 500,
        },
      };
    }
    try {
      const result = (await res.json()) as T;
      return { data: result };
    } catch (e) {
      return {
        error: {
          kind: "parse",
          message: e instanceof Error ? e.message : "Invalid JSON",
          retriable: false,
        },
      };
    }
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

export async function put<T, B = unknown>(
  path: string,
  body: B
): Promise<{ data: T } | { error: ApiError }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      error: { kind: "network", message: "No API URL", retriable: false },
    };
  }
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  const authHeaders = await getAuthCookieHeader();
  try {
    const res = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const bodyText = await res.text();
      return {
        error: {
          kind: "http",
          status: res.status,
          message: bodyText || res.statusText,
          retriable: res.status >= 500,
        },
      };
    }
    try {
      const result = (await res.json()) as T;
      return { data: result };
    } catch (e) {
      return {
        error: {
          kind: "parse",
          message: e instanceof Error ? e.message : "Invalid JSON",
          retriable: false,
        },
      };
    }
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

export async function patch<T, B = unknown>(
  path: string,
  body: B
): Promise<{ data: T } | { error: ApiError }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      error: { kind: "network", message: "No API URL", retriable: false },
    };
  }
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  const authHeaders = await getAuthCookieHeader();
  try {
    const res = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const bodyText = await res.text();
      return {
        error: {
          kind: "http",
          status: res.status,
          message: bodyText || res.statusText,
          retriable: res.status >= 500,
        },
      };
    }
    try {
      const result = (await res.json()) as T;
      return { data: result };
    } catch (e) {
      return {
        error: {
          kind: "parse",
          message: e instanceof Error ? e.message : "Invalid JSON",
          retriable: false,
        },
      };
    }
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

export async function del<T>(path: string): Promise<{ data: T } | { error: ApiError }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      error: { kind: "network", message: "No API URL", retriable: false },
    };
  }
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  const authHeaders = await getAuthCookieHeader();
  try {
    const res = await fetch(url, { method: "DELETE", credentials: "include", headers: authHeaders });
    if (!res.ok) {
      const bodyText = await res.text();
      return {
        error: {
          kind: "http",
          status: res.status,
          message: bodyText || res.statusText,
          retriable: res.status >= 500,
        },
      };
    }
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        const result = (await res.json()) as T;
        return { data: result };
      } catch (e) {
        return {
          error: {
            kind: "parse",
            message: e instanceof Error ? e.message : "Invalid JSON",
            retriable: false,
          },
        };
      }
    }
    return { data: undefined as T };
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
