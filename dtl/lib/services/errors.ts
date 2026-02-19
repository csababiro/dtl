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

function isMissingConnectionError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message;
    return (
      msg.includes("Missing Postgres connection") || msg.includes("POSTGRES_URL")
    );
  }
  return false;
}

export function toServiceError(err: unknown): ServiceError {
  if (err instanceof Error && !isDbError(err)) {
    return { code: "validation", message: err.message };
  }
  if (isMissingConnectionError(err)) {
    return {
      code: "db",
      message:
        "Baza de date nu este configurată. Setează POSTGRES_URL (sau DATABASE_URL) în .env sau în Vercel Environment Variables. Vezi .env.example.",
    };
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
    const isMissingConnection =
      err instanceof Error &&
      (err.message.includes("Missing Postgres connection") || err.message.includes("POSTGRES_URL"));
    if (typeof console !== "undefined" && console.error && !isMissingConnection) {
      console.error("[services] DB error:", err);
    }
    return { error: toServiceError(err) };
  }
}
