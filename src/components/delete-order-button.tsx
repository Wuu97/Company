"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
export function DeleteOrderButton({orderId}:{orderId:string}){const [busy,setBusy]=useState(false);const [error,setError]=useState("");const router=useRouter();async function remove(){if(!window.confirm("确定删除这个 SO 吗？删除后不可恢复。"))return;setBusy(true);setError("");const r=await fetch(`/api/orders/${orderId}`,{method:"DELETE"});if(r.ok){router.refresh();return}const d=await r.json().catch(()=>({}));setError(d.error||"删除失败");setBusy(false)}return <span><button type="button" className="danger-button small-button" onClick={remove} disabled={busy}>{busy?"删除中…":"删除"}</button>{error&&<span className="delete-error">{error}</span>}</span>}
