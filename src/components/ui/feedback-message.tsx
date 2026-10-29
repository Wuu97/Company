import type { ElementType, ReactNode } from "react";
import styles from "./feedback-message.module.css";

type Tone = "info" | "success" | "warning" | "error";
export function FeedbackMessage({ children, tone = "info", as: Tag = "p", className }: { children: ReactNode; tone?: Tone; as?: ElementType; className?: string }) {
  return <Tag className={[styles.message, styles[tone], className].filter(Boolean).join(" ")} role={tone === "error" ? "alert" : "status"}>{children}</Tag>;
}
