import styles from "./list.module.css";
import { PageSizeSelect } from "./page-size-select";

type PaginationProps = { currentPage: number; totalPages: number; total: number; pageSize?: number; href: (page: number) => string; label: string };

/** Kept server-side because list pages construct their page URLs on the server. */
export function Pagination({ currentPage, totalPages, total, pageSize, href, label }: PaginationProps) {
  const target = new URL(href(currentPage), "http://pagination.local");
  const filters = Array.from(target.searchParams.entries()).filter(([key]) => key !== "page");
  return <nav className={styles.pagination} aria-label={label}>
    <div className={styles.paginationStats}><span>共 {total} 条数据</span>{pageSize !== undefined && <PageSizeSelect value={pageSize} href={href(currentPage)} />}</div>
    <div className={styles.paginationControls}>
    {currentPage > 1 ? <a href={href(currentPage - 1)}>上一页</a> : <button type="button" disabled>上一页</button>}
    <span>第 {currentPage} / {totalPages} 页</span>
    {currentPage < totalPages ? <a href={href(currentPage + 1)}>下一页</a> : <button type="button" disabled>下一页</button>}
    <form className={styles.pageJump} action={target.pathname} method="get">
      {filters.map(([key, value], index) => <input key={`${key}-${index}`} type="hidden" name={key} value={value} />)}
      <label>跳至 <input aria-label={`${label}跳转页码`} type="number" name="page" min={1} max={totalPages} step={1} required defaultValue={currentPage} /> 页</label>
      <button type="submit" hidden>跳转</button>
    </form>
    </div>
  </nav>;
}
