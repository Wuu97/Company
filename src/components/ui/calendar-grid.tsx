"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./calendar-grid.module.css";
export function calendarKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function moveCalendarDate(value: string, key: string) {
  const date = new Date(`${value}T12:00:00`);
  const delta: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  };
  if (key in delta) date.setDate(date.getDate() + delta[key]);
  else if (key === "Home") date.setDate(date.getDate() - date.getDay());
  else if (key === "End") date.setDate(date.getDate() + 6 - date.getDay());
  else return null;
  return calendarKey(date);
}
export function CalendarGrid({
  value,
  month,
  onMonthChange,
  onSelect,
}: {
  value: string;
  month: Date;
  onMonthChange: (date: Date) => void;
  onSelect: (date: string) => void;
}) {
  const today = calendarKey(new Date());
  const [focused, setFocused] = useState(value || today);
  const grid = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(true);
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const tabDate = days.some((d) => calendarKey(d) === focused)
    ? focused
    : calendarKey(new Date(month.getFullYear(), month.getMonth(), 1));
  useEffect(() => {
    if (pendingFocus.current) {
      grid.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${tabDate}"]`)
        ?.focus();
      pendingFocus.current = false;
    }
  }, [tabDate, month]);
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const current = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-date]",
    )?.dataset.date;
    if (!current) return;
    const next = moveCalendarDate(current, event.key);
    if (!next) return;
    event.preventDefault();
    pendingFocus.current = true;
    setFocused(next);
    const date = new Date(`${next}T12:00:00`);
    onMonthChange(new Date(date.getFullYear(), date.getMonth(), 1));
  }
  function changeMonth(delta: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    pendingFocus.current = false;
    setFocused(calendarKey(next));
    onMonthChange(next);
  }
  return (
    <>
      <div className={styles.header}>
        <b aria-live="polite">
          {month.getFullYear()}年{String(month.getMonth() + 1).padStart(2, "0")}
          月
        </b>
        <div className={styles.navigation}>
          {[
            [-12, "上一年", "«"],
            [-1, "上个月", "‹"],
            [1, "下个月", "›"],
            [12, "下一年", "»"],
          ].map(([delta, label, text]) => (
            <button
              type="button"
              key={label}
              aria-label={String(label)}
              onClick={() => changeMonth(Number(delta))}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      <div
        className={styles.grid}
        role="grid"
        aria-label="日期"
        ref={grid}
        onKeyDown={navigate}
      >
        <div className={styles.row} role="row">
          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
            <span key={day} role="columnheader">
              {day}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div className={styles.row} role="row" key={row}>
            {days.slice(row * 7, row * 7 + 7).map((date) => {
              const key = calendarKey(date);
              return (
                <button
                  type="button"
                  role="gridcell"
                  aria-label={key}
                  aria-selected={key === value}
                  aria-current={key === today ? "date" : undefined}
                  data-date={key}
                  data-selected={key === value}
                  data-outside={date.getMonth() !== month.getMonth()}
                  tabIndex={key === tabDate ? 0 : -1}
                  key={key}
                  onFocus={() => setFocused(key)}
                  onClick={() => onSelect(key)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
