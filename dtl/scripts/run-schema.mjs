#!/usr/bin/env node
/**
 * Run lib/db/schema.sql against POSTGRES_URL.
 * Usage: npm run db:schema (requires .env or .env.local with POSTGRES_URL)
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "lib", "db", "schema.sql");

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Set POSTGRES_URL or DATABASE_URL in .env or .env.local");
  process.exit(1);
}

const schema = readFileSync(schemaPath, "utf8");
const client = new pg.Client({ connectionString: url });

try {
  await client.connect();
  await client.query(schema);
  console.log("Schema applied successfully.");
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
} finally {
  await client.end();
}
