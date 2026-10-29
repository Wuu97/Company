import type { ReactNode } from "react";
import styles from "./empty-state.module.css";

type Props = { title: string; children: ReactNode; className?: string };

/** Consistent, semantic empty state for list and detail sections. */
export function EmptyState({ title, children, className }: Props) {
  return <section className={[styles.emptyState, className].filter(Boolean).join(" ")}><h3>{title}</h3><p>{children}</p></section>;
}
