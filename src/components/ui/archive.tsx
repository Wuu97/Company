import type { ReactNode } from "react";
import { TableEmptyState } from "./table-empty-state";
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
    <section data-list-section={title} aria-label={title} className={styles.panel}>
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
  return <TableEmptyState title={title} description={children} />;
}
