"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import styles from "./admin-settings-forms.module.css";

async function apiError(response: Response, fallback: string) {
  await response.text();
  return fallback;
}

export function UserCreateForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      if (response.ok) {
        formElement.reset();
        setMessage("账号已创建。");
        router.refresh();
      } else
        setMessage(await apiError(response, userFeedback.retry("创建账号")));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      <TextField label="姓名" name="name" placeholder="填写成员姓名" required disabled={busy} />
      <TextField label="邮箱" name="email" type="email" placeholder="name@company.com" required disabled={busy} />
      <TextField label="初始密码" name="password" type="password" minLength={8} placeholder="至少 8 位" required disabled={busy} />
      <SelectField label="账户权限" name="role" defaultValue="OPERATOR" disabled={busy}>
          <option value="OPERATOR">业务成员：处理日常业务</option>
          <option value="ADMIN">负责人：可管理账号与系统设置</option>
      </SelectField>
      <Button type="submit" disabled={busy}>{busy ? "正在创建…" : "创建账号"}</Button>
      {message && <FeedbackMessage tone={message.startsWith("账号已") ? "success" : "error"} as="small">{message}</FeedbackMessage>}
    </form>
  );
}

export function CredentialForm({
  terminal,
  username,
}: {
  terminal: string;
  username?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/data-sources/${encodeURIComponent(terminal)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(Object.fromEntries(form)),
        },
      );
      if (response.ok) {
        setMessage("账号已安全保存，可继续验证登录。 ");
        formElement.reset();
      } else
        setMessage(
          await apiError(response, userFeedback.retry("保存平台账号")),
        );
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      <TextField label="平台账号" name="username" defaultValue={username} placeholder="填写平台登录账号" required disabled={busy} />
      <TextField label="平台密码" name="password" type="password" placeholder="保存后不可再次查看" required disabled={busy} />
      <Button type="submit" disabled={busy}>
        {busy ? "正在保存…" : `保存 ${terminal} 账号`}
      </Button>
      {message && <FeedbackMessage tone={message.startsWith("账号已") ? "success" : "error"} as="small">{message}</FeedbackMessage>}
    </form>
  );
}

export function TestCredentialButton({ terminal }: { terminal: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function test() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/data-sources/${encodeURIComponent(terminal)}/test`,
        { method: "POST" },
      );
      if (response.ok) {
        setMessage("已安排验证登录，请稍后查看结果。");
        router.refresh();
      } else
        setMessage(
          await apiError(response, userFeedback.retry("安排平台登录验证")),
        );
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        size="small"
        onClick={test}
        disabled={busy}
      >
        {busy ? "正在安排…" : "验证平台登录"}
      </Button>
      {message && <FeedbackMessage tone={message.startsWith("已安排") ? "success" : "error"} as="small">{message}</FeedbackMessage>}
    </>
  );
}
