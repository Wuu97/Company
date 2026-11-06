import type { ReactNode } from "react";
import styles from "./empty-state.module.css";

type Props = { title: string; children: ReactNode; className?: string };

/** Consistent, semantic empty state for list and detail sections. */
export function EmptyState({ title, children, className }: Props) {
  return <section className={[styles.emptyState, className].filter(Boolean).join(" ")}><svg className={styles.icon} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 4h16v16H4zM4 14h5l2 3h2l2-3h5" /></svg><h3>{title}</h3><p>{children}</p></section>;
}
