export type ApiError = {
  kind: "network" | "http" | "parse";
  status?: number;
  message: string;
  retriable?: boolean;
};

/** Base URL for API (e.g. same-origin /api or NEXT_PUBLIC_API_URL). Safe to use from server (RSC) or client. */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url != null && url !== "") return url.replace(/\/$/, "");
  // Same-origin fallback: use this app's /api (so form works without external backend)
  if (typeof window !== "undefined") return window.location.origin + "/api";
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "") + "/api";
}

export async function get<T>(path: string): Promise<{ data: T } | { error: ApiError }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      error: { kind: "network", message: "No API URL", retriable: false },
    };
  }
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  try {
    const res = await fetch(url);
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
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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
  try {
    const res = await fetch(url, { method: "DELETE" });
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
