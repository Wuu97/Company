"use client";
import { useState } from "react";

export function EtbHandoffButton({ runId }: { runId: string }) {
  const [message, setMessage] = useState("");
  async function handle() {
    const note = window.prompt("请记录已完成登录/机器人验证，或需继续人工处理的原因：");
    if (!note) return;
    const response = await fetch(`/api/etb-runs/${runId}/handoff`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ note }) });
    if (response.ok) location.reload();
    else setMessage((await response.json()).error || "保存失败");
  }
  return <><button type="button" className="small-button" onClick={handle}>记录人工接管</button>{message && <small className="error">{message}</small>}</>;
}
