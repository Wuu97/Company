import styles from "./table-placeholder.module.css";

export const TABLE_EMPTY_MARKER = "–";

/** Keeps an empty cell's marker centered under the column label. */
export function TablePlaceholder({ heading, className }: { heading: string; className?: string }) {
  return (
    <span className={[styles.placeholder, className].filter(Boolean).join(" ")}>
      <span className={styles.measure} aria-hidden="true">{heading}</span>
      <span className={styles.marker}>{TABLE_EMPTY_MARKER}</span>
    </span>
  );
}
