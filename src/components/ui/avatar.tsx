import type { ReactNode } from "react";
import styles from "./avatar.module.css";
export function Avatar({children,className}: {children:ReactNode;className?:string}) {
  return <span aria-hidden="true" className={[styles.avatar,className].filter(Boolean).join(" ")}>{children}</span>;
}
