import { sql as vercelSql } from "@vercel/postgres";

function ensurePostgresUrl(): void {
  const hasPostgresUrl = Boolean(process.env.POSTGRES_URL);
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
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
