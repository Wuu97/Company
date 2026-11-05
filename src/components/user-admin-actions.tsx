"use client";
import { Dialog } from "@/components/ui/dialog";
import styles from "./admin-settings-forms.module.css";
import { useId, useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function UserAdminActions({
  id,
  active,
  name,
  email,
  role,
}: {
  id: string;
  active: boolean;
  name: string;
  email: string;
  role: string;
}) {
  const editFormId = useId();
  const resetFormId = useId();
  const [editing, setEditing] = useState(false);
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
        setEditing(false);
        setPassword("");
        router.refresh();
      } else {
        const data = await response.json();
        setMessage(data.error || userFeedback.retry("更新账号"));
      }
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
    <div
      className={[
        businessStyles["user-admin-actions"],
        styles.memberActions,
      ].join(" ")}
    >
      <div className={styles.memberCardActions}>
        <Button
          size="small"
          variant={active ? "danger" : "outline"}
          disabled={busy}
          onClick={() => {
            if (
              !active ||
              window.confirm("确定停用此账号？该成员将无法登录系统。")
            )
              void update({ action: "set-active", active: !active });
          }}
        >
          {active ? "停用" : "启用"}
        </Button>
        <Button
          size="small"
          variant="outline"
          disabled={busy}
          onClick={() => {
            setMessage("");
            setShowReset(true);
          }}
        >
          重置密码
        </Button>
        <Button
          size="small"
          disabled={busy}
          onClick={() => {
            setMessage("");
            setEditing(true);
          }}
        >
          编辑
        </Button>
      </div>
      {editing && (
        <Dialog
          title="编辑成员"
          closeDisabled={busy}
          onClose={() => setEditing(false)}
          actions={
            <>
              <Button
                size="toolbar"
                variant="outline"
                disabled={busy}
                onClick={() => setEditing(false)}
              >
                取消
              </Button>
              <Button
                size="toolbar"
                type="submit"
                form={editFormId}
                disabled={busy}
              >
                {busy ? "正在保存…" : "保存"}
              </Button>
            </>
          }
        >
          <form
            id={editFormId}
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void update({
                action: "edit",
                ...Object.fromEntries(new FormData(event.currentTarget)),
              });
            }}
          >
            <TextField
              label="姓名"
              name="name"
              defaultValue={name}
              required
              disabled={busy}
            />
            <TextField
              label="登录邮箱"
              name="email"
              type="email"
              defaultValue={email}
              required
              disabled={busy}
            />
            <SelectField
              label="账户权限"
              name="role"
              defaultValue={role}
              disabled={busy}
            >
              <option value="OPERATOR">业务成员</option>
              <option value="ADMIN">管理员</option>
            </SelectField>
            {message && (
              <FeedbackMessage tone="error" as="small">
                {message}
              </FeedbackMessage>
            )}
          </form>
        </Dialog>
      )}
      {showReset && (
        <Dialog
          title={"重置密码 · " + name}
          closeDisabled={busy}
          onClose={() => {
            setShowReset(false);
            setPassword("");
          }}
          actions={
            <>
              <Button
                size="toolbar"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setShowReset(false);
                  setPassword("");
                }}
              >
                取消
              </Button>
              <Button
                size="toolbar"
                type="submit"
                form={resetFormId}
                disabled={busy}
              >
                {busy ? "正在保存…" : "确认重置"}
              </Button>
            </>
          }
        >
          <form
            id={resetFormId}
            className={styles.form}
            onSubmit={resetPassword}
          >
            <TextField
              label="新初始密码"
              type="password"
              value={password}
              minLength={8}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 8 位"
              disabled={busy}
              required
            />
            <small>重置后，该成员现有的登录会话将退出。</small>
            {message && (
              <FeedbackMessage tone="error" as="small">
                {message}
              </FeedbackMessage>
            )}
          </form>
        </Dialog>
      )}
      {!editing && !showReset && message && (
        <FeedbackMessage
          tone={message.includes("已更新") ? "success" : "error"}
          as="small"
        >
          {message}
        </FeedbackMessage>
      )}
    </div>
  );
}
