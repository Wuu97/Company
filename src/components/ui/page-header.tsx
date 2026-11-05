import type { ReactNode } from "react";
import styles from "./page-header.module.css";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** Consistent page title and optional primary actions for application screens. */
export function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
