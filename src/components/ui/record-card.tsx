import type { HTMLAttributes, ReactNode } from "react";
import styles from "./record-card.module.css";

type Props = HTMLAttributes<HTMLElement> & { children: ReactNode };
type Density = "default" | "compact";
type FieldColumns = "auto" | 2 | 3 | 4;

function classes(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

/** Reusable record surface with explicit density instead of page-level card overrides. */
export function RecordCard({ className, children, density = "default", ...props }: Props & { density?: Density }) {
  return <article className={classes(styles.card, styles[`card${density}`], className)} {...props}>{children}</article>;
}

export function RecordCardHeader({ className, children, density = "default", ...props }: Props & { density?: Density }) {
  return <div className={classes(styles.header, styles[`header${density}`], className)} {...props}>{children}</div>;
}

export function RecordCardFields({ className, children, density = "default", columns = "auto", ...props }: Props & { density?: Density; columns?: FieldColumns }) {
  return <div className={classes(styles.fields, styles[`fields${density}`], styles[`columns${columns}`], className)} {...props}>{children}</div>;
}

export function RecordCardField({ className, children, density = "default", fullOnMobile = false, ...props }: Props & { density?: Density; fullOnMobile?: boolean }) {
  return <div className={classes(styles.field, styles[`field${density}`], fullOnMobile && styles.fullOnMobile, className)} {...props}>{children}</div>;
}

export function RecordCardActions({ className, children, density = "default", ...props }: Props & { density?: Density }) {
  return <div className={classes(styles.actions, styles[`actions${density}`], className)} {...props}>{children}</div>;
}

export function RecordCardList({ className, children, density = "default", ...props }: Props & { density?: Density }) {
  return <div className={classes(styles.list, styles[`list${density}`], className)} {...props}>{children}</div>;
}
