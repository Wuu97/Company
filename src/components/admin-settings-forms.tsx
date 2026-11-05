"use client";
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import styles from "./admin-settings-forms.module.css";

async function apiError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return typeof data.error === "string" ? data.error : fallback;
  } catch { return fallback; }
}

export function CreateMemberButton() {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>+ 新增成员</Button>{open && <Dialog title="新增成员" onClose={() => setOpen(false)} actions={null}><UserCreateForm /></Dialog>}</>;
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
      <Button type="submit" disabled={busy}>{busy ? "正在新增…" : "新增账号"}</Button>
      {message && <FeedbackMessage tone={message.startsWith("账号已") ? "success" : "error"} as="small">{message}</FeedbackMessage>}
    </form>
  );
}

export function EditCredentialButton({ terminal, username }: { terminal: string; username?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return <><Button size="small" onClick={() => setOpen(true)}>{username ? "编辑账号" : "配置账号"}</Button>{open && <Dialog variant="credential" title={<span className={styles.dialogHeading}>{username ? "编辑平台账号" : "配置平台账号"} <span className={styles.portBadge}>{terminal}港</span></span>} onClose={() => setOpen(false)} actions={null}><div className={styles.credentialDialog}><CredentialForm terminal={terminal} username={username} onCancel={() => setOpen(false)} onSaved={() => { setOpen(false); router.refresh(); }} /></div></Dialog>}</>;
}

export function CredentialForm({
  terminal,
  username,
  onSaved,
  onCancel,
}: {
  terminal: string;
  username?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        onSaved?.();
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
      <div className={styles.passwordField}><label htmlFor="credential-password">平台密码 <em>*</em></label><div className={styles.passwordInput}><input id="credential-password" name="password" type={showPassword ? "text" : "password"} placeholder="输入新密码以覆盖原密码" autoComplete="new-password" required disabled={busy} aria-describedby="credential-password-hint" /><button type="button" aria-label={showPassword ? "隐藏输入的密码" : "显示输入的密码"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} disabled={busy}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{!showPassword && <path d="M3 3l18 18"/>}</svg></button></div><small id="credential-password-hint"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 6v1"/></svg> 密码加密保存，仅管理员可查看；输入新密码将覆盖原密码。</small></div>
      {message && <FeedbackMessage tone={message.startsWith("账号已") ? "success" : "error"} as="small">{message}</FeedbackMessage>}
      <div className={styles.dialogActions}><Button variant="outline" onClick={onCancel} disabled={busy}>取消</Button><Button type="submit" disabled={busy}>{busy ? "正在保存…" : "保存配置"}</Button></div>
    </form>
  );
}

export function TestCredentialButton({ terminal, pending = false }: { terminal: string; pending?: boolean }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);
  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(timer);
  }, [pending, router]);
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
        variant="outline"
        aria-busy={busy}
        onClick={test}
        disabled={busy}
      >
        {busy && <span className={styles.spinner} aria-hidden="true" />}{busy ? "正在安排…" : "测试连接"}
      </Button>
      {message && createPortal(<div className={styles.toast} role={message.startsWith("已安排") ? "status" : "alert"}><span aria-hidden="true">ⓘ</span>{message}</div>, document.body)}
    </>
  );
}

export function ViewCredentialButton({ terminal }: { terminal: string }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function reveal() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/data-sources/${encodeURIComponent(terminal)}`, { cache: "no-store" });
      const data = await response.json();
      if (response.ok) setPassword(data.password);
      else setMessage(data.error || userFeedback.retry("查看密码"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return <div className={styles.passwordLine}><code>{password || "••••••••"}</code><Button variant="text" size="small" aria-pressed={Boolean(password)} aria-label={password ? "隐藏平台密码" : "显示平台密码"} onClick={password ? () => setPassword("") : reveal} disabled={busy}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{password && <path d="m3 3 18 18"/>}</svg></Button>{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</div>;
}
