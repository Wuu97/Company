"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useTransition,
  type FormHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./list.module.css";
import { ButtonLink, type ButtonSize } from "./button";
import { FilterSearchInput } from "./filter-search-input";
import { FilterSelect } from "./filter-select";

type ListFilterProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

/**
 * Shared list filtering behavior. Text fields wait for Enter or blur, while
 * selects, dates and checkboxes apply immediately. Every application drops the
 * page parameter, so a changed condition always returns to page one.
 */
export const ListFilter = forwardRef<HTMLFormElement, ListFilterProps>(
  function ListFilter(
    { className, children, onSubmit, onChange, onBlur, ...props },
    forwardedRef,
  ) {
    const router = useRouter();
    const pathname = usePathname();
    const formRef = useRef<HTMLFormElement | null>(null);
    const requestRef = useRef<AbortController | null>(null);
    const [pending, startTransition] = useTransition();
    useEffect(() => {
      return () => requestRef.current?.abort();
    }, [pathname]);
    const setRef = useCallback(
      (node: HTMLFormElement | null) => {
        formRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );
    const apply = useCallback(() => {
      const form = formRef.current;
      if (!form) return;
      // Router navigation itself is managed by Next, so cancel the not-yet-issued
      // navigation when controls are changed repeatedly.
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      queueMicrotask(() => {
        if (controller.signal.aborted) return;
        const params = new URLSearchParams();
        for (const [key, raw] of new FormData(form).entries()) {
          if (raw instanceof File) continue;
          const value = String(raw).trim();
          if (value) params.set(key, value);
        }
        params.delete("page");
        const search = params.toString();
        startTransition(() =>
          router.replace(search ? `${pathname}?${search}` : pathname, {
            scroll: false,
          }),
        );
      });
    }, [pathname, router]);
    // Custom selects use hidden fields, whose native change events do not
    // participate in React's synthetic onChange handling.
    useEffect(() => {
      const form = formRef.current;
      if (!form) return;
      form.addEventListener("list-filter-change", apply);
      return () => form.removeEventListener("list-filter-change", apply);
    }, [apply]);
    const submit: FormHTMLAttributes<HTMLFormElement>["onSubmit"] = (event) => {
      event.preventDefault();
      onSubmit?.(event);
      apply();
    };
    const change: FormHTMLAttributes<HTMLFormElement>["onChange"] = (event) => {
      onChange?.(event);
      const control = event.target as unknown as
        HTMLInputElement | HTMLSelectElement;
      if (
        control.tagName === "SELECT" ||
        control.type === "checkbox" ||
        control.type === "radio" ||
        control.type === "date" ||
        control.type === "month" ||
        control.type === "datetime-local" ||
        control.type === "hidden"
      )
        apply();
    };
    const blur: FormHTMLAttributes<HTMLFormElement>["onBlur"] = (event) => {
      onBlur?.(event);
      const control = event.target as unknown as HTMLInputElement;
      if (
        control.tagName === "INPUT" &&
        !["checkbox", "radio", "hidden", "date", "month", "datetime-local"].includes(control.type)
      )
        apply();
    };
    return (
      <>
        <form
          data-list-filter
          ref={setRef}
          className={[styles.filter, className].filter(Boolean).join(" ")}
          onSubmit={submit}
          onChange={change}
          onBlur={blur}
          aria-busy={pending}
          {...props}
        >
          {children}
        </form>
        {pending && (
          <div className={styles.loadingMask} role="status" aria-live="polite">
            <span className={styles.spinner} />
            正在加载记录…
          </div>
        )}
      </>
    );
  },
);

export function FilterField({
  label,
  children,
  className,
  search = false,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  search?: boolean;
}) {
  return (
    <label
      className={[styles.field, search ? styles.search : undefined, className]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}

/** Compact text control for list filters; it intentionally omits the form-field hint/error layout. */
export function FilterTextField({
  className,
  compact = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { compact?: boolean }) {
  if (props.type === "hidden") return <input {...props} />;
  return <FilterSearchInput className={[compact ? styles.controlCompact : undefined, className].filter(Boolean).join(" ")} {...props} />;
}

/** Compact select control for list filters; use inside FilterField for its accessible label. */
export function FilterSelectField({
  children,
  className,
  compact = false,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <FilterSelect
      className={className}
      triggerClassName={compact ? styles.selectTriggerCompact : undefined}
      optionClassName={compact ? styles.selectOptionCompact : undefined}
      {...props}
    >
      {children}
    </FilterSelect>
  );
}

export function FilterActions({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-filter-actions className={[styles.actions, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function FilterClearLink({
  href,
  children = "重置",
  className,
  size = "toolbar",
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  size?: ButtonSize;
}) {
  return (
    <ButtonLink
      variant="reset"
      size={size}
      className={[styles.clear, className].filter(Boolean).join(" ")}
      href={href}
    >
      {children}
    </ButtonLink>
  );
}

export function FilterActionLink({
  href,
  children,
  className,
  size = "toolbar",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
}) {
  return (
    <ButtonLink
      size={size}
      className={[styles.clear, className].filter(Boolean).join(" ")}
      href={href}
    >
      {children}
    </ButtonLink>
  );
}

export function ResultSummary({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={[styles.summary, className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}
