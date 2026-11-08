import { Container } from "lucide-react";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";
import type { SidebarItem } from "./sidebar-config";
import styles from "./sidebar.module.css";

export function Sidebar({
  user,
  items,
}: {
  user: { name: string; role: string };
  items: SidebarItem[];
}) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>
            <Container size={21} aria-hidden="true" />
          </span>
          <span>运柜管理</span>
        </Link>
      </header>
      <SidebarNav items={items} />
      <footer className={styles.footer}>
        <div className={styles.userCard}>
          <span className={styles.avatar} aria-hidden="true">
            {Array.from(user.name.trim())[0] || "用"}
          </span>
          <div className={styles.userInfo}>
            <span className={styles.userName} title={user.name}>
              {user.name}
            </span>
            <span className={styles.role}>
              {user.role === "ADMIN" ? "管理员" : "业务成员"}
            </span>
          </div>
          <LogoutButton iconOnly />
        </div>
      </footer>
    </aside>
  );
}
