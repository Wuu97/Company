import { forwardRef, type FormHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import styles from "./list.module.css";
import { ButtonLink, type ButtonSize } from "./button";
import { FilterSelect } from "./filter-select";

type ListFilterProps = FormHTMLAttributes<HTMLFormElement> & { children: ReactNode };

/** Shared shell for server-rendered list filters; page-specific fields stay local. */
export const ListFilter = forwardRef<HTMLFormElement, ListFilterProps>(function ListFilter({ className, children, ...props }, ref) {
  return <form ref={ref} className={[styles.filter, className].filter(Boolean).join(" ")} {...props}>{children}</form>;
});

export function FilterField({ label, children, className, search = false }: { label: ReactNode; children: ReactNode; className?: string; search?: boolean }) {
  return <label className={[styles.field, search ? styles.search : undefined, className].filter(Boolean).join(" ")}><span>{label}</span>{children}</label>;
}

/** Compact text control for list filters; it intentionally omits the form-field hint/error layout. */
export function FilterTextField({ className, compact = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { compact?: boolean }) {
  return <input className={[styles.control, compact ? styles.controlCompact : undefined, className].filter(Boolean).join(" ")} {...props} />;
}

/** Compact select control for list filters; use inside FilterField for its accessible label. */
export function FilterSelectField({ children, className, compact = false, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode; compact?: boolean }) {
  return <FilterSelect className={className} triggerClassName={compact ? styles.selectTriggerCompact : undefined} optionClassName={compact ? styles.selectOptionCompact : undefined} {...props}>{children}</FilterSelect>;
}

export function FilterActions({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={[styles.actions, className].filter(Boolean).join(" ")}>{children}</div>;
}

export function FilterClearLink({ href, children = "清除筛选", className, size }: { href: string; children?: ReactNode; className?: string; size?: ButtonSize }) {
  return <ButtonLink variant="secondary" size={size} className={[styles.clear, className].filter(Boolean).join(" ")} href={href}>{children}</ButtonLink>;
}

export function FilterActionLink({ href, children, className, size }: { href: string; children: ReactNode; className?: string; size?: ButtonSize }) {
  return <ButtonLink size={size} className={[styles.clear, className].filter(Boolean).join(" ")} href={href}>{children}</ButtonLink>;
}

export function ResultSummary({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={[styles.summary, className].filter(Boolean).join(" ")}>{children}</p>;
}

type PaginationProps = { currentPage: number; totalPages: number; href: (page: number) => string; label: string };

export function Pagination({ currentPage, totalPages, href, label }: PaginationProps) {
  if (totalPages <= 1) return null;
  return <nav className={styles.pagination} aria-label={label}>{currentPage > 1 && <a href={href(currentPage - 1)}>上一页</a>}<span>第 {currentPage} / {totalPages} 页</span>{currentPage < totalPages && <a href={href(currentPage + 1)}>下一页</a>}</nav>;
}
