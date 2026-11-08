"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Ship,
  Users,
  FolderArchive,
  Wallet,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  sidebarSections,
  isSidebarRouteActive,
  type SidebarItem,
  type SidebarIcon,
} from "./sidebar-config";
import styles from "./sidebar.module.css";

const icons = {
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  sailings: Ship,
  customers: Users,
  archives: FolderArchive,
  finance: Wallet,
  settings: Settings,
} satisfies Record<SidebarIcon, typeof LayoutDashboard>;

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;
    const target = active.getBoundingClientRect();
    const viewport = nav.getBoundingClientRect();
    if (target.top < viewport.top) nav.scrollTop += target.top - viewport.top;
    else if (target.bottom > viewport.bottom)
      nav.scrollTop += target.bottom - viewport.bottom;
  }, [pathname]);

  return (
    <nav ref={navRef} className={styles.navigation} aria-label="主导航">
      {sidebarSections.map((section) => (
        <section
          className={styles.section}
          key={section.label}
          aria-label={section.label}
        >
          <h2 className={styles.sectionTitle}>{section.label}</h2>
          {section.groups.map((group) => {
            const entries = items.filter((item) => item.group === group.label);
            if (!entries.length) return null;
            const Icon = icons[group.icon];
            const active = entries.some((item) =>
              isSidebarRouteActive(pathname, item.href),
            );
            const count = entries.reduce(
              (total, item) => total + (item.count ?? 0),
              0,
            );
            const content = (
              <>
                <Icon size={18} aria-hidden="true" />
                <span className={styles.label}>{group.label}</span>
                {count > 0 && (
                  <span
                    className={styles.count}
                    aria-label={`${count} 条待处理`}
                  >
                    {count}
                  </span>
                )}
                <ChevronRight
                  size={14}
                  className={styles.chevron}
                  aria-hidden="true"
                />
              </>
            );
            if (entries.length === 1)
              return (
                <Link
                  key={group.label}
                  href={entries[0].href}
                  className={`${styles.item} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {content}
                </Link>
              );
            return (
              <details
                key={`${group.label}-${active}`}
                className={styles.group}
                open={active}
              >
                <summary
                  className={`${styles.item} ${active ? styles.active : ""}`}
                >
                  {content}
                </summary>
                <div className={styles.children}>
                  {entries.map((item) => {
                    const selected = isSidebarRouteActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.child} ${selected ? styles.selected : ""}`}
                        aria-current={selected ? "page" : undefined}
                      >
                        <span className={styles.label}>{item.label}</span>
                        {!!item.count && (
                          <span className={styles.count}>{item.count}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </section>
      ))}
    </nav>
  );
}
