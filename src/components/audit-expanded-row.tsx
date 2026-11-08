"use client";

import { Button } from "./ui/button";
import { useState, type ReactNode } from "react";
import rowStyles from "./ui/table-body.module.css";
import styles from "@/app/logs/page.module.css";

export function AuditExpandedRow({
  children,
  detail,
}: {
  children: ReactNode;
  detail: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article>
      <div className={`${styles.logRow} ${rowStyles.logRow}`}>
        {children}
        <div className={styles.detail}>
          {detail ? (
            <Button
              variant="text"
              size="small"
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "收起 ⌃" : "查看 ⌄"}
            </Button>
          ) : (
            <span className={styles.noDetail}>—</span>
          )}
        </div>
      </div>
      {open && <div className={styles.expandedPanel}>{detail}</div>}
    </article>
  );
}
