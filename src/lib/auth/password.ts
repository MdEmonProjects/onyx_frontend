import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/*
 * Password hashing with Node's built-in scrypt, so there's no native
 * dependency to build. Stored as `scrypt$N$r$p$salt$hash` (base64url), which
 * keeps the cost settings with each hash and lets them be raised later.
 *
 * No "server-only" import: the seed script uses this outside Next.js.
 */

const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

function derive(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const key = await derive(password, Buffer.from(salt, "base64url"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/**
 * A real hash of a throwaway password. Checking against it when the email
 * isn't found makes "no such user" take as long as "wrong password", so the
 * login form can't be used to find out which emails exist.
 */
export const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);
