"use client";

import type { ReactNode } from "react";
import type { StatusTone } from "@/lib/status-labels";
import styles from "./status-badge.module.css";

export function StatusBadge({ children, tone, className, size = "default", onClick, title }: { children: ReactNode; tone?: StatusTone; className?: string; size?: "default" | "small"; onClick?: () => void; title?: string }) {
  return <span className={[styles.badge, tone && tone !== "default" ? styles[tone] : undefined, size === "small" ? styles.small : undefined, onClick ? styles.interactive : undefined, className].filter(Boolean).join(" ")} title={title} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} onClick={onClick} onKeyDown={event => { if (onClick && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onClick(); } }}>{children}</span>;
}
