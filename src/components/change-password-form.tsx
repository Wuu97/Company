"use client";
import { useState } from "react";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import styles from "./change-password-form.module.css";
import { FeedbackMessage } from "@/components/ui/feedback-message";
function PasswordField({ label, name, busy, hint, onChange }: { label: string; name: string; busy: boolean; hint?: string; onChange?: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  return <div className={styles.field}><label htmlFor={name}>{label} <span>*</span></label><div className={styles.inputWrap}><input id={name} name={name} onChange={(event) => onChange?.(event.target.value)} type={visible ? "text" : "password"} autoComplete={name === "currentPassword" ? "current-password" : "new-password"} minLength={name === "currentPassword" ? undefined : 8} maxLength={200} required disabled={busy} aria-describedby={hint ? `${name}-hint` : undefined} /><button type="button" disabled={busy} aria-label={`${visible ? "隐藏" : "显示"}${label}`} aria-pressed={visible} onClick={() => setVisible(!visible)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{visible && <path d="m3 3 18 18"/>}</svg></button></div>{hint && <small id={`${name}-hint`}>{hint}</small>}</div>;
}
export function ChangePasswordForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(rule => rule.test(password)).length;
  const strength = password.length < 8 ? 1 : password.length >= 12 && variety >= 3 ? 3 : variety >= 2 ? 2 : 1;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const values = new FormData(formElement);
    if (values.get("newPassword") !== values.get("confirmPassword")) {
      setMessage("两次输入的新密码不一致，请重新确认。");
      return;
    }
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
        setMessage("密码已更新，其他设备已退出登录。");
      } else setMessage(userFeedback.retry("修改密码"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form key={resetKey} className={styles.form} onSubmit={submit} onReset={() => { setPassword(""); setMessage(""); setResetKey(key => key + 1); }}>
      <PasswordField label="当前密码" name="currentPassword" busy={busy} />
      <PasswordField label="新密码" name="newPassword" busy={busy} onChange={setPassword} hint="至少 8 位，建议使用字母、数字和符号组合。" />
      {password && <div className={styles.strength} role="status" aria-label={`密码强度：${["弱", "中", "强"][strength - 1]}`}><div className={styles.bars}>{[1, 2, 3].map(level => <span key={level} data-active={level <= strength} data-strength={strength} />)}</div><small>密码强度：{["弱", "中", "强"][strength - 1]}（仅供参考）</small></div>}
      <PasswordField label="确认新密码" name="confirmPassword" busy={busy} />
      <div className={styles.actions}><Button type="reset" variant="reset" disabled={busy}>重置</Button><Button type="submit" className={styles.updateButton} disabled={busy}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6l-9-3Z"/><path d="m8 12 3 3 5-6"/></svg>{busy ? "正在修改…" : "更新密码"}</Button></div>
      {message && <FeedbackMessage tone={message.startsWith("密码已") ? "success" : "error"}>{message}</FeedbackMessage>}
    </form>
  );
}
