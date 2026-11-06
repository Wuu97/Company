import type { ReactNode } from "react";
import styles from "./entity-card.module.css";
/** Bounded entity surface for peer records inside a page card. */
export function EntityCard({children,className}: {children:ReactNode;className?:string}) {
  return <article className={[styles.card,className].filter(Boolean).join(" ")}>{children}</article>;
}
