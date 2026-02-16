#!/usr/bin/env node
/**
 * Set password for an admin user by email (one-off recovery).
 * Uses same scrypt format as lib/password.ts.
 * Loads .env from project root so same DB as the app.
 *
 * Usage (from dtl folder, where .env lives):
 *   node scripts/set-password.mjs admin@dtl.ro qwertyui
 * Or: npm run set-password -- admin@dtl.ro qwertyui
 */
import pg from "pg";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

function loadEnv(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
loadEnv(envPath);

const scryptAsync = promisify(scrypt);
const SALT_LEN = 16;
const KEY_LEN = 64;
const FORMAT = "scrypt:v1";

async function hashPassword(plain) {
  const salt = randomBytes(SALT_LEN);
  const key = await scryptAsync(plain, salt, KEY_LEN);
  const saltHex = salt.toString("hex");
  const keyHex = Buffer.isBuffer(key) ? key.toString("hex") : Buffer.from(key).toString("hex");
  return `${FORMAT}:${saltHex}:${keyHex}`;
}

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const email = process.env.SET_PASSWORD_EMAIL || process.argv[2];
const password = process.env.SET_PASSWORD_PASS || process.argv[3];

if (!url) {
  console.error("Set POSTGRES_URL or DATABASE_URL in .env");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: node scripts/set-password.mjs <email> <password>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters");
  process.exit(1);
}

const normalized = String(email).trim().toLowerCase();
const client = new pg.Client({ connectionString: url });

try {
  await client.connect();
  const hashed = await hashPassword(password.trim());
  const res = await client.query(
    `UPDATE users SET password_hash = $1 WHERE LOWER(TRIM(email)) = $2 RETURNING id, name, email`,
    [hashed, normalized]
  );
  if (res.rowCount === 0) {
    console.error("No user found with email:", normalized);
    process.exit(1);
  }
  console.log("Password set for:", res.rows[0].email);
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
} finally {
  await client.end();
}
