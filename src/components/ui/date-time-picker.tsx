"use client";

import { createPortal } from "react-dom";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import styles from "./date-time-picker.module.css";

type DateTimePickerProps = {
  value: string;
  className?: string;
  disabled?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function isDate(value: string) {
  const match = datePattern.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  return Number(month) >= 1 && Number(month) <= 12 && Number(day) >= 1 && Number(day) <= new Date(Number(year), Number(month), 0).getDate();
}

function split(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})(?:T| )?(\d{2}:\d{2})?$/.exec(value);
  const date = match?.[1] && isDate(match[1]) ? match[1] : "";
  return { date, time: match?.[2] && timePattern.test(match[2]) ? match[2] : "00:00" };
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function title(month: Date) {
  return `${month.getFullYear()}年${String(month.getMonth() + 1).padStart(2, "0")}月`;
}

function CalendarClockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="11" height="12" rx="1.5" /><path d="M6.5 3.5v4M11.5 3.5v4M3.5 9h11" /><circle cx="17.5" cy="16.5" r="3.5" /><path d="M17.5 14.5v2.3l1.5.9" /></svg>;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(function DateTimePicker({ value, className, disabled, onConfirm, onCancel }, ref) {
  const [open, setOpen] = useState(false);
  const initial = split(value);
  const [draftDate, setDraftDate] = useState(initial.date);
  const [draftTime, setDraftTime] = useState(initial.time);
  const [typedValue, setTypedValue] = useState(initial.date ? `${initial.date} ${initial.time}` : "");
  const [month, setMonth] = useState(() => {
    const base = initial.date ? new Date(`${initial.date}T00:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [position, setPosition] = useState({ top: 8, left: 8 });
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) return;
    const next = split(value);
    setDraftDate(next.date);
    setDraftTime(next.time);
    setTypedValue(next.date ? `${next.date} ${next.time}` : "");
  }, [value, open]);

  useEffect(() => {
    if (!open || !rootRef.current) return;
    const place = () => {
      const rect = rootRef.current!.getBoundingClientRect();
      const width = Math.min(216, window.innerWidth - 16);
      const estimatedHeight = 240;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const below = rect.bottom + 6;
      setPosition({ left, top: below + estimatedHeight <= window.innerHeight ? below : Math.max(8, rect.top - estimatedHeight - 6) });
    };
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
        onCancel();
      }
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); onCancel(); }
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open, onCancel]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [month]);
  const today = dateKey(new Date());
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

  function openPicker() {
    if (disabled) return;
    const next = split(value);
    setDraftDate(next.date);
    setDraftTime(next.time);
    setTypedValue(next.date ? `${next.date} ${next.time}` : "");
    const base = next.date ? new Date(`${next.date}T00:00:00`) : new Date();
    setMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    setOpen(true);
  }
  function cancel() { setOpen(false); onCancel(); }
  function confirm() {
    if (!isDate(draftDate) || !timePattern.test(draftTime)) return;
    setOpen(false);
    onConfirm(`${draftDate}T${draftTime}`);
  }
  function updateTyped(nextValue: string) {
    setTypedValue(nextValue);
    const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/.exec(nextValue.trim());
    if (match && isDate(match[1]) && timePattern.test(match[2])) {
      setDraftDate(match[1]);
      setDraftTime(match[2]);
      setMonth(new Date(`${match[1]}T00:00:00`));
    }
  }
  function confirmTyped() {
    const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/.exec(typedValue.trim());
    if (!match || !isDate(match[1]) || !timePattern.test(match[2])) return;
    setOpen(false);
    onConfirm(`${match[1]}T${match[2]}`);
  }

  return <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(" ")}>
    <div className={styles.control} onClick={openPicker}>
      <input ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} value={typedValue} disabled={disabled} aria-label="选择日期时间" placeholder="YYYY-MM-DD HH:mm" onFocus={event => event.currentTarget.select()} onChange={event => updateTyped(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); confirmTyped(); } if (event.key === "Escape" && open) cancel(); }} />
      <button type="button" aria-label="打开日期时间选择器" aria-expanded={open} disabled={disabled} onClick={event => { event.stopPropagation(); openPicker(); }}><CalendarClockIcon /></button>
    </div>
    {open && createPortal(<div ref={panelRef} className={styles.panel} style={position} role="dialog" aria-label="选择日期时间">
      <div className={styles.header}><b>{title(month)}</b><div><button type="button" aria-label="上个月" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>‹</button><button type="button" aria-label="下个月" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>›</button></div></div>
      <div className={styles.weekdays}>{["日", "一", "二", "三", "四", "五", "六"].map(day => <span key={day}>{day}</span>)}</div>
      <div className={styles.days}>{days.map(day => { const key = dateKey(day); return <button key={key} type="button" className={[styles.day, day.getMonth() !== month.getMonth() ? styles.outside : "", key === draftDate ? styles.selected : "", key === today ? styles.today : ""].filter(Boolean).join(" ")} onClick={() => setDraftDate(key)}>{day.getDate()}</button>; })}</div>
      <div className={styles.time}><span>时间</span><select aria-label="小时" value={draftTime.slice(0, 2)} onChange={event => setDraftTime(`${event.target.value}:${draftTime.slice(3, 5)}`)}>{hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}</select><i>:</i><select aria-label="分钟" value={draftTime.slice(3, 5)} onChange={event => setDraftTime(`${draftTime.slice(0, 2)}:${event.target.value}`)}>{minutes.map(minute => <option key={minute} value={minute}>{minute}</option>)}</select></div>
      <div className={styles.actions}><button type="button" onClick={cancel}>取消</button><button type="button" disabled={!isDate(draftDate)} onClick={confirm}>确定</button></div>
    </div>, document.body)}
  </div>;
});
