import { sql as vercelSql } from "@vercel/postgres";

function ensurePostgresUrl(): void {
  const hasPostgresUrl = Boolean(process.env.POSTGRES_URL);
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  // #region agent log
  fetch("http://127.0.0.1:7244/ingest/38291e03-8924-411d-af90-c560fa478f53", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "lib/db/index.ts:ensurePostgresUrl",
      message: "ensurePostgresUrl check",
      data: { hasPostgresUrl, hasDatabaseUrl, willThrow: !hasPostgresUrl && !hasDatabaseUrl },
      timestamp: Date.now(),
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  if (!hasPostgresUrl && !hasDatabaseUrl) {
    throw new Error(
      "Missing Postgres connection: set POSTGRES_URL (or DATABASE_URL) in .env or in Vercel Project Settings > Environment Variables. See .env.example."
    );
  }
}

/** SQL tag; throws a clear error if POSTGRES_URL/DATABASE_URL is not set. */
export function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): ReturnType<typeof vercelSql> {
  ensurePostgresUrl();
  return vercelSql(strings, ...(values as (string | number | boolean | undefined | null)[]));
}
