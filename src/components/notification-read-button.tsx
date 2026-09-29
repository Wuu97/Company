"use client";
import { useState } from "react";
export function NotificationReadButton({ id }: { id: string }) { const [message, setMessage] = useState(""); async function read() { const response = await fetch(`/api/notifications/${id}/read`, { method: "POST" }); if (response.ok) location.reload(); else setMessage("处理失败"); } return <><button className="small-button" type="button" onClick={read}>标记已读</button>{message && <small className="error">{message}</small>}</>; }
