"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import styles from "./parse-pending-button.module.css";

export function ParsePendingButton({
  orderId,
  compact = false,
  variant = "secondary",
  size = "default",
  onStatusChange,
  onProgressChange,
  fileIds,
  requireFiles = false,
  reloadOnComplete = true,
  reparse = false,
  className,
}: {
  orderId?: string;
  compact?: boolean;
  variant?: "primary" | "secondary";
  size?: "default" | "toolbar" | "small";
  onStatusChange?: (status: { state: "running" | "success" | "error"; message: string }) => void;
  onProgressChange?: (progress: { completed: number; total: number; files?: Array<{ id: string; parseStatus: string }> }) => void;
  fileIds?: string[];
  requireFiles?: boolean;
  reloadOnComplete?: boolean;
  reparse?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "running" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function run() {
    setState("running");
    const runningMessage = "正在识别订单信息…";
    setMessage(runningMessage);
    onStatusChange?.({ state: "running", message: runningMessage });
    const selectedFileIds = fileIds?.filter(Boolean) || [];
    const refreshProgress = async () => {
      if (!selectedFileIds.length) return;
      const response = await fetch(`/api/orders/parse/progress?fileIds=${encodeURIComponent(selectedFileIds.join(","))}`);
      const progress = await response.json().catch(() => null) as { completed?: number; total?: number; files?: Array<{ id: string; parseStatus: string }> } | null;
      if (response.ok && progress) onProgressChange?.({ completed: progress.completed || 0, total: progress.total || selectedFileIds.length, files: progress.files });
    };
    let progressTimer: number | undefined;
    try {
      await refreshProgress();
      progressTimer = selectedFileIds.length ? window.setInterval(() => { void refreshProgress(); }, 500) : undefined;
      const response = await fetch("/api/orders/parse", {
        method: "POST",
        headers: orderId || selectedFileIds.length ? { "content-type": "application/json" } : undefined,
        body: orderId || selectedFileIds.length ? JSON.stringify({ orderId, fileIds: selectedFileIds, reparse }) : undefined,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || "订单信息暂未识别完成，请稍后重试。");
      await refreshProgress();
      const nextState = result.failedCount ? "error" : "success";
      const nextMessage =
        result.failedCount
          ? `已识别 ${result.processedCount || 0} 份 SO；另有 ${result.failedCount} 份未完成，请在订单列表中打开后查看。`
          : result.processedCount
            ? `已识别 ${result.processedCount} 份 SO，订单列表已更新。`
            : "没有需要识别的 SO。 ";
      setState(nextState);
      setMessage(nextMessage);
      onStatusChange?.({ state: nextState, message: nextMessage });
      onProgressChange?.({ completed: selectedFileIds.length, total: selectedFileIds.length });
      if (reloadOnComplete) {
        // A route replacement restores the browser to the top of the list.
        // Refresh server data in place so a card action keeps its viewport.
        router.refresh();
      } else router.refresh();
    } catch (error) {
      const nextMessage =
        error instanceof Error
          ? error.message
          : "订单信息暂未识别完成，请稍后重试。";
      setState("error");
      setMessage(nextMessage);
      onStatusChange?.({ state: "error", message: nextMessage });
    } finally {
      if (progressTimer) window.clearInterval(progressTimer);
    }
  }

  return (
    <div className={compact ? styles.compact : styles.actions}>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={run}
        disabled={state === "running" || (requireFiles && !fileIds?.length)}
        title={requireFiles && !fileIds?.length ? "请先上传至少一个 SO 文件" : undefined}
      >
        {state === "running"
          ? "识别中…"
          : orderId
            ? reparse ? "重新解析" : "识别此 SO"
            : "识别 SO 信息"}
      </Button>
      {message && !onStatusChange && (!compact || state === "error") && (
        <FeedbackMessage as="span" tone={state === "error" ? "error" : state === "success" ? "success" : "info"}>{message}</FeedbackMessage>
      )}
    </div>
  );
}
