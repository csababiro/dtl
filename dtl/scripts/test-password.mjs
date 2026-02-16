#!/usr/bin/env node
/**
 * Test password hash/verify logic (same as lib/password.ts).
 * Run: node scripts/test-password.mjs
 */
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);
const SALT_LEN = 16;
const KEY_LEN = 64;
const FORMAT = "scrypt:v1";

async function hashPassword(plain) {
  const salt = randomBytes(SALT_LEN);
  const key = await scryptAsync(plain, salt, KEY_LEN);
  const saltHex = salt.toString("hex");
  const keyHex = key.toString("hex");
  return `${FORMAT}:${saltHex}:${keyHex}`;
}

async function verifyPassword(plain, stored) {
  const parts = stored.split(":");
  console.log("  parts.length:", parts.length, "parts[0]:", parts[0], "parts[1]:", parts[1]);
  if (parts.length !== 4 || parts[0] !== "scrypt" || parts[1] !== "v1") {
    console.log("  -> verify FAIL (format check)");
    return false;
  }
  const saltHex = parts[2];
  const keyHex = parts[3];
  const salt = Buffer.from(saltHex, "hex");
  const key = await scryptAsync(plain, salt, KEY_LEN);
  const match = key.toString("hex") === keyHex;
  console.log("  -> verify", match ? "OK" : "FAIL");
  return match;
}

function decodeStoredHash(raw) {
  if (raw == null) return undefined;
  const s = String(raw).trim();
  if (s.length === 0) return undefined;
  if (s.includes(":")) return s;
  try {
    const decoded = Buffer.from(s, "hex").toString("utf8");
    return decoded.startsWith("scrypt:v1:") ? decoded : s;
  } catch {
    return s;
  }
}

async function main() {
  const plain = "qwertyui";
  console.log("1. hashPassword('" + plain + "')");
  const hash = await hashPassword(plain);
  console.log("   hash length:", hash.length, "split(':').length:", hash.split(":").length);
  console.log("2. verifyPassword(plain, hash)");
  const ok1 = await verifyPassword(plain, hash);
  console.log("3. Simulate DB: store as hex, decode, verify");
  const storedHex = Buffer.from(hash, "utf8").toString("hex");
  const decoded = decodeStoredHash(storedHex);
  console.log("   decoded length:", decoded?.length, "decoded === hash:", decoded === hash);
  const ok2 = decoded ? await verifyPassword(plain, decoded) : false;
  console.log("4. result:", ok1 && ok2 ? "PASS" : "FAIL (ok1=" + ok1 + " ok2=" + ok2 + ")");
  process.exit(ok1 && ok2 ? 0 : 1);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
