"use client";
import { useState } from "react";

export function UserAdminActions({ id, active }: { id: string; active: boolean }) {
  const [message, setMessage] = useState("");
  async function update(body: object) {
    const response = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) location.reload(); else setMessage((await response.json()).error || "操作失败");
  }
  function resetPassword() { const password = window.prompt("输入不少于 12 位的新初始密码："); if (password) void update({ action: "reset-password", password }); }
  return <><button type="button" className="small-button" onClick={() => void update({ action: "set-active", active: !active })}>{active ? "停用" : "启用"}</button> <button type="button" className="small-button" onClick={resetPassword}>重置密码</button>{message && <small className="error">{message}</small>}</>;
}
