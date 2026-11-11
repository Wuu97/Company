import { etbNotificationBody } from "./notification-content";

export function etbRunAlert(input: { terminal: string; runId: string; status: "FAILED" | "AWAITING_MANUAL"; reason?: string | null }) {
  const manual = input.status === "AWAITING_MANUAL";
  return {
    kind: manual ? "ETB_MANUAL_HANDOFF" : "ETB_QUERY_FAILED",
    title: manual ? `${input.terminal}靠泊时间查询需要人工处理` : `${input.terminal}靠泊时间查询失败`,
    body: etbNotificationBody(input.reason, manual),
    href: "/etb-runs",
    dedupeKey: `etb-run:${input.runId}:${input.status}`,
  };
}
