"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./dialog.module.css";
import { Button } from "./button";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  placement?: "center" | "drawer";
  width?: number;
  children: ReactNode;
  actions: ReactNode;
  onClose: () => void;
  tone?: "default" | "danger";
  message?: ReactNode;
  closeDisabled?: boolean;
  variant?: "manual";
  closing?: boolean;
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
  subtitle,
  placement = "center",
  width,
  children,
  actions,
  onClose,
  tone = "default",
  message,
  closeDisabled = false,
  variant,
  closing = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const closeDisabledRef = useRef(closeDisabled);
  const titleId = useId();
  const descriptionId = useId();

  onCloseRef.current = onClose;
  closeDisabledRef.current = closeDisabled;

  useEffect(() => {
    if (!mounted) return;
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    // Focus the dialog itself; Tab moves into the controls naturally.
    dialog?.focus({ preventScroll: true });

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (dialog !== Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).at(-1)) return;
      if (event.key === "Escape" && !closeDisabledRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const portals = Array.from(document.querySelectorAll<HTMLElement>("[data-select-portal]")).filter(portal => portal.dataset.dialogOwner === titleId);
      const focusable = [...Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)), ...portals.flatMap(portal => Array.from(portal.querySelectorAll<HTMLElement>(focusableSelector)))];
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
        opener.dataset.pointerRestored = "true";
        opener.focus({ preventScroll: true });
        const clear = () => { delete opener.dataset.pointerRestored; };
        opener.addEventListener("blur", clear, { once: true });
        opener.addEventListener("keydown", clear, { once: true });
      }
    };
  }, [mounted]);

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !closeDisabled) onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <div data-closing={closing || undefined} className={[styles.backdrop, placement === "drawer" ? styles.drawerBackdrop : undefined].filter(Boolean).join(" ")} onMouseDown={closeFromBackdrop}>
      <div
        ref={dialogRef}
        className={[
          styles.dialog,
          placement === "drawer" ? styles.drawer : undefined,
          tone === "danger" ? styles.danger : undefined,
          variant === "manual" ? styles.manual : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        style={width ? { width: `min(${width}px, 100%)` } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <header className={styles.title}>
          <h4 className={styles.heading} id={titleId}>{title}</h4>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
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
    </div>,
    document.body,
  );
}
