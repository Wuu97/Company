"use client";

import { createPortal } from "react-dom";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { CalendarGrid } from "./calendar-grid";
import { usePickerDialog } from "./use-picker-dialog";
import styles from "./date-time-field.module.css";

type DateTimeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  onCommit?: (value: string) => void;
};

type DateTimeFieldProps = InputHTMLAttributes<HTMLInputElement>;

function splitValue(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})(?:T| )(\d{2}:\d{2})$/.exec(value);
  return { date: match?.[1] || "", time: match?.[2] || "" };
}

function validDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  return (
    Number(month) >= 1 &&
    Number(month) <= 12 &&
    Number(day) >= 1 &&
    Number(day) <= new Date(Number(year), Number(month), 0).getDate()
  );
}

function validTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function combine(date: string, time: string) {
  return validDate(date) && validTime(time) ? `${date}T${time}` : "";
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function CalendarPopover({
  anchor,
  value,
  onSelect,
  onClose,
}: {
  anchor: HTMLElement;
  value: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const selected = validDate(value)
    ? new Date(`${value}T00:00:00`)
    : new Date();
  const [month, setMonth] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );
  const [position, setPosition] = useState<{ top?: number; left?: number }>({
    top: 8,
    left: 8,
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const today = dayKey(new Date());
  usePickerDialog(popoverRef, true, onClose, anchor);

  useEffect(() => {
    const place = () => {
      if (window.innerWidth < 768) {
        setPosition({});
        return;
      }
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(252, window.innerWidth - 16);
      const estimatedHeight = popoverRef.current?.offsetHeight || 300;
      const left = Math.max(
        8,
        Math.min(rect.left, window.innerWidth - width - 8),
      );
      const below = rect.bottom + 6;
      const top =
        below + estimatedHeight <= window.innerHeight
          ? below
          : Math.max(8, rect.top - estimatedHeight - 6);
      setPosition({ top, left });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchor]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popoverRef.current?.contains(target) && !anchor.contains(target))
        onClose();
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div className={styles.mobileBackdrop}>
      <div
        ref={popoverRef}
        className={styles.popover}
        style={position}
        role="dialog"
        aria-modal={position.top === undefined || undefined}
        aria-label="选择日期"
      >
        <CalendarGrid
          value={value}
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            onSelect(date);
            onClose();
          }}
        />
        <div className={styles.calendarFooter}>
          <button
            type="button"
            onClick={() => {
              onSelect("");
              onClose();
            }}
          >
            清除
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(today);
              onClose();
            }}
          >
            今天
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TimePopover({
  anchor,
  value,
  onSelect,
  onClose,
}: {
  anchor: HTMLElement;
  value: string;
  onSelect: (time: string) => void;
  onClose: () => void;
}) {
  const initial = validTime(value) ? value : "00:00";
  const [hour, setHour] = useState(initial.slice(0, 2));
  const [minute, setMinute] = useState(initial.slice(3, 5));
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top?: number; left?: number }>({
    top: 8,
    left: 8,
  });

  useEffect(() => {
    const place = () => {
      if (window.innerWidth < 768) {
        setPosition({});
        return;
      }
      const rect = anchor.getBoundingClientRect();
      const width = 158;
      const height = popoverRef.current?.offsetHeight || 140;
      const left = Math.max(
        8,
        Math.min(rect.right - width, window.innerWidth - width - 8),
      );
      const below = rect.bottom + 6;
      setPosition({
        left,
        top:
          below + height <= window.innerHeight
            ? below
            : Math.max(8, rect.top - height - 6),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchor]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popoverRef.current?.contains(target) && !anchor.contains(target))
        onClose();
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [anchor, onClose]);

  usePickerDialog(popoverRef, true, onClose, anchor);

  const confirm = () => {
    const next = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    if (!validTime(next)) return;
    onSelect(next);
    onClose();
  };

  return createPortal(
    <div className={styles.mobileBackdrop}>
      <div
        ref={popoverRef}
        className={`${styles.popover} ${styles.timePopover}`}
        style={position}
        role="dialog"
        aria-modal={position.top === undefined || undefined}
        aria-label="选择时间"
      >
        <h4>选择时间（24 小时制）</h4>
        <div className={styles.timeFields}>
          <input
            aria-label="小时"
            inputMode="numeric"
            maxLength={2}
            value={hour}
            onChange={(event) =>
              setHour(event.target.value.replace(/\D/g, "").slice(0, 2))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") confirm();
            }}
          />
          <span>:</span>
          <input
            aria-label="分钟"
            inputMode="numeric"
            maxLength={2}
            value={minute}
            onChange={(event) =>
              setMinute(event.target.value.replace(/\D/g, "").slice(0, 2))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") confirm();
            }}
          />
        </div>
        <div className={styles.timeActions}>
          <button type="button" onClick={onClose}>
            取消
          </button>
          <button type="button" onClick={confirm}>
            确认
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  function DateTimeInput(
    {
      value,
      onValueChange,
      onCommit,
      className,
      disabled,
      required,
      name,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) {
    const { date: valueDate, time: valueTime } = splitValue(value);
    const [date, setDate] = useState(valueDate);
    const [time, setTime] = useState(valueTime);
    const [open, setOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const calendarButtonRef = useRef<HTMLButtonElement>(null);
    const timeButtonRef = useRef<HTMLButtonElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const currentRef = useRef({ date: valueDate, time: valueTime });
    const inputId = useId();

    useEffect(() => {
      setDate(valueDate);
      setTime(valueTime);
      currentRef.current = { date: valueDate, time: valueTime };
    }, [valueDate, valueTime]);
    useEffect(() => {
      dateInputRef.current?.setCustomValidity(
        required && !validTime(time) ? "请选择时间。" : "",
      );
    }, [required, time]);
    const update = (nextDate: string, nextTime: string) => {
      currentRef.current = { date: nextDate, time: nextTime };
      setDate(nextDate);
      setTime(nextTime);
      onValueChange(combine(nextDate, nextTime));
    };
    const commit = (
      nextDate = currentRef.current.date,
      nextTime = currentRef.current.time,
    ) => onCommit?.(combine(nextDate, nextTime));
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      window.setTimeout(() => {
        if (
          !open &&
          !timeOpen &&
          !rootRef.current?.contains(document.activeElement) &&
          !document.activeElement?.closest('[role="dialog"]')
        )
          commit();
      }, 0);
    };
    const invalid = Boolean(
      (date || time) && (!validDate(date) || !validTime(time)),
    );

    return (
      <div
        ref={rootRef}
        className={[
          styles.root,
          invalid ? styles.invalid : undefined,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.editor}>
          <div className={styles.dateZone}>
            <input
              ref={(node) => {
                dateInputRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              id={inputId}
              className={styles.dateInput}
              value={date}
              name={undefined}
              disabled={disabled}
              required={required}
              inputMode="numeric"
              autoComplete="off"
              placeholder="YYYY-MM-DD"
              aria-label="日期"
              aria-invalid={invalid || undefined}
              pattern="\\d{4}-\\d{2}-\\d{2}"
              onChange={(event) =>
                update(formatDateInput(event.target.value), time)
              }
              onBlur={handleBlur}
              onFocus={onFocus}
              {...props}
            />
            <button
              ref={calendarButtonRef}
              type="button"
              className={styles.calendarButton}
              disabled={disabled}
              aria-label="打开日历"
              aria-expanded={open}
              onClick={() => {
                setTimeOpen(false);
                setOpen((current) => !current);
              }}
            >
              ▣
            </button>
          </div>
          <button
            ref={timeButtonRef}
            type="button"
            className={styles.timeSelector}
            disabled={disabled}
            aria-label="选择时间"
            aria-expanded={timeOpen}
            onClick={() => {
              setOpen(false);
              setTimeOpen((current) => !current);
            }}
          >
            <span>{time || "HH:mm"}</span>
            <i aria-hidden="true">◷</i>
          </button>
        </div>
        <input type="hidden" name={name} value={combine(date, time)} />
        {open && calendarButtonRef.current && (
          <CalendarPopover
            anchor={calendarButtonRef.current}
            value={date}
            onSelect={(nextDate) => {
              const nextTime = time || "00:00";
              update(nextDate, nextTime);
              window.setTimeout(() => commit(nextDate, nextTime), 0);
            }}
            onClose={() => setOpen(false)}
          />
        )}
        {timeOpen && timeButtonRef.current && (
          <TimePopover
            anchor={timeButtonRef.current}
            value={time}
            onSelect={(nextTime) => {
              update(date, nextTime);
              window.setTimeout(() => commit(date, nextTime), 0);
            }}
            onClose={() => setTimeOpen(false)}
          />
        )}
      </div>
    );
  },
);

export function DateTimeField({
  type: _type,
  defaultValue,
  value,
  onChange,
  ...props
}: DateTimeFieldProps) {
  const [internalValue, setInternalValue] = useState(
    String(value ?? defaultValue ?? ""),
  );
  const controlled = value !== undefined;
  const currentValue = controlled ? String(value ?? "") : internalValue;
  return (
    <DateTimeInput
      {...props}
      value={currentValue}
      onValueChange={(nextValue) => {
        if (!controlled) setInternalValue(nextValue);
        onChange?.({
          target: { value: nextValue, name: props.name || "" },
          currentTarget: { value: nextValue, name: props.name || "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }}
    />
  );
}
