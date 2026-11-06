import type { ReactNode } from "react";
import styles from "./nav-tabs.module.css";

type Item = { label: ReactNode; href?: string; active?: boolean; onClick?: () => void; count?: number };
export function NavTabs({ label, items, className }: { label: string; items: Item[]; className?: string }) {
  return <nav className={[styles.tabs, className].filter(Boolean).join(" ")} aria-label={label}>
    {items.map((item, index) => {
      const content = <>{item.label}{item.count !== undefined && <span className={styles.count}>{item.count}</span>}</>;
      const common = { "data-navigation-tab": true, className: styles.tab, "aria-current": item.active ? "page" as const : undefined };
      return item.href ? <a key={index} {...common} href={item.href}>{content}</a> : <button type="button" key={index} {...common} onClick={item.onClick}>{content}</button>;
    })}
  </nav>;
}
