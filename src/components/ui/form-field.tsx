import type { ReactNode } from "react";
import styles from "./form-field.module.css";

type Props = { label: ReactNode; children: ReactNode; hint?: ReactNode; required?: boolean; className?: string };

/** Label, control and optional hint with one consistent accessible structure. */
export function FormField({ label, children, hint, required, className }: Props) {
  return <label className={[styles.field, className].filter(Boolean).join(" ")}><span>{label}{required && <em aria-hidden="true"> *</em>}</span>{children}{hint && <small>{hint}</small>}</label>;
}
