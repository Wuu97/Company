import type { ReactNode } from "react";
import styles from "./data-table.module.css";

/** Shared empty content for business tables and archive lists. */
export function TableEmptyState({ icon, title = "暂无数据", description = "请调整筛选条件或创建新记录。" }: {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}) {
  return <div data-table-empty-state className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
    {icon ?? <span aria-hidden="true" className={styles.emptyIcon}>▤</span>}
    <strong>{title}</strong>
    <p>{description}</p>
  </div>;
}
