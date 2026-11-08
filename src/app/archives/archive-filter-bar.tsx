"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CommonFilterBar,
  type FilterValues,
} from "@/components/ui/common-filter-bar";
import type { ArchiveTab } from "./archive-tabs";

export function ArchiveFilterBar({
  tab,
  q,
  status,
  placeholder,
}: {
  tab?: ArchiveTab;
  q: string;
  status: string;
  placeholder: string;
}) {
  const [values, setValues] = useOptimistic<FilterValues>({ q, status });
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function search(values: FilterValues) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    for (const key of ["q", "status"] as const) {
      const value = typeof values[key] === "string" ? values[key].trim() : "";
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (tab) params.set("tab", tab);
    startTransition(() => {
      setValues(values);
      router.push(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      });
    });
  }

  return (
    <CommonFilterBar
      values={values}
      onSearch={search}
      items={[
        { type: "input", key: "q", label: "查找档案", placeholder },
        {
          type: "select",
          key: "status",
          label: "档案状态",
          placeholder: "全部状态",
          options: [
            { value: "ACTIVE", label: "启用" },
            { value: "INACTIVE", label: "停用" },
          ],
        },
      ]}
    />
  );
}
