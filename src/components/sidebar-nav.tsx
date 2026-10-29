"use client";

import businessStyles from "@/components/business.module.css";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Item = { group: string; href: string; label: string; count?: number };

export function SidebarNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const groups = [...new Set(items.map(item => item.group))];
  useEffect(() => {
    const activeLink = activeLinkRef.current;
    const sidebar = activeLink?.closest("aside");
    if (!activeLink || !sidebar) return;
    const link = activeLink.getBoundingClientRect();
    const container = sidebar.getBoundingClientRect();
    const padding = 12;
    if (link.top < container.top + padding) sidebar.scrollTop += link.top - container.top - padding;
    if (link.bottom > container.bottom - padding) sidebar.scrollTop += link.bottom - container.bottom + padding;
  }, [pathname]);
  return <nav className={businessStyles["sidebar-nav"]} aria-label="主导航">{groups.map(group => {
    const groupItems = items.filter(item => item.group === group);
    const groupActive = groupItems.some(item => item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`));
    return <details className={businessStyles["sidebar-nav__group"]} key={group} open={groupActive}>
      <summary className={businessStyles["sidebar-nav__group-label"]}>{group}</summary>
      <div className={businessStyles["sidebar-nav__group-items"]}>{groupItems.map(item => {
        const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return <a ref={active ? activeLinkRef : undefined} key={item.href} href={item.href} className={[businessStyles["sidebar-nav__link"], active ? businessStyles["sidebar-nav__link-active"] : undefined].filter(Boolean).join(" ")} aria-current={active ? "page" : undefined}>{item.label}{item.count ? <span className={businessStyles["nav-count"]}>{item.count}</span> : null}</a>;
      })}</div>
    </details>;
  })}</nav>;
}
