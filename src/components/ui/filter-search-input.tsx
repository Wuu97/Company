"use client";
import type { InputHTMLAttributes } from "react";
import styles from "./filter-search-input.module.css";

/** Shared prefix search control for audit logs and schema filter bars. */
export function FilterSearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <span className={styles.root}><svg className={styles.prefix} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" {...props} className={[styles.input, className].filter(Boolean).join(" ")}/></span>;
}
