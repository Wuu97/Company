import { forwardRef, type InputHTMLAttributes } from "react";
import { Button } from "./button";
import styles from "./inline-editor.module.css";

export function InlineEditTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="text"
      size="small"
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}

export const InlineEditInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function InlineEditInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={[styles.input, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});
