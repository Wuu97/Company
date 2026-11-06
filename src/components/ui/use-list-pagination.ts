"use client";
import { useState } from "react";
export function useListPagination<T>(items: T[], filterKey = "") {
  const [state,setState]=useState({page:1,size:10,key:filterKey});
  const current=state.key===filterKey?state:{...state,page:1,key:filterKey};
  if(state.key!==filterKey)setState(current);
  const page=Math.min(current.page,Math.max(1,Math.ceil(items.length/current.size)));
  return {items:items.slice((page-1)*current.size,page*current.size), props:{total:items.length,currentPage:page,pageSize:current.size,onPageChange:(page:number)=>setState(s=>({...s,page})),onPageSizeChange:(size:number)=>setState(s=>({...s,size,page:1}))}};
}
