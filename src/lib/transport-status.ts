import type { TransportStatus } from "@prisma/client";

const transitions: Record<TransportStatus, readonly TransportStatus[]> = {
  PLANNED: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransitionTransportStatus(from: TransportStatus, to: TransportStatus) {
  return transitions[from].includes(to);
}

export function assertTransportStatusTransition(from: TransportStatus, to: TransportStatus) {
  if (from === to) return;
  if (!canTransitionTransportStatus(from, to)) {
    throw new Error(`不允许将运输状态从 ${from} 变更为 ${to}`);
  }
}
