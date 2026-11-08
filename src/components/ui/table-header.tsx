import type { HTMLAttributes } from "react";
import styles from "./table-header.module.css";

type Props = HTMLAttributes<HTMLTableSectionElement> & { as?: "thead" };
type GridProps = HTMLAttributes<HTMLDivElement> & { as: "div" };

/** Shared header sizing, based on the operation log's 11px vertical padding. */
export function TableHeader(props: Props | GridProps) {
  if (props.as === "div") {
    const { as: _as, className, ...rest } = props;
    return <div {...rest} className={[styles.grid, className].filter(Boolean).join(" ")} />;
  }
  const { as: _as, className, ...rest } = props;
  return <thead {...rest} className={[styles.header, className].filter(Boolean).join(" ")} />;
}
