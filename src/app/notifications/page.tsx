import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatChinaDateTime } from "@/lib/time";
import { NotificationReadButton } from "@/components/notification-read-button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./page.module.css";

export default async function Notifications() {
  const user = await currentUser(); if (!user) redirect("/login");
  const notifications = await prisma.appNotification.findMany({ where: { userId: user.id }, orderBy: [{ readAt: "asc" }, { createdAt: "desc" }], take: 100 });
  const unreadCount = notifications.filter(item => !item.readAt).length;
  return <>
    <PageHeader title="通知中心" description="未读消息排在前面。处理完成后，可将它标记为已读。" />
    {notifications.length ? <>
      <p className={styles.summary}>有 <b>{unreadCount}</b> 条未读消息。</p>
      <div className={styles.list}>
        {notifications.map(item => <article className={`${styles.item}${item.readAt ? "" : ` ${styles.unread}`}`} key={item.id}>
          <div className={styles.meta}><StatusBadge tone={item.readAt ? "muted" : "unread"}>{item.readAt ? "已读" : "未读"}</StatusBadge><time>{formatChinaDateTime(item.createdAt)}</time></div>
          <div className={styles.content}>{item.href ? <a href={item.href}><b>{item.title}</b><p>{item.body}</p><span>查看相关业务 →</span></a> : <><b>{item.title}</b><p>{item.body}</p></>}</div>
          {!item.readAt && <div className={styles.action}><NotificationReadButton id={item.id} /></div>}
        </article>)}
      </div>
    </> : <EmptyState title="暂无新消息">业务提醒和处理结果会显示在这里。</EmptyState>}
  </>;
}
