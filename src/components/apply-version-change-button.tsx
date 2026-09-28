"use client";
import {useRouter} from "next/navigation";
export function ApplyVersionChangeButton({url}:{url:string}){const router=useRouter();return <button type="button" onClick={async()=>{if(!window.confirm("确认应用该版本的非柜型字段变化吗？"))return;const r=await fetch(url,{method:"POST"});if(r.ok)router.refresh();else alert((await r.json()).error||"应用失败")}}>确认应用变化</button>}
