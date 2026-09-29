"use client";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "setup" }) {
  const [message, setMessage] = useState("");
  const setup = mode === "setup";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("正在处理…");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    if (response.ok) location.href = "/"; else setMessage((await response.json()).error || "操作失败");
  }
  return <form className="auth-form" onSubmit={submit}>{setup && <input name="name" placeholder="姓名" required minLength={2}/>}<input name="email" type="email" placeholder="邮箱" required/><input name="password" type="password" placeholder={setup ? "设置至少 12 位密码" : "密码"} required minLength={setup ? 12 : undefined}/><button>{setup ? "创建账号并进入系统" : "登录"}</button>{message && <p className="error">{message}</p>}</form>;
}
