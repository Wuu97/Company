import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "../action-button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "neutral" | "text";
export type ButtonSize = "default" | "toolbar" | "small";

const variantClass: Record<ButtonVariant, string | undefined> = {
  primary: undefined,
  secondary: styles.secondary,
  danger: styles.danger,
  neutral: styles.neutral,
  text: styles.text,
};

type ButtonWide = boolean | "mobile";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize; wide?: ButtonWide };
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant?: ButtonVariant; size?: ButtonSize; wide?: ButtonWide };

function classNames(variant: ButtonVariant, size: ButtonSize, wide: ButtonWide, className?: string) {
  return [styles.button, variantClass[variant], size === "toolbar" ? styles.toolbar : undefined, size === "small" ? styles.small : undefined, wide === true ? styles.wide : undefined, wide === "mobile" ? styles.wideMobile : undefined, className].filter(Boolean).join(" ");
}

/** Shared action button with a deliberately small set of visual meanings. */
export function Button({ variant = "primary", size = "default", wide = false, className, type = "button", ...props }: Props) {
  return <button type={type} className={classNames(variant, size, wide, className)} {...props} />;
}

/** Shared action link with the same visual contract as Button. */
export function ButtonLink({ variant = "primary", size = "default", wide = false, className, children, ...props }: LinkProps) {
  return <a className={classNames(variant, size, wide, className)} {...props}>{children}</a>;
}
