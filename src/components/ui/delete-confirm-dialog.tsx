"use client";

import type { ReactNode } from "react";
import { Button } from "./button";
import { Dialog } from "./dialog";

type Props = {
  title: ReactNode;
  children: ReactNode;
  message?: ReactNode;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmingLabel?: ReactNode;
};

/** Shared destructive-action dialog with consistent type, spacing and actions. */
export function DeleteConfirmDialog({ title, children, message, busy = false, onClose, onConfirm, confirmingLabel = "正在删除…" }: Props) {
  return <Dialog tone="danger" title={title} message={message} closeDisabled={busy} onClose={onClose} actions={<><Button type="button" variant="neutral" size="small" wide="mobile" disabled={busy} onClick={onClose}>返回</Button><Button type="button" variant="danger" size="small" wide="mobile" disabled={busy} onClick={onConfirm}>{busy ? confirmingLabel : "确认删除"}</Button></>}>{children}</Dialog>;
}
