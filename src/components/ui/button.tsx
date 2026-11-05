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
};
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  wide?: ButtonWide;
  iconOnly?: boolean;
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
  className,
  type = "button",
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={buttonClassNames(variant, size, wide, className, iconOnly)}
      {...props}
    >
      {variant === "reset" && <ResetIcon />}
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
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      className={buttonClassNames(variant, size, wide, className, iconOnly)}
      {...props}
    >
      {variant === "reset" && <ResetIcon />}
      {children}
    </a>
  );
}
