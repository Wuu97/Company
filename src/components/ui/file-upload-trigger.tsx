import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import buttonStyles from "../action-button.module.css";
import type { ButtonSize } from "./button";
import styles from "./file-upload-trigger.module.css";

export function FileUploadTrigger({ children, className, busy = false, onChange, disabled, variant = "primary", size = "default", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { children: ReactNode; busy?: boolean; variant?: "primary" | "secondary"; size?: ButtonSize }) {
  const unavailable = busy || Boolean(disabled);
  return <label className={[buttonStyles.button, variant === "secondary" ? buttonStyles.secondary : undefined, size === "toolbar" ? buttonStyles.toolbar : undefined, size === "small" ? buttonStyles.small : undefined, styles.trigger, busy ? styles.busy : undefined, className].filter(Boolean).join(" ")} aria-disabled={unavailable || undefined}><input type="file" disabled={unavailable} onChange={onChange as (event: ChangeEvent<HTMLInputElement>) => void} {...props} /><span>{children}</span></label>;
}
