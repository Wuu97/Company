import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "../action-button.module.css";

type ButtonVariant =
  "primary" | "reset" | "outline" | "secondary" | "danger" | "neutral" | "text";
export type ButtonSize = "default" | "toolbar" | "small" | "compact";

const variantClass: Record<ButtonVariant, string | undefined> = {
  primary: styles.primary,
  outline: styles.outline,
  reset: styles.outline,
  secondary: styles.secondary,
  danger: styles.danger,
  neutral: styles.neutral,
  text: styles.text,
};

type ButtonWide = boolean | "mobile";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  wide?: ButtonWide;
  iconOnly?: boolean;
  /** Creation entry point; use outside dialog confirmation actions. */
  create?: boolean;
};
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  wide?: ButtonWide;
  iconOnly?: boolean;
  /** Creation entry point; use outside dialog confirmation actions. */
  create?: boolean;
};

export function buttonClassNames(
  variant: ButtonVariant,
  size: ButtonSize,
  wide: ButtonWide,
  className?: string,
  iconOnly = false,
) {
  return [
    styles.button,
    styles[size],
    variantClass[variant],
    iconOnly ? styles.icon : undefined,
    wide === true ? styles.wide : undefined,
    wide === "mobile" ? styles.wideMobile : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function ResetIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6" />
    </svg>
  );
}

/** Shared action button with a deliberately small set of visual meanings. */
export function Button({
  variant = "primary",
  size = "default",
  wide = false,
  iconOnly = false,
  create = false,
  className,
  type = "button",
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      data-create-action={create || undefined}
      data-action-button
      data-icon-only={iconOnly || undefined}
      data-variant={variant}
      className={buttonClassNames(variant, size, wide, className, iconOnly)}
      {...props}
    >
      {create && <PlusIcon />}
      {variant === "reset" && !create && <ResetIcon />}
      {children}
    </button>
  );
}

/** Shared action link with the same visual contract as Button. */
export function ButtonLink({
  variant = "primary",
  size = "default",
  wide = false,
  iconOnly = false,
  create = false,
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      data-create-action={create || undefined}
      data-action-button
      data-icon-only={iconOnly || undefined}
      data-variant={variant}
      className={buttonClassNames(variant, size, wide, className, iconOnly)}
      {...props}
    >
      {create && <PlusIcon />}
      {variant === "reset" && !create && <ResetIcon />}
      {children}
    </a>
  );
}
