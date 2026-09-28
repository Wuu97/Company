"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ParsePendingButton() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function run() {
    setState("running");
    setMessage("正在解析已上传的 SO，请稍候…");
    try {
      const response = await fetch("/api/orders/parse", { method: "POST" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "解析失败，请稍后重试。");
      setState(result.failedCount ? "error" : "success");
      setMessage(result.failedCount ? `已解析 ${result.processedCount || 0} 份，${result.failedCount} 份失败。请打开失败 SO 查看并重试。` : result.processedCount ? `已完成 ${result.processedCount} 份 SO 解析，列表已更新。` : "没有待解析的 SO。");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "解析失败，请稍后重试。");
    }
  }

  return <div className="inline-action"><button type="button" onClick={run} disabled={state === "running"}>{state === "running" ? "解析中…" : "运行待解析 SO"}</button>{message && <span className={`action-message ${state}`}>{message}</span>}</div>;
}
