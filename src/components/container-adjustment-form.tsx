"use client";

import { useState } from "react";

type Draft = { containerType: string; quantity: number };

export function ContainerAdjustmentForm({ orderId, initialContainers }: { orderId: string; initialContainers: Draft[] }) {
  const [containers, setContainers] = useState(initialContainers);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/orders/${orderId}/containers/adjust`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: form.get("reason"), containers: containers.filter(item => item.containerType.trim()) }),
    });
    setMessage(response.ok ? "柜量已调整，请刷新页面。" : (await response.json()).error);
  }

  return <section><h3>柜量调整</h3><p className="muted">仅在没有生效装柜计划时可直接调整；已计划柜子需先调整或取消计划。</p><form onSubmit={submit}>{containers.map((item, index) => <div className="inline-form" key={index}><input value={item.containerType} onChange={event => setContainers(containers.map((value, position) => position === index ? { ...value, containerType: event.target.value } : value))}/><input type="number" min="0" value={item.quantity} onChange={event => setContainers(containers.map((value, position) => position === index ? { ...value, quantity: Number(event.target.value) } : value))}/></div>)}<button type="button" onClick={() => setContainers([...containers, { containerType: "", quantity: 1 }])}>增加柜型</button><input name="reason" placeholder="调整原因" required/><button>保存柜量调整</button></form><p>{message}</p></section>;
}
