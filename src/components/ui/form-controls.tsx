import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { FormField } from "./form-field";
import styles from "./form-field.module.css";
import { FilterSelect } from "./filter-select";
import { DateTimeField } from "./date-time-field";

type FieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
};

type TextFieldProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;
type SelectFieldProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};
type TextareaFieldProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Standard text-like control with one label, hint and error treatment. */
export function TextField({ label, hint, error, className, required, ...props }: TextFieldProps) {
  return <FormField label={label} hint={hint} required={required} className={className}>{props.type === "datetime-local" ? <DateTimeField className={styles.dateTime} required={required} aria-invalid={Boolean(error) || undefined} {...props} /> : <input className={styles.control} required={required} aria-invalid={Boolean(error) || undefined} {...props} />}{error && <small className={styles.error} role="alert">{error}</small>}</FormField>;
}

/** Standard select control that shares the same label and validation treatment. */
export function SelectField({ label, hint, error, className, required, children, ...props }: SelectFieldProps) {
  return <FormField label={label} hint={hint} required={required} className={className}><FilterSelect className={styles.select} triggerClassName={styles.control} required={required} aria-invalid={Boolean(error) || undefined} {...props}>{children}</FilterSelect>{error && <small className={styles.error} role="alert">{error}</small>}</FormField>;
}

/** Standard multi-line control for notes and operational instructions. */
export function TextareaField({ label, hint, error, className, required, ...props }: TextareaFieldProps) {
  return <FormField label={label} hint={hint} required={required} className={className}><textarea className={styles.control} required={required} aria-invalid={Boolean(error) || undefined} {...props} />{error && <small className={styles.error} role="alert">{error}</small>}</FormField>;
}

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
};

/** Checkbox with a larger hit target and an optional explanatory hint. */
export function CheckboxField({ children, hint, className, ...props }: CheckboxFieldProps) {
  return <label className={[styles.checkbox, className].filter(Boolean).join(" ")}><input type="checkbox" {...props} /><span>{children}</span>{hint && <small>{hint}</small>}</label>;
}
