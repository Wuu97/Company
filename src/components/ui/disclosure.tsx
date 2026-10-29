import type { DetailsHTMLAttributes, ReactNode } from "react";
import styles from "./disclosure.module.css";

export function Disclosure({ title, children, className, ...props }: DetailsHTMLAttributes<HTMLDetailsElement> & { title: ReactNode; children: ReactNode }) {
  return <details className={[styles.disclosure, className].filter(Boolean).join(" ")} {...props}><summary className={styles.summary}>{title}</summary><div className={styles.content}>{children}</div></details>;
}
