"use client";

import businessStyles from "@/components/business.module.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { InlineEditInput, InlineEditTrigger } from "@/components/ui/inline-editor";
import { DateTimeInput } from "@/components/ui/date-time-field";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FilterSelect } from "@/components/ui/filter-select";
import { validOperationalDateInput } from "@/lib/time";
import styles from "./inline-order-value.module.css";

export type InlineOrderField =
  | "customerId"
  | "customerReference"
  | "carrier"
  | "vesselName"
  | "voyage"
  | "etbText"
  | "openingText"
  | "siCutoffText"
  | "portCutoffText"
  | "etaText"
  | "etdText"
  | "emptyPickupLocation"
  | "fullReturnLocation";
const timeFields = new Set<InlineOrderField>([
  "etbText",
  "openingText",
  "siCutoffText",
  "portCutoffText",
  "etaText",
  "etdText",
]);
export function InlineOrderValue({
  orderId,
  field,
  display,
  value = "",
  placeholder,
  options,
  className,
}: {
  orderId: string;
  field: InlineOrderField;
  display: string;
  value?: string;
  placeholder: string;
  options?: { id: string; name: string }[];
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const saving = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function save(next = draft) {
    const trimmed = next.trim();
    if (!trimmed || saving.current) {
      setEditing(false);
      return;
    }
    if (timeFields.has(field) && !validOperationalDateInput(trimmed)) {
      const message = "请输入 YYYY-MM-DD，时间可选（YYYY-MM-DD HH:mm）。";
      setError(message);
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.setCustomValidity(message);
        inputRef.current.reportValidity();
        inputRef.current.focus();
      }
      return;
    }
    saving.current = true;
    setError("");
    try {
      const response = await fetch(`/api/orders/${orderId}/fields`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ field, value: trimmed }),
      });
      if (!response.ok) throw new Error();
      setEditing(false);
      router.refresh();
    } catch {
      setError("保存失败，请重试。");
    } finally {
      saving.current = false;
    }
  }

  if (!editing)
    return (
      <>
        <InlineEditTrigger
          className={className}
          title="点击编辑"
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
        >
          {display}
        </InlineEditTrigger>
        {error && (
          <span className={businessStyles["sr-only"]} role="status">
            {error}
          </span>
        )}
      </>
    );
  const common = {
    ref: inputRef as never,
    value: draft,
    "aria-label": placeholder,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      event.currentTarget.setCustomValidity("");
      setError("");
      setDraft(event.target.value);
    },
    onBlur: () => void save(),
    onKeyDown: (
      event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void save();
      }
      if (event.key === "Escape") setEditing(false);
    },
  };
  if (timeFields.has(field)) {
    const dateTimeValue = /^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2})?$/.test(draft) ? `${draft.slice(0, 10)}T${draft.slice(11, 16) || "00:00"}` : "";
    if (field === "etbText" || field === "openingText") {
      return <DateTimePicker
        className={styles.dateTime}
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={dateTimeValue}
        onCancel={() => setEditing(false)}
        onConfirm={(nextValue) => {
          setError("");
          setDraft(nextValue.replace("T", " "));
          void save(nextValue.replace("T", " "));
        }}
      />;
    }
    return (
      <DateTimeInput
        className={styles.dateTime}
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={dateTimeValue}
        onValueChange={(nextValue) => {
          setError("");
          setDraft(nextValue.replace("T", " "));
        }}
        onCommit={(nextValue) => void save(nextValue.replace("T", " "))}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void save();
          }
          if (event.key === "Escape") setEditing(false);
        }}
      />
    );
  }
  return options ? (
    <FilterSelect
      className={styles.select}
      value={draft}
      autoFocus
      aria-label={placeholder}
      onBlur={() => void save()}
      onChange={(event) => {
        setError("");
        setDraft(event.target.value);
        void save(event.target.value);
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </FilterSelect>
  ) : (
    <InlineEditInput
      placeholder={placeholder}
      {...common}
    />
  );
}
