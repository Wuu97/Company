"use client";
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useId, useState } from "react";
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
  } catch {
    return fallback;
  }
}

export function CreateMemberButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="toolbar" onClick={() => setOpen(true)}>
        + 新增成员
      </Button>
      {open && (
        <UserCreateForm
          onCancel={() => setOpen(false)}
          onSaved={() => setOpen(false)}
        />
      )}
    </>
  );
}

export function UserCreateForm({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved?: () => void;
}) {
  const formId = useId();
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
        onSaved?.();
      } else
        setMessage(await apiError(response, userFeedback.retry("创建账号")));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      title="新增成员"
      closeDisabled={busy}
      onClose={onCancel}
      actions={
        <>
          <Button
            size="toolbar"
            variant="outline"
            onClick={onCancel}
            disabled={busy}
          >
            取消
          </Button>
          <Button size="toolbar" type="submit" form={formId} disabled={busy}>
            {busy ? "正在新增…" : "确认新增"}
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit}>
        <TextField
          label="姓名"
          name="name"
          placeholder="填写成员姓名"
          required
          disabled={busy}
        />
        <TextField
          label="登录邮箱"
          name="email"
          type="email"
          placeholder="name@company.com"
          required
          disabled={busy}
        />
        <SelectField
          label="账户权限"
          name="role"
          defaultValue="OPERATOR"
          disabled={busy}
        >
          <option value="OPERATOR">业务成员：处理日常业务</option>
          <option value="ADMIN">负责人：可管理账号与系统设置</option>
        </SelectField>
        <TextField
          label="初始密码"
          name="password"
          type="password"
          minLength={8}
          placeholder="至少 8 位"
          required
          disabled={busy}
        />
        {message && (
          <FeedbackMessage
            tone={message.startsWith("账号已") ? "success" : "error"}
            as="small"
          >
            {message}
          </FeedbackMessage>
        )}
      </form>
    </Dialog>
  );
}

export function EditCredentialButton({
  terminal,
  username,
}: {
  terminal: string;
  username?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        {username ? "编辑账号" : "配置账号"}
      </Button>
      {open && (
        <CredentialForm
          terminal={terminal}
          username={username}
          onCancel={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
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
  onCancel: () => void;
}) {
  const formId = useId();
  const passwordId = useId();
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
    <Dialog
      title={
        <span className={styles.dialogHeading}>
          {username ? "编辑平台账号" : "配置平台账号"}{" "}
          <span className={styles.portBadge}>
            {terminal}
            {["盐田", "蛇口"].includes(terminal) ? "港" : ""}
          </span>
        </span>
      }
      closeDisabled={busy}
      onClose={onCancel}
      actions={
        <>
          <Button
            size="toolbar"
            variant="outline"
            onClick={onCancel}
            disabled={busy}
          >
            取消
          </Button>
          <Button size="toolbar" type="submit" form={formId} disabled={busy}>
            {busy ? "正在保存…" : "保存"}
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit}>
        <TextField
          label="平台账号"
          name="username"
          defaultValue={username}
          placeholder="填写平台登录账号"
          required
          disabled={busy}
        />
        <div className={styles.passwordField}>
          <label htmlFor={passwordId}>
            平台密码 <em>*</em>
          </label>
          <div className={styles.passwordInput}>
            <input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="输入新密码以覆盖原密码"
              autoComplete="new-password"
              required
              disabled={busy}
              aria-describedby={`${passwordId}-hint`}
            />
            <Button
              variant="text"
              size="small"
              iconOnly
              aria-label={showPassword ? "隐藏输入的密码" : "显示输入的密码"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
              disabled={busy}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
                {!showPassword && <path d="M3 3l18 18" />}
              </svg>
            </Button>
          </div>
          <small id={`${passwordId}-hint`}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 9v5M10 6v1" />
            </svg>{" "}
            密码加密保存，仅管理员可查看；输入新密码将覆盖原密码。
          </small>
        </div>
        {message && (
          <FeedbackMessage
            tone={message.startsWith("账号已") ? "success" : "error"}
            as="small"
          >
            {message}
          </FeedbackMessage>
        )}
      </form>
    </Dialog>
  );
}

export function TestCredentialButton({
  terminal,
  pending = false,
}: {
  terminal: string;
  pending?: boolean;
}) {
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
        {busy && <span className={styles.spinner} aria-hidden="true" />}
        {busy ? "正在安排…" : "测试连接"}
      </Button>
      {message &&
        createPortal(
          <div
            className={styles.toast}
            role={message.startsWith("已安排") ? "status" : "alert"}
          >
            <span aria-hidden="true">ⓘ</span>
            {message}
          </div>,
          document.body,
        )}
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
      const response = await fetch(
        `/api/admin/data-sources/${encodeURIComponent(terminal)}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (response.ok) setPassword(data.password);
      else setMessage(data.error || userFeedback.retry("查看密码"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.passwordLine}>
      <code>{password || "••••••••"}</code>
      <Button
        variant="text"
        size="small"
        iconOnly
        aria-pressed={Boolean(password)}
        aria-label={password ? "隐藏平台密码" : "显示平台密码"}
        onClick={password ? () => setPassword("") : reveal}
        disabled={busy}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {password && <path d="m3 3 18 18" />}
        </svg>
      </Button>
      {message && (
        <FeedbackMessage tone="error" as="small">
          {message}
        </FeedbackMessage>
      )}
    </div>
  );
}

export function AddPlatformButton() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/data-sources", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setOpen(false);
        router.refresh();
      } else setMessage(await apiError(response, "添加平台失败"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        size="toolbar"
        onClick={() => {
          setMessage("");
          setOpen(true);
        }}
      >
        + 添加平台
      </Button>
      {open && (
        <Dialog
          title="添加平台"
          onClose={() => {
            if (!busy) setOpen(false);
          }}
          closeDisabled={busy}
          actions={
            <>
              <Button
                size="toolbar"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button
                size="toolbar"
                type="submit"
                form={formId}
                disabled={busy}
              >
                {busy ? "正在保存…" : "添加平台"}
              </Button>
            </>
          }
        >
          <form id={formId} className={styles.form} onSubmit={submit}>
            <TextField
              label="平台名称"
              name="terminal"
              maxLength={100}
              required
              disabled={busy}
            />
            <TextField
              label="登录网址"
              name="loginUrl"
              type="url"
              placeholder="https://"
              maxLength={2000}
              required
              disabled={busy}
            />
            <TextField
              label="平台账号"
              name="username"
              maxLength={200}
              required
              disabled={busy}
            />
            <TextField
              label="平台密码"
              name="password"
              type="password"
              autoComplete="new-password"
              maxLength={500}
              required
              disabled={busy}
            />
            <small>
              账号密码加密保存。新平台显示为待接入，完成适配后才能自动查询；可先打开网站手动登录。
            </small>
            {message && (
              <FeedbackMessage tone="error">{message}</FeedbackMessage>
            )}
          </form>
        </Dialog>
      )}
    </>
  );
}
