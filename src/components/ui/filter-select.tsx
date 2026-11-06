"use client";

import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { pinyin } from "pinyin-pro";
import styles from "./list.module.css";

type Option = { value: string; label: ReactNode; disabled?: boolean };
type FilterSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  children: ReactNode;
  triggerClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  searchable?: boolean;
};

function optionsFrom(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<{ value?: string; disabled?: boolean; children?: ReactNode }>(child)) return [];
    return [{ value: child.props.value || "", label: child.props.children, disabled: child.props.disabled }];
  });
}
function optionText(label: ReactNode): string { return typeof label === "string" || typeof label === "number" ? String(label) : ""; }
function optionSearchTerms(label: ReactNode): string[] {
  const text = optionText(label);
  const syllables = pinyin(text, { toneType: "none", type: "array" });
  return [text.toLocaleLowerCase(), syllables.join("").toLocaleLowerCase(), syllables.map(item => item[0] || "").join("").toLocaleLowerCase()];
}

/**
 * A layout-safe select for list filters. Its choices expand beneath the trigger
 * instead of opening the browser's native dropdown over surrounding content.
 */
export function FilterSelect({ children, className, triggerClassName, optionsClassName, optionClassName, searchable = true, defaultValue, value: controlledValue, name, disabled, onChange, onBlur, required, autoFocus, "aria-label": ariaLabel, "aria-invalid": ariaInvalid }: FilterSelectProps) {
  const options = optionsFrom(children);
  const initialValue = String(controlledValue ?? defaultValue ?? options[0]?.value ?? "");
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState({ left: 0, top: 0, width: 0, maxHeight: 200 });
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = options.find(option => option.value === value) || options[0];
  const isControlled = controlledValue !== undefined;
  const visibleOptions = useMemo(() => {
    const [empty, ...rest] = options;
    const candidates = empty?.value === "" ? rest : options;
    const ordered = candidates.every(option => /^\d/.test(optionText(option.label))) ? candidates : [...candidates].sort((a, b) => optionSearchTerms(a.label)[1].localeCompare(optionSearchTerms(b.label)[1]));
    const needle = query.trim().toLocaleLowerCase();
    const matched = needle ? ordered.filter(option => optionSearchTerms(option.label).some(term => term.includes(needle))) : ordered;
    return empty?.value === "" ? [empty, ...matched] : matched;
  }, [options, query]);

  useEffect(() => {
    if (isControlled) setValue(String(controlledValue));
  }, [controlledValue, isControlled]);

  useEffect(() => {
    if (!open) return;
    const closeWhenOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeWhenOutside);
    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [open]);

  useEffect(() => {
    if (open && searchable) requestAnimationFrame(() => searchRef.current?.focus());
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;
    const position = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom - 14;
      const above = rect.top - 14;
      const upwards = below < 200 && above > below;
      const maxHeight = Math.max(0, Math.min(200, upwards ? above : below));
      const width = Math.min(rect.width, window.innerWidth - 16);
      setPlacement({ left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)), top: upwards ? rect.top - 6 - maxHeight : rect.bottom + 6, width, maxHeight });
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [open]);

  const choose = (nextValue: string) => {
    if (!isControlled) setValue(nextValue);
    if (inputRef.current) {
      inputRef.current.value = nextValue;
      // Let the ListFilter shell apply this discrete condition immediately.
      inputRef.current.dispatchEvent(new Event("list-filter-change", { bubbles: true }));
    }
    setOpen(false);
    setQuery("");
    onChange?.({ target: { value: nextValue, name }, currentTarget: { value: nextValue, name } } as ChangeEvent<HTMLSelectElement>);
  };

  return <div ref={rootRef} className={[styles.select, className].filter(Boolean).join(" ")}>
    <input ref={inputRef} type="hidden" name={name} value={isControlled ? String(controlledValue ?? "") : value} required={required} />
    <button type="button" className={[styles.selectTrigger, triggerClassName].filter(Boolean).join(" ")} disabled={disabled} autoFocus={autoFocus} aria-label={ariaLabel} aria-invalid={ariaInvalid} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => { setOpen(current => !current); setQuery(""); }} onBlur={event => onBlur?.(event as unknown as FocusEvent<HTMLSelectElement>)}>
      <span>{open && query ? query : selected?.label}</span><span className={styles.selectChevron} aria-hidden="true" />
    </button>
    {open && createPortal(<div ref={menuRef} data-select-portal data-dialog-owner={rootRef.current?.closest('[role="dialog"]')?.getAttribute("aria-labelledby") || undefined} style={{ position: "fixed", zIndex: 2000, ...placement }} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); rootRef.current?.querySelector("button")?.focus(); } }} id={listId} className={[styles.selectOptions, optionsClassName].filter(Boolean).join(" ")} role="listbox" aria-label={ariaLabel}>
      {searchable && <input ref={searchRef} className={styles.selectSearch} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }} aria-label="输入筛选" />}
      {visibleOptions.map(option => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={[styles.selectOption, optionClassName].filter(Boolean).join(" ")} disabled={option.disabled} onMouseDown={event => event.preventDefault()} onClick={() => choose(option.value)}><span>{option.label}</span>{option.value === value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>}</button>)}
      {!visibleOptions.length && <span className={styles.selectEmpty}>未找到匹配项</span>}
    </div>, document.body)}
  </div>;
}
