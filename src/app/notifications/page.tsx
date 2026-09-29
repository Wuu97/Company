import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatChinaDateTime } from "@/lib/time";
import { NotificationReadButton } from "@/components/notification-read-button";

export default async function Notifications() {
  const user = await currentUser(); if (!user) redirect("/login");
  const notifications = await prisma.appNotification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return <><h2>通知中心</h2><p>未读通知会保留在这里，直到你手动标记已读。</p><table><thead><tr><th>状态</th><th>通知</th><th>时间</th><th>操作</th></tr></thead><tbody>{notifications.length ? notifications.map(item => <tr key={item.id}><td>{item.readAt ? "已读" : <span className="tag">未读</span>}</td><td>{item.href ? <a href={item.href}><b>{item.title}</b><br/>{item.body}</a> : <><b>{item.title}</b><br/>{item.body}</>}</td><td>{formatChinaDateTime(item.createdAt)}</td><td>{item.readAt ? "—" : <NotificationReadButton id={item.id}/>}</td></tr>) : <tr><td colSpan={4}>暂无通知。</td></tr>}</tbody></table></>;
}
