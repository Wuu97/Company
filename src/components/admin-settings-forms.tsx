"use client";
import { useState } from "react";

async function apiError(response: Response, fallback: string) { const body = await response.text(); try { return JSON.parse(body).error || fallback; } catch { return body ? `服务返回错误（${response.status}）` : fallback; } }

export function UserCreateForm() {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    if (response.ok) location.reload(); else setMessage(await apiError(response, "创建失败"));
  }
  return <form className="settings-form" onSubmit={submit}><input name="name" placeholder="姓名" required/><input name="email" type="email" placeholder="邮箱" required/><input name="password" type="password" minLength={8} placeholder="初始密码（至少 8 位）" required/><select name="role" defaultValue="OPERATOR"><option value="OPERATOR">成员（记录标签）</option><option value="ADMIN">负责人（记录标签）</option></select><button>创建用户</button>{message && <small className="error">{message}</small>}</form>;
}

export function CredentialForm({ terminal, username }: { terminal: string; username?: string }) {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    const response = await fetch(`/api/admin/data-sources/${encodeURIComponent(terminal)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    if (response.ok) { setMessage("已加密保存。请在 Worker 中测试登录。"); formElement.reset(); } else setMessage(await apiError(response, "保存失败"));
  }
  return <form className="settings-form" onSubmit={submit}><input name="username" defaultValue={username} placeholder="平台账号" required/><input name="password" type="password" placeholder="平台密码（保存后不可查看）" required/><button>保存 {terminal} 账号</button>{message && <small className={message.startsWith("已") ? "success" : "error"}>{message}</small>}</form>;
}

export function TestCredentialButton({ terminal }: { terminal: string }) {
  const [message, setMessage] = useState("");
  async function test() {
    const response = await fetch(`/api/admin/data-sources/${encodeURIComponent(terminal)}/test`, { method: "POST" });
    if (response.ok) { setMessage("测试任务已创建，等待受控 Worker 执行。"); location.reload(); } else setMessage(await apiError(response, "创建测试失败"));
  }
  return <><button type="button" className="small-button" onClick={test}>测试自动登录</button>{message && <small className="error">{message}</small>}</>;
}
