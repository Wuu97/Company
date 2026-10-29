"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function RequestEtbQueryButton({
  orderId,
  enabled,
  reason,
}: {
  orderId: string;
  enabled: boolean;
  reason?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function request() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/etb-query`, {
        method: "POST",
      });
      const body = await response.json().catch(() => ({}));
      setMessage(
        response.ok
          ? body.queued
            ? "已安排按当前 SO 的船名、航次查询预计靠港时间。完成后会生成待确认记录，不会自动改动业务安排。"
            : "该 SO 对应船期正在更新中，请稍后查看最新时间。"
          : body.error || userFeedback.retry("更新预计靠港时间"),
      );
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={businessStyles["schedule-request"]}>
      <Button wide="mobile" onClick={request} disabled={!enabled || busy}>
        {busy ? "正在安排…" : "更新预计靠港时间"}
      </Button>
      {!enabled && (
        <small>{reason || "SO 缺少船名、航次或装货港，暂时无法查询。"}</small>
      )}
      {message && (
        <FeedbackMessage as="small">{message}</FeedbackMessage>
      )}
    </div>
  );
}
