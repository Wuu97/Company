"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import css from "./month-picker.module.css";

/** Month-only calendar; the panel is independent of modal overflow. */
export function MonthPicker({ value, onChange, name, label = "结算月份" }: { value: string; onChange: (value: string) => void; name: string; label?: string }) {
  const current = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit" }).format(new Date());
  const minYear = Number(current.slice(0, 4)) - 10;
  const maxYear = Number(current.slice(0, 4)) + 1;
  const [open, setOpen] = useState(false), [year, setYear] = useState(Number(value.slice(0, 4)));
  const [position, setPosition] = useState({ left: 0, top: 0, maxHeight: 240 });
  const trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const margin = 8;
      const gap = 6;
      const width = Math.min(264, window.innerWidth - margin * 2);
      const height = panel.current?.getBoundingClientRect().height || 208;
      const below = Math.max(0, window.innerHeight - rect.bottom - gap - margin);
      const above = Math.max(0, rect.top - gap - margin);
      const downward = below >= height || below >= above;
      const available = downward ? below : above;
      setPosition({
        left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)),
        top: downward ? rect.bottom + gap : Math.max(margin, rect.top - gap - Math.min(height, available)),
        maxHeight: available,
      });
    };
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false); };
    place();
    panel.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus({ preventScroll: true });
    document.addEventListener("pointerdown", outside); window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open]);
  return <div className={css.field}><label>{label} <span>*</span></label><input type="hidden" name={name} value={value}/><button ref={trigger} type="button" className={css.trigger} aria-label={label} aria-expanded={open} aria-haspopup="dialog" onClick={() => { setYear(Number(value.slice(0, 4)) || Number(current.slice(0, 4))); setOpen(!open); }}>{value ? `${value.slice(0, 4)}年${Number(value.slice(5, 7))}月` : "请选择月份"}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg></button>{open && createPortal(<div ref={panel} role="dialog" aria-label={`选择${label}`} data-select-portal data-dialog-owner={trigger.current?.closest('[role="dialog"]')?.getAttribute("aria-labelledby") || undefined} className={css.panel} style={position} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); trigger.current?.focus(); } }}><div className={css.year}><button type="button" aria-label="上一年" disabled={year <= minYear} onClick={() => setYear(year - 1)}>‹</button><span className={css.yearLabel}>{year}年</span><button type="button" aria-label="下一年" disabled={year >= maxYear} onClick={() => setYear(year + 1)}>›</button></div><div className={css.months}>{Array.from({ length: 12 }, (_, index) => { const month = `${year}-${String(index + 1).padStart(2, "0")}`; return <button type="button" key={month} aria-pressed={value === month} onClick={() => { onChange(month); setOpen(false); trigger.current?.focus(); }}>{index + 1}月</button>; })}</div></div>, document.body)}</div>;
}
