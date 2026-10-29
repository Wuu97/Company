import type { ReactNode, TableHTMLAttributes } from "react";
import styles from "./data-table.module.css";

export function DataTable({ children, className, mobileHint = "表格可左右滑动查看完整内容。", ...props }: TableHTMLAttributes<HTMLTableElement> & { mobileHint?: ReactNode }) {
  return <><p className={styles.hint}>{mobileHint}</p><div className={styles.wrap}><table className={[styles.table, className].filter(Boolean).join(" ")} {...props}>{children}</table></div></>;
}
