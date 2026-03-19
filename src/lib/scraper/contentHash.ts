import { createHash } from "crypto";

export function hashContent(html: string): string {
  return createHash("sha256").update(html).digest("hex");
}
