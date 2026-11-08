"use client";

import type { ReactNode } from "react";
import type { StatusTone } from "@/lib/status-labels";
import { StatusTag, type StatusTagType } from "./status-tag";
import styles from "./status-badge.module.css";

export function StatusBadge({ children, tone, className, onClick, title }: { children: ReactNode; tone?: StatusTone; className?: string; onClick?: () => void; title?: string }) {
  const type: StatusTagType = tone === "critical" ? "danger" : tone === "muted" ? "default" : tone === "unread" ? "info" : tone || "default";
  return <StatusTag type={type} className={[onClick ? styles.interactive : undefined, className].filter(Boolean).join(" ")} title={title} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} onClick={onClick} onKeyDown={event => { if (onClick && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onClick(); } }}>{children}</StatusTag>;
}
