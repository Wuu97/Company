"use client";

import { createPortal } from "react-dom";
import { forwardRef, useEffect, useRef, useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { usePickerDialog } from "./use-picker-dialog";
import styles from "./date-time-picker.module.css";

type DateTimePickerProps = {
  value: string;
  className?: string;
  disabled?: boolean;
  allowDateOnly?: boolean;
  referenceDate?: string;
  inputLabel?: string;
  invalid?: boolean;
  onInputChange?: (value: string) => void;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function isDate(value: string) {
  const match = datePattern.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  return (
    Number(month) >= 1 &&
    Number(month) <= 12 &&
    Number(day) >= 1 &&
    Number(day) <= new Date(Number(year), Number(month), 0).getDate()
  );
}

function split(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})(?:T| )?(\d{2}:\d{2})?$/.exec(value);
  const date = match?.[1] && isDate(match[1]) ? match[1] : "";
  return {
    date,
    time: match?.[2] && timePattern.test(match[2]) ? match[2] : "00:00",
  };
}

function formatDateTimeDigits(value: string) {
  const digits = value.replace(/[^0-9]/g, "").slice(0, 12);
  const date = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join("-");
  const time = [digits.slice(8, 10), digits.slice(10, 12)].filter(Boolean).join(":");
  return time ? `${date} ${time}` : date;
}

function CalendarClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="11" height="12" rx="1.5" />
      <path d="M6.5 3.5v4M11.5 3.5v4M3.5 9h11" />
      <circle cx="17.5" cy="16.5" r="3.5" />
      <path d="M17.5 14.5v2.3l1.5.9" />
    </svg>
  );
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  function DateTimePicker(
    { value, className, disabled, allowDateOnly = false, referenceDate, inputLabel, invalid, onInputChange, onConfirm, onCancel },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const initial = split(value);
    const [draftDate, setDraftDate] = useState(initial.date);
    const [draftTime, setDraftTime] = useState(initial.time);
    const [typedValue, setTypedValue] = useState(
      initial.date ? `${initial.date} ${initial.time}` : "",
    );
    const [month, setMonth] = useState(() => {
      const base = initial.date
        ? new Date(`${initial.date}T00:00:00`)
        : new Date();
      return new Date(base.getFullYear(), base.getMonth(), 1);
    });
    const [position, setPosition] = useState<{ top?: number; left?: number }>({
      top: 8,
      left: 8,
    });
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
        if (window.innerWidth < 768) {
          setPosition({});
          return;
        }
        const rect = rootRef.current!.getBoundingClientRect();
        const width = Math.min(252, window.innerWidth - 16);
        const estimatedHeight = panelRef.current?.offsetHeight || 340;
        const left = Math.max(
          8,
          Math.min(rect.left, window.innerWidth - width - 8),
        );
        const below = rect.bottom + 6;
        setPosition({
          left,
          top:
            below + estimatedHeight <= window.innerHeight
              ? below
              : Math.max(8, rect.top - estimatedHeight - 6),
        });
      };
      const closeOutside = (event: PointerEvent) => {
        const target = event.target as Node;
        if (
          !rootRef.current?.contains(target) &&
          !panelRef.current?.contains(target)
        ) {
          setOpen(false);
          onCancel();
        }
      };
      place();
      window.addEventListener("resize", place);
      window.addEventListener("scroll", place, true);
      document.addEventListener("pointerdown", closeOutside);
      return () => {
        window.removeEventListener("resize", place);
        window.removeEventListener("scroll", place, true);
        document.removeEventListener("pointerdown", closeOutside);
      };
    }, [open, onCancel]);

    usePickerDialog(
      panelRef,
      open,
      () => {
        setOpen(false);
        onCancel();
      },
      inputRef.current,
    );
    const [hour, minute] = draftTime.split(":");
    const time = hour && minute ? `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}` : "";
    const validTime = timePattern.test(time);

    function openPicker() {
      if (disabled) return;
      const next = split(value);
      setDraftDate(next.date);
      setDraftTime(next.time);
      setTypedValue(next.date ? `${next.date} ${next.time}` : "");
      const baseDate = next.date || split(referenceDate ?? "").date;
      const base = baseDate ? new Date(`${baseDate}T00:00:00`) : new Date();
      setMonth(new Date(base.getFullYear(), base.getMonth(), 1));
      setOpen(true);
    }
    function cancel() {
      setOpen(false);
      onCancel();
    }
    function confirm(dateOnly = false) {
      if (!isDate(draftDate) || (!dateOnly && !validTime)) return;
      setOpen(false);
      onConfirm(dateOnly ? draftDate : `${draftDate}T${time}`);
    }
    function updateTyped(nextValue: string) {
      setTypedValue(nextValue);
      const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/.exec(
        nextValue.trim(),
      );
      if (match && isDate(match[1]) && timePattern.test(match[2])) {
        setDraftDate(match[1]);
        setDraftTime(match[2]);
        setMonth(new Date(`${match[1]}T00:00:00`));
      }
    }
    function confirmTyped() {
      const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/.exec(
        typedValue.trim(),
      );
      if (!match || !isDate(match[1]) || !timePattern.test(match[2])) return;
      setOpen(false);
      onConfirm(`${match[1]}T${match[2]}`);
    }

    function changeInput(input: HTMLInputElement) {
      if (!onInputChange) {
        updateTyped(input.value);
        return;
      }
      const typed = input.value;
      const digitsBeforeCaret = typed.slice(0, input.selectionStart ?? typed.length).replace(/[^0-9]/g, "").length;
      const formatted = formatDateTimeDigits(typed);
      onInputChange(formatted);
      if (formatted === typed) return;
      let caret = 0;
      let digits = 0;
      while (caret < formatted.length && digits < digitsBeforeCaret) {
        if (/[0-9]/.test(formatted[caret])) digits += 1;
        caret += 1;
      }
      requestAnimationFrame(() => {
        if (document.activeElement === input && input.value === formatted) input.setSelectionRange(caret, caret);
      });
    }

    return (
      <div
        ref={rootRef}
        className={[styles.root, className].filter(Boolean).join(" ")}
      >
        <div className={styles.control} data-invalid={invalid || undefined} onClick={onInputChange ? undefined : openPicker}>
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            data-composite-input
            value={onInputChange ? value : typedValue}
            disabled={disabled}
            aria-label={inputLabel || "选择日期时间"}
            aria-invalid={invalid || undefined}
            placeholder="YYYY-MM-DD HH:mm"
            onFocus={onInputChange ? undefined : event => event.currentTarget.select()}
            onChange={event => changeInput(event.currentTarget)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !onInputChange) {
                event.preventDefault();
                confirmTyped();
              }
              if (event.key === "Escape" && open) cancel();
            }}
          />
          <button
            type="button"
            aria-label="打开日期时间选择器"
            aria-expanded={open}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              openPicker();
            }}
          >
            <CalendarClockIcon />
          </button>
        </div>
        {open &&
          createPortal(
            <div className={styles.mobileBackdrop}>
              <div
                ref={panelRef}
                className={styles.panel}
                style={position}
                role="dialog"
                aria-modal={position.top === undefined || undefined}
                aria-label="选择日期时间"
              >
                <CalendarGrid
                  value={draftDate}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={setDraftDate}
                />
                <div className={styles.time}>
                  <span>时间</span>
                  <input
                    aria-label="小时"
                    inputMode="numeric"
                    maxLength={2}
                    value={hour}
                    onFocus={event => event.currentTarget.select()}
                    onChange={event => setDraftTime(`${event.currentTarget.value.replace(/\D/g, "")}:${minute}`)}
                  />
                  <i aria-hidden="true">:</i>
                  <input
                    aria-label="分钟"
                    inputMode="numeric"
                    maxLength={2}
                    value={minute}
                    onFocus={event => event.currentTarget.select()}
                    onChange={event => setDraftTime(`${hour}:${event.currentTarget.value.replace(/\D/g, "")}`)}
                  />
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={cancel}>
                    取消
                  </button>
                  {allowDateOnly && <button type="button" disabled={!isDate(draftDate)} onClick={() => confirm(true)}>仅日期</button>}
                  <button
                    type="button"
                    disabled={!isDate(draftDate) || !validTime}
                    onClick={() => confirm()}
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  },
);
