import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";
import styles from "./archive.module.css";
export function ArchiveSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>
        {title}
        {count !== undefined && <span>共 {count} 条</span>}
      </h2>
      {children}
    </section>
  );
}
export function ArchiveEmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.empty}>
      <span aria-hidden="true">▤</span>
      <EmptyState title={title}>{children}</EmptyState>
    </div>
  );
}
