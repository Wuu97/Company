import { randomUUID } from "node:crypto";

/** Generated on the server; independent requests never share a counter. */
export function businessCode(prefix: string): string {
  return `${prefix}-${randomUUID().replaceAll("-", "")}`;
}
