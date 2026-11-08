"use client";
import { LogOut } from "lucide-react";
import sidebarStyles from "./sidebar.module.css";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { Button } from "@/components/ui/button";
export function LogoutButton({
  compact = false,
  iconOnly = false,
}: {
  compact?: boolean;
  iconOnly?: boolean;
}) {
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
  if (iconOnly)
    return (
      <div>
        <button
          type="button"
          className={sidebarStyles.logout}
          onClick={logout}
          disabled={busy}
          aria-label={busy ? "退出中…" : "退出登录"}
          title="退出登录"
        >
          <LogOut size={17} aria-hidden="true" />
        </button>
        {message && (
          <p className={sidebarStyles.error} role="alert">
            {message}
          </p>
        )}
      </div>
    );
  return (
    <>
      <Button
        onClick={logout}
        disabled={busy}
        size={compact ? "small" : "default"}
      >
        {busy ? "退出中…" : "退出登录"}
      </Button>
      {message && (
        <small className={businessStyles["sidebar-message"]}>{message}</small>
      )}
    </>
  );
}
