"use client";
import {useState} from "react";
import {ParsePendingButton} from "@/components/parse-pending-button";
export function SoUploadForm(){const [msg,setMsg]=useState("");async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const r=await fetch("/api/orders/upload",{method:"POST",body:new FormData(e.currentTarget)});const d=await r.json();setMsg(r.ok?`已上传 SO：${d.id}。点击“运行待解析 SO”后自动填充。 `:d.error)}return <section><h3>上传 SO PDF</h3><div className="upload-actions"><form onSubmit={submit}><input name="file" type="file" accept="application/pdf" required/> <button>上传 SO</button></form><ParsePendingButton/></div><p>{msg}</p></section>}
