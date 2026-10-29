import type { ReactNode } from "react";
import { Button, ButtonLink } from "./button";
import styles from "./nav-tabs.module.css";

type Item = { label: ReactNode; href?: string; active?: boolean; onClick?: () => void; count?: number };
export function NavTabs({ label, items, className }: { label: string; items: Item[]; className?: string }) {
  return <nav className={[styles.tabs, className].filter(Boolean).join(" ")} aria-label={label}>
    <span className={styles.label}>{label}</span>
    {items.map((item, index) => {
      const content = <>{item.label}{item.count !== undefined && <span className={styles.count}>{item.count}</span>}</>;
      const common = { className: styles.tab, variant: item.active ? "primary" as const : "secondary" as const, size: "toolbar" as const, "aria-current": item.active ? "page" as const : undefined };
      return item.href
        ? <ButtonLink key={index} {...common} href={item.href}>{content}</ButtonLink>
        : <Button key={index} {...common} onClick={item.onClick}>{content}</Button>;
    })}
  </nav>;
}
