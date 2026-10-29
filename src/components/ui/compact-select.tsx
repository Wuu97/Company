import type { ReactNode, SelectHTMLAttributes } from "react";
import styles from "./compact-select.module.css";
import { FilterSelect } from "./filter-select";

/** Small status-like select for dense list rows and summary cards. */
const toneClass: Record<string, string | undefined> = {
  PARSED: styles.warning,
  PENDING: styles.warning,
  PENDING_REVIEW: styles.warning,
  WAITING: styles.warning,
  VERIFIED: styles.success,
  CONFIRMED: styles.success,
  COMPLETED: styles.success,
  ACTIVE: styles.success,
  CANCELLED: styles.critical,
  INACTIVE: styles.critical,
  UNPAID: styles.warning,
  PARTIALLY_PAID: styles.warning,
  PAID: styles.success,
  REVERSED: styles.critical,
};

export function CompactSelect({ children, className, value, defaultValue, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const currentValue = String(value ?? defaultValue ?? "");
  return <FilterSelect className={styles.root} triggerClassName={[styles.select, toneClass[currentValue], className].filter(Boolean).join(" ")} optionsClassName={styles.options} searchable={false} value={value} defaultValue={defaultValue} {...props}>{children}</FilterSelect>;
}
