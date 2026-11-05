"use client";

import { useRouter } from "next/navigation";

export function PageSizeSelect({ value, href }: { value: number; href: string }) {
  const router = useRouter();
  return <select aria-label="每页条数" value={value} onChange={event => {
    const target = new URL(href, window.location.origin);
    target.searchParams.set("pageSize", event.target.value);
    target.searchParams.delete("page");
    router.replace(`${target.pathname}?${target.searchParams}`, { scroll: false });
  }}>{[10, 20, 50].map(size => <option key={size} value={size}>{size} 条/页</option>)}</select>;
}
