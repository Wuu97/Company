"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
export function EtbManualControl({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [message, setMessage] = useState("");
  const points = useRef<Array<{ x: number; y: number }>>([]);
  useEffect(() => {
    if (!open) return;
    let stopped = false; let url = "";
    async function refresh() {
      try {
        const response = await fetch("/api/admin/etb-manual/" + id, { cache: "no-store" });
        if (!response.ok) { if (!stopped) setMessage(response.status === 409 ? "验证已结束，请关闭窗口查看结果。" : "暂时无法获取画面，请稍后重试。"); return; }
        const blob = await response.blob();
        if (stopped) return;
        URL.revokeObjectURL(url); url = URL.createObjectURL(blob); setSrc(url); setMessage("");
      } catch { if (!stopped) setMessage("连接中断，请稍后重试。"); }
    }
    void refresh(); const timer = setInterval(refresh, 1500);
    return () => { stopped = true; clearInterval(timer); URL.revokeObjectURL(url); };
  }, [id, open]);
  function point(event: React.PointerEvent<HTMLImageElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1200, (event.clientX - rect.left) / rect.width * 1200)), y: Math.max(0, Math.min(800, (event.clientY - rect.top) / rect.height * 800)) };
  }
  return <><Button variant="text" size="small" onClick={() => setOpen(true)}>去完成验证</Button>{open && <Dialog variant="manual" title="人工验证" onClose={() => setOpen(false)} actions={<Button size="toolbar" variant="outline" onClick={() => setOpen(false)}>关闭</Button>}>
    <p>请在下方画面中点击或拖动完成验证码，成功后系统自动保存登录会话。</p>
    {src && <img src={src} alt="云端浏览器实时画面，可点击或拖动完成人工验证" draggable={false} style={{ width: "100%", touchAction: "none", cursor: "crosshair" }} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); points.current = [point(event)]; }} onPointerMove={event => { if (event.buttons && points.current.length < 59) points.current.push(point(event)); }} onPointerCancel={() => { points.current = []; }} onPointerUp={async event => {
      if (!points.current.length) return;
      const path = [...points.current, point(event)]; points.current = [];
      try { const response = await fetch("/api/admin/etb-manual/" + id, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ points: path }) }); if (!response.ok) setMessage("操作未完成，请刷新画面后重试。"); }
      catch { setMessage("连接中断，请重试。"); }
    }} />}
    {message && <p role="status">{message}</p>}
  </Dialog>}</>;
}
