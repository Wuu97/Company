"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./app-pagination.module.css";
export type AppPaginationProps = {
  total: number; currentPage: number; pageSize?: number; pageSizeOptions?: number[];
  onPageChange?: (page: number) => void; onPageSizeChange?: (size: number) => void;
  baseHref?: string; label?: string;
};
export function paginationHref(baseHref: string, page: number, pageSize: number) {
  const target = new URL(baseHref, "http://pagination.local");
  target.searchParams.set("page", String(page));
  target.searchParams.set("pageSize", String(pageSize));
  return target.pathname + "?" + target.searchParams;
}
export function AppPagination({total, currentPage, pageSize=10, pageSizeOptions=[10,20,50,100], onPageChange, onPageSizeChange, baseHref, label="分页"}: AppPaginationProps) {
  const router=useRouter();
  const size=Math.max(1,Math.floor(pageSize));
  const pages=Math.max(1,Math.ceil(Math.max(0,total)/size));
  const page=Math.max(1,Math.min(pages,currentPage));
  const [jump,setJump]=useState(String(page));
  const [previous,setPrevious]=useState(page);
  if(previous!==page){setPrevious(page);setJump(String(page));}
  const navigate=(next:number,nextSize=size)=>{
    router.replace(paginationHref(baseHref || window.location.href,next,nextSize),{scroll:false});
  };
  const change=(next:number)=>{const value=Math.max(1,Math.min(pages,Math.floor(next)));if(!Number.isFinite(value))return;setJump(String(value));if(onPageChange)onPageChange(value);else navigate(value);};
  if (total <= size) return null;
  return <nav data-app-pagination className={styles.pagination} aria-label={label}>
    <div className={styles.stats}><span>共 {total} 条数据</span><select aria-label="每页条数" value={size} onChange={event=>{const next=Number(event.target.value);setJump("1");if(onPageSizeChange){onPageSizeChange(next);onPageChange?.(1);}else navigate(1,next);}}>{[...new Set([...pageSizeOptions,size])].sort((a,b)=>a-b).map(n=><option key={n} value={n}>{n} 条/页</option>)}</select></div>
    <div className={styles.controls}><button type="button" disabled={page<=1} onClick={()=>change(page-1)}>上一页</button><span>第 {page} / {pages} 页</span><button type="button" disabled={page>=pages} onClick={()=>change(page+1)}>下一页</button><form onSubmit={event=>{event.preventDefault();change(Number(jump));}}><label>跳至 <input aria-label="跳转页码" type="number" min={1} max={pages} step={1} required value={jump} onChange={event=>setJump(event.target.value)} /> 页</label><button type="submit" hidden>跳转</button></form></div>
  </nav>;
}
