import type { HTMLAttributes } from "react";
import styles from "./table-body.module.css";

/** Ordinary list rows share the audit log's density; statement tables opt out. */
export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={[styles.body, className].filter(Boolean).join(" ")} />;
}
