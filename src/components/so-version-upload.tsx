"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { FileUploadTrigger } from "@/components/ui/file-upload-trigger";
export function SoVersionUpload({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/orders/upload", {
        method: "POST",
        body: new FormData(form),
      });
      if (response.ok) {
        form.reset();
        setMessage("新版本已上传，解析完成后会更新订单信息。");
        router.refresh();
      } else setMessage(userFeedback.retry("上传 SO 文件"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h3>更新 SO 文件</h3>
      <form className={businessStyles["so-version-upload__actions"]} onSubmit={submit}>
        <input type="hidden" name="soOrderId" value={orderId} />
        <FileUploadTrigger name="file" accept="application/pdf" required busy={busy} variant="secondary">选择新的 SO 文件</FileUploadTrigger>
        <Button type="submit" disabled={busy}>{busy ? "正在上传…" : "上传新版本"}</Button>
      </form>
      {message && (
        <FeedbackMessage>{message}</FeedbackMessage>
      )}
    </section>
  );
}
