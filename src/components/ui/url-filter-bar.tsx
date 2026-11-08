"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CommonFilterBar, type FilterItem, type FilterValues } from "./common-filter-bar";

type Props = {
  items: readonly FilterItem[];
  initialValues: Record<string, string>;
  className?: string;
  fixedParams?: Record<string, string>;
};

export function UrlFilterBar({ items, initialValues, fixedParams, className }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [values, setValues] = useState<FilterValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  function search(filters: FilterValues) {
    const params = new URLSearchParams(fixedParams);
    for (const { key } of items) {
      const value = filters[key];
      if (typeof value === "string" && value.trim()) {
        params.set(key, value.trim());
      }
    }
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  }

  return <CommonFilterBar className={className} items={items} values={values} onChange={setValues} onSearch={search} />;
}
