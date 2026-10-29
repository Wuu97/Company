"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function UserAdminActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function update(body: object) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setMessage("账号信息已更新。");
        setShowReset(false);
        setPassword("");
        router.refresh();
      } else setMessage(userFeedback.retry("更新账号"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("初始密码至少需要 8 位。");
      return;
    }
    void update({ action: "reset-password", password });
  }
  return (
    <div className={businessStyles["user-admin-actions"]}>
      <Button
        size="small"
        disabled={busy}
        onClick={() => void update({ action: "set-active", active: !active })}
      >
        {busy ? "处理中…" : active ? "停用账号" : "启用账号"}
      </Button>{" "}
      <Button
        size="small"
        disabled={busy}
        onClick={() => setShowReset(true)}
      >
        重置密码
      </Button>
      {showReset && (
        <form className={businessStyles["password-reset-form"]} onSubmit={resetPassword}>
          <TextField label="新初始密码" type="password" value={password} minLength={8} autoComplete="new-password" onChange={(event) => setPassword(event.target.value)} placeholder="至少 8 位" disabled={busy} required />
          <Button type="submit" size="small" disabled={busy}>
            {busy ? "正在保存…" : "确认重置"}
          </Button>
          <Button
            variant="neutral"
            size="small"
            disabled={busy}
            onClick={() => {
              setShowReset(false);
              setPassword("");
            }}
          >
            返回
          </Button>
        </form>
      )}
      {message && <FeedbackMessage tone={message.includes("已更新") ? "success" : "error"} as="small">{message}</FeedbackMessage>}
    </div>
  );
}
