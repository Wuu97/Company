"use client";
import {useState} from "react";
export function ParsePendingButton(){const [msg,setMsg]=useState("");async function run(){setMsg("解析中…");const r=await fetch("/api/orders/parse",{method:"POST"});const d=await r.json();setMsg(r.ok?"待解析 SO 已处理，请刷新列表。":d.error)}return <button onClick={run}>运行待解析 SO</button>}
