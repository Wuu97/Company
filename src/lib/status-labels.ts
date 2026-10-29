export type StatusTone = "default" | "success" | "warning" | "critical" | "muted" | "unread";

const labels: Record<string, string> = {
  PENDING_REVIEW: "待处理", CONFIRMED: "已确认", IN_PROGRESS: "进行中", COMPLETED: "已完成", CANCELLED: "已取消",
  PENDING: "待处理", PROCESSING: "处理中", PARSED: "已解析", FAILED: "失败", VERIFIED: "已核对",
  DRAFT: "草稿", REPLACED: "已替代", PLANNED: "待派车", DISPATCHED: "已派车", IN_TRANSIT: "运输中",
  PARTIAL: "部分确认", OPEN: "待联系", RESOLVED: "已处理", NOT_REQUIRED: "不适用",
  QUEUED: "排队中", RUNNING: "执行中", SUCCEEDED: "成功", AWAITING_MANUAL: "待人工处理", MANUAL: "人工处理", NONE: "无会话",
  ADOPTED: "已采用", REJECTED: "已拒绝", IGNORED: "已忽略", SUPERSEDED: "已替代", DEFERRED: "已延期",
};
export function statusLabel(value: string | null | undefined) { return value ? labels[value] || value : "—"; }

const tones: Record<string, StatusTone> = {
  CONFIRMED: "success", COMPLETED: "success", VERIFIED: "success", RESOLVED: "success", SUCCEEDED: "success", ADOPTED: "success",
  PENDING_REVIEW: "warning", IN_PROGRESS: "warning", PENDING: "warning", PROCESSING: "warning", PARSED: "warning", PARTIAL: "warning", OPEN: "warning", PLANNED: "warning", DISPATCHED: "warning", IN_TRANSIT: "warning", QUEUED: "warning", RUNNING: "warning",
  FAILED: "critical", CANCELLED: "critical", REJECTED: "critical", AWAITING_MANUAL: "critical",
  DRAFT: "muted", REPLACED: "muted", SUPERSEDED: "muted", IGNORED: "muted", NOT_REQUIRED: "muted", MANUAL: "muted", NONE: "muted",
  DEFERRED: "warning", ACTIVE: "success", EXPIRED: "warning", ROBOT_VERIFICATION_REQUIRED: "critical", MANUAL_HANDOFF_REQUIRED: "critical",
};

/** Resolve a badge tone from a business status code, never from its display text. */
export function statusTone(value: string | null | undefined): StatusTone { return value ? tones[value] || "default" : "default"; }
