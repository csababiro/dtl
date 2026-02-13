/**
 * Password hashing and verification using Node crypto (scrypt).
 * No external dependency; safe for server-side use.
 */

import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const SALT_LEN = 16;
const KEY_LEN = 64;
const FORMAT = "scrypt:v1"; // prefix so we can change algorithm later

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const key = (await scryptAsync(plain, salt, KEY_LEN)) as Buffer;
  const saltHex = salt.toString("hex");
  const keyHex = key.toString("hex");
  return `${FORMAT}:${saltHex}:${keyHex}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt:v1") return false;
  const [, saltHex, keyHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const key = (await scryptAsync(plain, salt, KEY_LEN)) as Buffer;
  return key.toString("hex") === keyHex;
}
