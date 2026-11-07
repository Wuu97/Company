"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import css from "./status-badge-switch.module.css";

export type StatusBadgeSwitchProps = {
  active: boolean;
  onChange: (active: boolean) => void | Promise<void>;
  confirmation?: "disable-only" | "both" | "none";
  disabled?: boolean;
  label?: string;
  activeLabel?: string;
  inactiveLabel?: string;
  description?: string | ((next: boolean) => string);
};
export function StatusBadgeSwitch({ active, onChange, confirmation = "disable-only", disabled = false, label = "状态", activeLabel = "启用", inactiveLabel = "停用", description }: StatusBadgeSwitchProps) {
  const trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null), lock = useRef(false), cancel = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const id = useId();
  const target = useRef(!active);
  const close = () => { if (lock.current) return; setOpen(false); trigger.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect(), popup = panel.current;
      if (!rect || !popup) return;
      const w = popup.offsetWidth, h = popup.offsetHeight;
      setPosition({ left: Math.max(8, Math.min(rect.left + rect.width / 2 - w / 2, innerWidth - w - 8)), top: Math.max(8, Math.min(rect.bottom + h + 6 <= innerHeight - 8 ? rect.bottom + 6 : rect.top - h - 6, innerHeight - h - 8)) });
    };
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node) && !lock.current) setOpen(false); };
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); close(); }
      if (event.key === "Tab") {
        const buttons = panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if (!buttons?.length) { event.preventDefault(); return; }
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const observer = new ResizeObserver(place); if (panel.current) observer.observe(panel.current);
    place(); cancel.current?.focus({ preventScroll: true });
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", keys, true);
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { observer.disconnect(); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", keys, true); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open]);
  async function commit() {
    if (lock.current || disabled || target.current === active) return;
    lock.current = true; setBusy(true); setError("");
    try { await onChange(target.current); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "状态更新失败，请重试"); setOpen(true); }
    finally { lock.current = false; setBusy(false); }
  }
  return <><button ref={trigger} type="button" className={`${css.badge} ${active ? css.active : css.inactive}`} disabled={disabled || busy} aria-label={`${label}：${active ? activeLabel : inactiveLabel}，点击切换`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} aria-busy={busy} onClick={() => { target.current = !active; setError(""); if (confirmation === "both" || confirmation === "disable-only" && active) setOpen(true); else void commit(); }}>{busy ? <LoaderCircle className={css.spinner} size={12} /> : <span className={css.dot} />}{active ? activeLabel : inactiveLabel}</button>
    {open && createPortal(<div ref={panel} id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} data-select-portal data-dialog-owner={trigger.current?.closest('[role="dialog"]')?.getAttribute("aria-labelledby") || undefined} className={css.panel} style={position}>
      <div className={css.message}><AlertTriangle size={17} aria-hidden="true" /><div><strong id={`${id}-title`}>确认将此项改为【{target.current ? activeLabel : inactiveLabel}】吗？</strong><p>{typeof description === "function" ? description(target.current) : description || (target.current ? "启用后将重新参与业务匹配与计算。" : "停用后将不再参与新的业务匹配与计算。")}</p></div></div>
      {error && <p className={css.error} role="alert">{error}</p>}
      <div className={css.actions}><button ref={cancel} type="button" disabled={busy} onClick={close}>取消</button><button type="button" className={css.confirm} disabled={busy || disabled} onClick={() => void commit()}>{busy ? "保存中…" : "确认"}</button></div>
    </div>, document.body)}</>;
}
