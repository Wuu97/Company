"use client";
import { useEffect, useRef, type RefObject } from "react";
export function usePickerDialog(
  ref: RefObject<HTMLDivElement | null>,
  open: boolean,
  onClose: () => void,
  anchor: HTMLElement | null,
) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const origin = anchor || (document.activeElement as HTMLElement | null);
    const frame = requestAnimationFrame(() =>
      (
        ref.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]') ||
        ref.current?.querySelector<HTMLElement>("input, button")
      )?.focus(),
    );
    function keyboard(event: KeyboardEvent) {
      const panel = ref.current;
      if (!panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not(:disabled):not([tabindex="-1"]),input:not(:disabled),select:not(:disabled)',
        ),
      );
      const first = items[0],
        last = items.at(-1);
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", keyboard, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keyboard, true);
      if (origin?.isConnected) origin.focus({ preventScroll: true });
    };
  }, [ref, open, anchor]);
}
