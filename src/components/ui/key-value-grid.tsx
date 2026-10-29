import type { ReactNode } from "react";
import styles from "./key-value-grid.module.css";

export type KeyValueItem = { label: string; value: ReactNode; emphasis?: boolean };

type Props = { items: KeyValueItem[]; className?: string; itemClassName?: string; emphasisClassName?: string };

/** A composable label/value grid that preserves each screen's visual classes. */
export function KeyValueGrid({ items, className = styles.grid, itemClassName = styles.item, emphasisClassName = styles.emphasis }: Props) {
  return <div className={className}>{items.map(item => <div className={[itemClassName, item.emphasis ? emphasisClassName : undefined].filter(Boolean).join(" ")} key={item.label}><span>{item.label}</span><b>{item.value}</b></div>)}</div>;
}
