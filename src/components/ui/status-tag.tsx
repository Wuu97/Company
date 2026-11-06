import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./status-tag.module.css";

export type StatusTagType = "success" | "warning" | "danger" | "info" | "default";
export type StatusTagProps = HTMLAttributes<HTMLSpanElement> & {
  type?: StatusTagType;
  text?: ReactNode;
  /** Custom foreground; optionally provide an explicit background. */
  color?: string;
  backgroundColor?: string;
};

export function StatusTag({ type = "default", text, children, color, backgroundColor, className, style, ...props }: StatusTagProps) {
  const customStyle: CSSProperties = {
    ...style,
    ...(color ? { color, backgroundColor: backgroundColor ?? `color-mix(in srgb, ${color} 12%, white)` } : backgroundColor ? { backgroundColor } : {}),
  };
  return <span {...props} className={[styles.tag, styles[type], className].filter(Boolean).join(" ")} style={customStyle}>{text ?? children}</span>;
}
