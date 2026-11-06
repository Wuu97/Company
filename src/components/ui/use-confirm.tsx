"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Dialog } from "./dialog";
import { Button } from "./button";

type ConfirmOptions = {
  title: ReactNode;
  description: ReactNode;
  danger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
};

/** Render confirmationDialog alongside the caller; await showConfirm before mutations. */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [closing, setClosing] = useState(false);
  const pending = useRef<((confirmed: boolean) => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    pending.current?.(false);
    pending.current = null;
  }, []);

  const showConfirm = useCallback((next: ConfirmOptions): Promise<boolean> => {
    // Ignore repeated triggers while a confirmation is visible or exiting.
    if (pending.current) return Promise.resolve(false);
    setClosing(false);
    setOptions(next);
    return new Promise(resolve => { pending.current = resolve; });
  }, []);

  function finish(confirmed: boolean) {
    if (timer.current || !pending.current) return;
    setClosing(true);
    timer.current = setTimeout(() => {
      const resolve = pending.current;
      pending.current = null;
      timer.current = null;
      setOptions(null);
      setClosing(false);
      resolve?.(confirmed);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 140);
  }

  const confirmationDialog = options ? createPortal(
    <Dialog title={options.title} tone={options.danger ? "danger" : "default"}
      closing={closing} closeDisabled={closing} onClose={() => finish(false)}
      actions={<>
        <Button type="button" size="toolbar" variant="neutral" disabled={closing} onClick={() => finish(false)}>{options.cancelLabel ?? "取消"}</Button>
        <Button type="button" size="toolbar" variant={options.danger ? "danger" : "primary"} disabled={closing} onClick={() => finish(true)}>{options.confirmLabel ?? "确定"}</Button>
      </>}><p>{options.description}</p></Dialog>, document.body,
  ) : null;

  return { showConfirm, confirmationDialog };
}
