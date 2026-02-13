export type ServiceError = {
  code: "db" | "validation";
  message: string;
};

function isDbError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    const name = err.constructor?.name ?? "";
    return (
      name === "VercelPostgresError" ||
      msg.includes("connection_string") ||
      msg.includes("postgres") ||
      msg.includes("connection")
    );
  }
  return false;
}

export function toServiceError(err: unknown): ServiceError {
  if (err instanceof Error && !isDbError(err)) {
    return { code: "validation", message: err.message };
  }
  return {
    code: "db",
    message: "A database error occurred. Please try again.",
  };
}

export async function withDbErrorHandling<T>(
  fn: () => Promise<T>
): Promise<{ data: T } | { error: ServiceError }> {
  try {
    const data = await fn();
    return { data };
  } catch (err) {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/38291e03-8924-411d-af90-c560fa478f53", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "lib/services/errors.ts:withDbErrorHandling",
        message: "catch ran",
        data: {
          errName: err instanceof Error ? err.constructor?.name : undefined,
          errMessage: err instanceof Error ? err.message?.slice(0, 80) : undefined,
        },
        timestamp: Date.now(),
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    const isMissingConnection =
      err instanceof Error &&
      (err.message.includes("Missing Postgres connection") || err.message.includes("POSTGRES_URL"));
    if (typeof console !== "undefined" && console.error && !isMissingConnection) {
      console.error("[services] DB error:", err);
    }
    return { error: toServiceError(err) };
  }
}
