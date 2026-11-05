"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import actionStyles from "@/components/action-button.module.css";
import { Button } from "@/components/ui/button";
export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function logout() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) location.href = "/login";
      else setMessage("退出失败，请稍后重试");
    } catch {
      setMessage("网络异常，请稍后重试");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        onClick={logout}
        disabled={busy}
        size={compact ? "small" : "default"}
        className={compact ? actionStyles.sidebarLogout : undefined}
      >
        {busy ? "退出中…" : "退出登录"}
      </Button>
      {message && <small className={businessStyles["sidebar-message"]}>{message}</small>}
    </>
  );
}
