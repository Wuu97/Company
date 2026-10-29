export const DEFAULT_ETB_MANUAL_ESCALATION_MS = 60 * 60_000;

export function etbManualEscalationBefore(now = new Date(), waitMs = DEFAULT_ETB_MANUAL_ESCALATION_MS) {
  return new Date(now.valueOf() - waitMs);
}
