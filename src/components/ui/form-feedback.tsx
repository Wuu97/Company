import type { ReactNode } from "react";
import styles from "./form-feedback.module.css";
import { FeedbackMessage } from "./feedback-message";

export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[styles.actions, className].filter(Boolean).join(" ")}>{children}</div>;
}

export function FormMessage({ children, as = "p" }: { children: ReactNode; as?: "p" | "span" | "small" }) {
  return (
    <FeedbackMessage as={as} className={styles.message}>
      {children}
    </FeedbackMessage>
  );
}
