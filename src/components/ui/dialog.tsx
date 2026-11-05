"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import styles from "./dialog.module.css";
import { Button } from "./button";

type Props = {
  title: ReactNode;
  children: ReactNode;
  actions: ReactNode;
  onClose: () => void;
  tone?: "default" | "danger";
  message?: ReactNode;
  closeDisabled?: boolean;
  variant?: "manual";
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Accessible modal dialog for disruptive actions that require an explicit confirmation. */
export function Dialog({
  title,
  children,
  actions,
  onClose,
  tone = "default",
  message,
  closeDisabled = false,
  variant,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const closeDisabledRef = useRef(closeDisabled);
  const titleId = useId();
  const descriptionId = useId();

  onCloseRef.current = onClose;
  closeDisabledRef.current = closeDisabled;

  useEffect(() => {
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    const firstFocusable =
      dialog?.querySelector<HTMLElement>(focusableSelector);
    (firstFocusable || dialog)?.focus();

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape" && !closeDisabledRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const opener = openerRef.current;
      if (opener?.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !closeDisabled) onClose();
  }

  return (
    <div className={styles.backdrop} onMouseDown={closeFromBackdrop}>
      <div
        ref={dialogRef}
        className={[
          styles.dialog,
          tone === "danger" ? styles.danger : undefined,
          variant === "manual" ? styles.manual : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <h4 className={styles.title} id={titleId}>
          {title}
        </h4>
        {
          <Button
            variant="text"
            size="small"
            iconOnly
            className={styles.close}
            type="button"
            aria-label="关闭"
            disabled={closeDisabled}
            onClick={onClose}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </Button>
        }
        <div className={styles.body} id={descriptionId}>
          {children}
        </div>
        {message && (
          <small className={styles.message} role="status">
            {message}
          </small>
        )}
        <div className={styles.actions}>{actions}</div>
      </div>
    </div>
  );
}
