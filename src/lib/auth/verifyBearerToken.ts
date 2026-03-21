import { timingSafeEqual } from "crypto";

export function verifyBearerToken(
  authHeader: string | null,
  secret: string
): boolean {
  if (!authHeader || !secret) return false;
  if (!authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  if (!token) return false;

  const tokenBuf = Buffer.from(token);
  const secretBuf = Buffer.from(secret);

  if (tokenBuf.length !== secretBuf.length) return false;

  return timingSafeEqual(tokenBuf, secretBuf);
}
