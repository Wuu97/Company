import type { ReactNode } from "react";
import styles from "./confirmation-panel.module.css";

type Props = { title: ReactNode; children?: ReactNode; actions: ReactNode; className?: string };

/** Shared inline confirmation surface; callers keep ownership of their async action. */
export function ConfirmationPanel({ title, children, actions, className }: Props) {
  return <div className={[styles.panel, className].filter(Boolean).join(" ")}><p className={styles.title}><b>{title}</b></p>{children && <div className={styles.body}>{children}</div>}<div className={styles.actions}>{actions}</div></div>;
}
