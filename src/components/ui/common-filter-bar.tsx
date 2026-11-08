"use client";
import { useState, type ReactNode } from "react";
import { Button } from "./button";
import { FilterSearchInput } from "./filter-search-input";
import { FilterSelect } from "./filter-select";
import controls from "./list.module.css";
import styles from "./common-filter-bar.module.css";

export type FilterValue = string | string[] | [string, string];
export type FilterValues = Record<string, FilterValue>;
type BaseItem = { key: string; label: string; placeholder?: string; disabled?: boolean };
export type FilterItem = BaseItem & (
  | { type: "input"; applyOnBlur?: boolean; width?: 180 | 190 | 200 | 210 | 220 }
  | { type: "select"; multiple?: boolean; options: readonly { value: string; label: string; disabled?: boolean }[]; width?: 120 | 130 | 140 | 150 }
  | { type: "date" | "month" | "dateRange" }
);
export type CommonFilterBarProps = {
  items: readonly FilterItem[];
  values?: FilterValues;
  defaultValues?: FilterValues;
  onChange?: (values: FilterValues) => void;
  onSearch: (values: FilterValues) => void;
  onReset?: () => void;
  actions?: ReactNode;
  showReset?: boolean;
  /** change: immediate local filtering; submit: explicit search / Enter. */
  searchMode?: "change" | "submit";
  className?: string;
};
export function emptyFilterValues(items: readonly FilterItem[]): FilterValues {
  return Object.fromEntries(items.map(item => [item.key, item.type === "dateRange" ? ["", ""] : item.type === "select" && item.multiple ? [] : ""]));
}
export function CommonFilterBar({ items, values, defaultValues, onChange, onSearch, onReset, actions, showReset = true, searchMode = "change", className }: CommonFilterBarProps) {
  const [internal, setInternal] = useState<FilterValues>(() => ({ ...emptyFilterValues(items), ...defaultValues }));
  const current = values ?? internal;
  function update(next: FilterValues) { if (values === undefined) setInternal(next); onChange?.(next); }
  function change(key: string, value: FilterValue, apply = true) { const next = { ...current, [key]: value }; update(next); if (apply && searchMode === "change") onSearch(next); }
  return <form data-page-toolbar className={[styles.bar, className].filter(Boolean).join(" ")} role="search" aria-label="筛选条件" onSubmit={event => { event.preventDefault(); onSearch(current); }}>
    <div className={styles.items}>{items.map(item => {
      const value = current[item.key];
      const placeholder = item.placeholder || item.label;
      if (item.type === "input") return <div key={item.key} className={styles.search} ><FilterSearchInput aria-label={item.label} placeholder={placeholder} disabled={item.disabled} value={typeof value === "string" ? value : ""} onChange={event => change(item.key, event.target.value, !item.applyOnBlur)} onBlur={item.applyOnBlur && searchMode === "change" ? () => onSearch(current) : undefined}/></div>;
      if (item.type === "select" && item.multiple) return <details key={item.key} className={styles.multi} ><summary className={controls.selectTrigger} aria-label={item.label} aria-disabled={item.disabled}><span>{placeholder}{Array.isArray(value) && value.length ? ` (${value.length})` : ""}</span><span className={controls.selectChevron} aria-hidden="true"/></summary><div className={styles.options}>{item.options.map(option => <label key={option.value}><input type="checkbox" disabled={item.disabled || option.disabled} checked={Array.isArray(value) && value.includes(option.value)} onChange={event => { const selected = Array.isArray(value) ? value : []; change(item.key, event.target.checked ? [...selected, option.value] : selected.filter(entry => entry !== option.value)); }}/>{option.label}</label>)}</div></details>;
      if (item.type === "select") return <div key={item.key} className={styles.select} ><FilterSelect aria-label={item.label} disabled={item.disabled} value={typeof value === "string" ? value : ""} onChange={event => change(item.key, event.target.value)}><option value="">{placeholder}</option>{item.options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</FilterSelect></div>;
      if (item.type === "dateRange") { const range = Array.isArray(value) ? value : ["", ""]; return <fieldset key={item.key} className={styles.range}><legend className={styles.srOnly}>{item.label}</legend><input type="date" aria-label={`${item.label}开始`} disabled={item.disabled} value={range[0] || ""} max={range[1] || undefined} onChange={event => change(item.key, [event.target.value, range[1] || ""])}/><span aria-hidden="true">至</span><input type="date" aria-label={`${item.label}结束`} disabled={item.disabled} value={range[1] || ""} min={range[0] || undefined} onChange={event => change(item.key, [range[0] || "", event.target.value])}/></fieldset>; }
      return <input key={item.key} className={styles.date} type={item.type} aria-label={item.label} title={placeholder} disabled={item.disabled} value={typeof value === "string" ? value : ""} onChange={event => change(item.key, event.target.value)}/>;
    })}{searchMode === "submit" && <button type="submit" className={styles.searchButton}>查询</button>}{showReset && <Button size="toolbar" variant="reset" onClick={() => { const next = emptyFilterValues(items); update(next); onReset?.(); onSearch(next); }}>重置</Button>}</div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </form>;
}
