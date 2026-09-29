"use client";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "setup" }) {
  const [message, setMessage] = useState("");
  const setup = mode === "setup";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("正在处理…");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      if (response.ok) location.href = "/";
      else { const body = await response.text(); let error = `服务返回错误（${response.status}）`; try { const parsed = JSON.parse(body); error = parsed.message || parsed.error || error; } catch {} setMessage(error); }
    } catch { setMessage("无法连接系统，请稍后重试"); }
  }
  return <form className="auth-form" onSubmit={submit}>{setup && <input name="name" placeholder="姓名" required minLength={2}/>}<input name="email" type="email" placeholder="邮箱" required/><input name="password" type="password" placeholder={setup ? "设置至少 8 位密码" : "密码"} required minLength={setup ? 8 : undefined}/><button>{setup ? "创建账号并进入系统" : "登录"}</button>{message && <p className="error">{message}</p>}</form>;
}
