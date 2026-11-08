import { TableBody } from "@/components/ui/table-body";
import { TableHeader } from "@/components/ui/table-header";
import { TableEmptyState } from "./table-empty-state";
import type { CSSProperties, Key, ReactNode, TableHTMLAttributes } from "react";
import { TableScrollSurface } from "./table-scroll-surface";
import { StatusTag } from "./status-tag";
import styles from "./data-table.module.css";
export type TableStatusTone = "success" | "warning" | "danger" | "default";
export function TableStatusTag({ children, tone = "default" }: { children: ReactNode; tone?: TableStatusTone }) { return <StatusTag type={tone}>{children}</StatusTag>; }
export type DataTableColumn<T> = {
  title: ReactNode; key: string; dataIndex?: keyof T | readonly string[];
  /** Frozen columns require a numeric pixel width. */
  width?: number; minWidth?: number; fixed?: "left" | "right";
  align?: "left" | "center" | "right";
  type?: "text" | "date" | "month" | "status" | "number" | "money" | "percent";
  render?: (value: unknown, record: T, index: number) => ReactNode;
  statusMap?: Record<string, { label: string; tone: TableStatusTone }>;
};
type BaseProps = TableHTMLAttributes<HTMLTableElement> & { mobileHint?: ReactNode };
export type DataTableProps<T> = BaseProps & {
  columns: readonly DataTableColumn<T>[]; dataSource: readonly T[];
  rowKey: keyof T | ((record: T) => Key); loading?: boolean; skeletonRows?: number;
  empty?: { icon?: ReactNode; title?: ReactNode; description?: ReactNode };
  fitContainer?: boolean;
  maxHeight?: CSSProperties["maxHeight"];
};
const currency = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function formatTableMoney(value: unknown) { if (value === null || value === undefined || value === "") return "—"; const number = Number(String(value)); return Number.isFinite(number) ? currency.format(number) : "—"; }
function readValue<T>(record: T, index: DataTableColumn<T>["dataIndex"]): unknown { if (index === undefined) return undefined; if (Array.isArray(index)) return index.reduce<unknown>((value, key) => value !== null && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, record); return record[index as keyof T]; }
function renderValue<T>(column: DataTableColumn<T>, value: unknown): ReactNode {
  if (column.type === "money") return formatTableMoney(value);
  if (column.type === "status") { const status = column.statusMap?.[String(value)]; return <TableStatusTag tone={status?.tone}>{status?.label || (value == null ? "—" : String(value))}</TableStatusTag>; }
  if (value === undefined || value === null || value === "") return "—";
  if (column.type === "number" || column.type === "percent") { const number = Number(String(value)); return Number.isFinite(number) ? column.type === "percent" ? new Intl.NumberFormat("zh-CN", { style: "percent", maximumFractionDigits: 2 }).format(number) : number.toLocaleString("zh-CN") : "—"; }
  return typeof value === "string" || typeof value === "number" ? value : String(value);
}
export function DataTable<T>(props: DataTableProps<T>): ReactNode;
export function DataTable(props: BaseProps): ReactNode;
export function DataTable<T>(props: DataTableProps<T> | BaseProps): ReactNode {
  if (!("columns" in props)) { const { children, className, mobileHint = "表格可左右滑动查看完整内容。", ...rest } = props; return <><p className={styles.hint}>{mobileHint}</p><div data-table-surface className={styles.wrap}><table className={[styles.table, className].filter(Boolean).join(" ")} {...rest}>{children}</table></div></>; }
  const { columns, dataSource, rowKey, loading = false, skeletonRows = 5, empty, fitContainer = false, maxHeight = "65dvh", mobileHint = "表格可左右滑动查看完整内容。", className, children: _children, ...rest } = props;
  const ordered = [...columns.filter(column => column.fixed === "left"), ...columns.filter(column => !column.fixed), ...columns.filter(column => column.fixed === "right")];
  const widthOf = (column: DataTableColumn<T>) => column.width ?? 160;
  function style(column: DataTableColumn<T>, index: number): CSSProperties { return { width: fitContainer ? column.width : widthOf(column), textAlign: column.align ?? (["money", "number", "percent"].includes(column.type || "") ? "right" : ["date", "month", "status"].includes(column.type || "") ? "center" : "left"), ...(column.fixed ? { position: "sticky", [column.fixed]: ordered.filter((entry, other) => entry.fixed === column.fixed && (column.fixed === "left" ? other < index : other > index)).reduce((sum, entry) => sum + widthOf(entry), 0) } : {}) }; }
  return <><p className={styles.hint}>{mobileHint}</p><TableScrollSurface data-table-surface className={`${styles.wrap} ${styles.configured}`} style={{ maxHeight }} role="region" aria-label="数据表格" tabIndex={0} aria-busy={loading}><table className={[styles.table, styles.schemaTable, className].filter(Boolean).join(" ")} style={{ minWidth: fitContainer ? ordered.reduce((sum, column) => sum + (column.width ?? column.minWidth ?? 0), 0) : ordered.reduce((sum, column) => sum + widthOf(column), 0), width: "100%" }} {...rest}><colgroup>{ordered.map(column => <col key={column.key} style={{ width: fitContainer ? column.width : widthOf(column) }}/>)}</colgroup><TableHeader><tr>{ordered.map((column, index) => <th key={column.key} scope="col" data-fixed={column.fixed} className={column.fixed ? styles.fixed : undefined} style={style(column, index)}>{column.title}</th>)}</tr></TableHeader><TableBody>{loading ? Array.from({ length: skeletonRows }, (_, row) => <tr key={row} aria-hidden="true">{ordered.map((column, index) => <td key={column.key} data-fixed={column.fixed} className={column.fixed ? styles.fixed : undefined} style={style(column, index)}><span className={styles.skeleton}/></td>)}</tr>) : dataSource.map((record, row) => <tr key={typeof rowKey === "function" ? rowKey(record) : record[rowKey] as Key}>{ordered.map((column, index) => <td key={column.key} data-fixed={column.fixed} className={column.fixed ? styles.fixed : undefined} style={style(column, index)}>{column.render ? column.render(readValue(record, column.dataIndex), record, row) : renderValue(column, readValue(record, column.dataIndex))}</td>)}</tr>)}</TableBody></table>{loading && <span className={styles.srOnly} role="status">正在加载数据</span>}{!loading && !dataSource.length && <TableEmptyState {...empty} />}</TableScrollSurface></>;
}
