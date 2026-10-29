export const DEFAULT_ETB_RUN_LEASE_MS = 60 * 60_000;

export function staleEtbRunBefore(now = new Date(), leaseMs = DEFAULT_ETB_RUN_LEASE_MS) {
  return new Date(now.valueOf() - leaseMs);
}
