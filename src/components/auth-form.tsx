"use client";
import { useState } from "react";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { TextField } from "@/components/ui/form-controls";
import styles from "./auth-form.module.css";

export function AuthForm({ mode }: { mode: "login" | "setup" }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const setup = mode === "setup";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      if (response.ok) location.href = "/";
      else
        setMessage(
          setup
            ? userFeedback.retry("创建账号")
            : "邮箱或密码不正确，请重新输入。",
        );
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      {setup && (
        <TextField label="姓名" name="name" placeholder="请填写姓名" required minLength={2} disabled={busy} />
      )}
      <TextField label="邮箱" name="email" type="email" placeholder="name@company.com" required disabled={busy} />
      <TextField label="密码" name="password" type="password" placeholder={setup ? "至少 8 位" : "请输入密码"} required minLength={setup ? 8 : undefined} disabled={busy} />
      <Button type="submit" wide disabled={busy}>
        {busy ? "处理中…" : setup ? "创建账号并进入系统" : "登录"}
      </Button>
      {message && (
        <FeedbackMessage tone="error">{message}</FeedbackMessage>
      )}
    </form>
  );
}
