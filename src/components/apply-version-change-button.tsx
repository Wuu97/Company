"use client";
import {useRouter} from "next/navigation";
import {useState} from "react";
import { ConfirmationPanel } from "@/components/ui/confirmation-panel";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { Button } from "@/components/ui/button";
export function ApplyVersionChangeButton({url}:{url:string}){const router=useRouter();const [busy,setBusy]=useState(false);const [confirming,setConfirming]=useState(false);const [message,setMessage]=useState("");async function apply(){if(busy)return;setBusy(true);setMessage("");try{const r=await fetch(url,{method:"POST"});if(r.ok){setConfirming(false);setMessage("版本变化已应用");router.refresh();}else setMessage((await r.json()).error||"应用失败");}catch{setMessage("网络异常，请稍后重试");}finally{setBusy(false)}}return <><Button disabled={busy} onClick={()=>setConfirming(true)}>{busy?"应用中…":"确认应用变化"}</Button>{confirming&&<ConfirmationPanel title="确认应用本次版本变化？" actions={<><Button size="small" wide="mobile" disabled={busy} onClick={apply}>{busy?"应用中…":"确认应用"}</Button><Button variant="neutral" size="small" wide="mobile" disabled={busy} onClick={()=>setConfirming(false)}>返回检查</Button></>}><p>会更新已核对的业务字段；柜型和柜量不会被自动修改。</p></ConfirmationPanel>}{message&&<FeedbackMessage tone={message.includes("已应用")?"success":"error"} as="small">{message}</FeedbackMessage>}</>}
