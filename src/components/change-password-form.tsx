"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
export function ChangePasswordForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const values = new FormData(formElement);
    if (
      String(values.get("currentPassword")) ===
      String(values.get("newPassword"))
    ) {
      setMessage("新密码不能与当前密码相同。");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(values)),
      });
      if (response.ok) {
        setMessage("密码已更新，其他设备已退出登录。");
        formElement.reset();
      } else setMessage(userFeedback.retry("修改密码"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={[businessStyles["auth-form"], businessStyles["password-form"]].join(" ")} onSubmit={submit}>
      <TextField label="当前密码" name="currentPassword" type="password" autoComplete="current-password" required disabled={busy} />
      <TextField label="新密码" name="newPassword" type="password" autoComplete="new-password" minLength={8} required disabled={busy} hint="至少 8 位，建议使用字母、数字和符号组合。" />
      <Button type="submit" disabled={busy}>{busy ? "正在修改…" : "更新密码"}</Button>
      {message && <FeedbackMessage tone={message.startsWith("密码已") ? "success" : "error"}>{message}</FeedbackMessage>}
    </form>
  );
}
