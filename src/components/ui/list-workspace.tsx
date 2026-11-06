import type { ReactNode } from "react";
import { PageContainer } from "./page-container";
/** @deprecated Use PageContainer with explicit filter/actions/pagination slots. */
export function ListWorkspace({ children, filters, toolbar }: { children: ReactNode; filters?: ReactNode; toolbar?: ReactNode }) {
  return <PageContainer filter={filters} actions={toolbar}>{children}</PageContainer>;
}
