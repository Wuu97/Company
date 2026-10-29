export function etbRunAlert(input: { terminal: string; runId: string; status: "FAILED" | "AWAITING_MANUAL"; reason?: string | null }) {
  const manual = input.status === "AWAITING_MANUAL";
  return {
    kind: manual ? "ETB_MANUAL_HANDOFF" : "ETB_QUERY_FAILED",
    title: manual ? `${input.terminal} ETB 查询需要人工接管` : `${input.terminal} ETB 查询失败`,
    body: input.reason || (manual ? "请完成登录、验证码或页面异常处理后重新排队。" : "请检查 Worker、会话和数据源后重试。"),
    href: "/etb-runs",
    dedupeKey: `etb-run:${input.runId}:${input.status}`,
  };
}
