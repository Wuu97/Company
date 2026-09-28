"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
export function CancelActionButton({url,label}:{url:string;label:string}){const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const router=useRouter();async function cancel(){if(!window.confirm(`确定${label}吗？该操作会保留历史记录。`))return;setBusy(true);const response=await fetch(url,{method:"POST"});if(response.ok){router.refresh();return}const data=await response.json();setMessage(data.error||"操作失败");setBusy(false)}return <span><button type="button" className="danger-button small-button" onClick={cancel} disabled={busy}>{busy?"处理中…":label}</button>{message&&<small className="delete-error">{message}</small>}</span>}
