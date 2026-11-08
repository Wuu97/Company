import { TablePlaceholder } from "@/components/ui/table-placeholder";
import { partnerStatementHeaders, partnerMoneyColumns, partnerStatementCell } from "@/lib/settlement/partner-statement";
import { driverMoneyColumns, driverStatementCell, driverStatementHeaders } from "@/lib/settlement/driver-statement";
import { yuan } from "@/lib/settlement/bill-statement";
import type { ReactNode } from "react";

export function DriverStatementTable({ items, allItems = items, offset = 0, className, heading, actions, partner = false }: { items: any[]; allItems?: any[]; offset?: number; className?: string; heading?: ReactNode; partner?: boolean; actions?: (line: any) => ReactNode }) {
  const headers = partner ? partnerStatementHeaders : driverStatementHeaders;
  const moneyColumns = partner ? partnerMoneyColumns : driverMoneyColumns;
  const valueCell = partner ? partnerStatementCell : driverStatementCell;
  const widths = partner ? [45, 95, 160, 65, 125, 70, 95, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 95] : [45, 90, 95, 120, 140, 130, 65, 120, 70, 90, 75, 75, 75, 75, 90, 75, 85, 75, 75];
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  const format = (value: string | number | bigint) => typeof value === "bigint" ? yuan(value).toFixed(2) : value;
  const displayCell = (value: string | number | bigint, label: string) =>
    value === "—" && actions ? <TablePlaceholder heading={label} /> : format(value);

  return <table className={className}>
    <colgroup>{widths.map((width, index) => <col key={index} style={{ width: `${width / totalWidth * 100}%` }} />)}</colgroup>
    <thead>{heading}<tr>{headers.map(label => <th key={label} scope="col" style={{ textAlign: moneyColumns.has(label) ? "right" : "left" }}>{label}</th>)}</tr></thead>
    <tbody>{items.map((line, index) => <tr key={line.id}>{headers.map(label => <td key={label} style={{ textAlign: moneyColumns.has(label) ? "right" : "left" }}>{displayCell(valueCell(line, label, offset + index), label)}{label === (partner ? "小计" : "其它") && actions?.(line)}</td>)}</tr>)}</tbody>
    <tfoot><tr>{headers.map((label, index) => {
      const values = allItems.map(line => valueCell(line, label, 0)).filter((value): value is bigint => typeof value === "bigint");
      return <td key={label} style={{ textAlign: moneyColumns.has(label) ? "right" : "left" }}>{index === 0 ? "合计" : moneyColumns.has(label) ? values.length ? format(values.reduce((sum, value) => sum + value, 0n)) : displayCell("—", label) : ""}</td>;
    })}</tr></tfoot>
  </table>;
}
