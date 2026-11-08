import { prisma } from "@/lib/prisma";
import { formatChinaDateTime } from "@/lib/time";
import { NotificationReadButton } from "@/components/notification-read-button";
import { StatusBadge } from "@/components/ui/status-badge";

export async function DashboardNotifications({ userId }: { userId: string }) {
  const [notifications, unread] = await Promise.all([
    prisma.appNotification.findMany({
      where: { userId },
      orderBy: [
        { readAt: { sort: "asc", nulls: "first" } },
        { createdAt: "desc" },
        { id: "desc" },
      ],
      take: 100,
    }),
    prisma.appNotification.count({ where: { userId, readAt: null } }),
  ]);

  return (
    <section
      id="notifications"
      className="border-t border-slate-200/80 p-4"
      aria-labelledby="notifications-title"
    >
      <header className="flex items-center justify-between gap-2">
        <h2
          id="notifications-title"
          className="m-0 text-sm font-semibold text-slate-800"
        >
          通知中心
        </h2>
        <StatusBadge tone={unread ? "unread" : "muted"}>
          {unread} 条未读
        </StatusBadge>
      </header>
      {notifications.length ? (
        <ul className="m-0 mt-2 list-none divide-y divide-slate-100 p-0">
          {notifications.map((item) => (
            <li key={item.id} className="min-w-0 py-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
                <StatusBadge tone={item.readAt ? "muted" : "unread"}>
                  {item.readAt ? "已读" : "未读"}
                </StatusBadge>
                <time
                  className="font-mono text-xs text-slate-400"
                  dateTime={item.createdAt.toISOString()}
                >
                  {formatChinaDateTime(item.createdAt)}
                </time>
              </div>
              <p className="m-0 text-sm font-semibold text-slate-700 [overflow-wrap:anywhere]">
                {item.title}
              </p>
              <p className="mb-0 mt-1 whitespace-pre-wrap text-xs text-slate-500 [overflow-wrap:anywhere]">
                {item.body}
              </p>
              {(item.href || !item.readAt) && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {item.href && (
                    <a
                      href={item.href}
                      className="text-xs text-blue-700 no-underline hover:underline"
                    >
                      查看相关业务 →
                    </a>
                  )}
                  {!item.readAt && <NotificationReadButton id={item.id} />}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-0 mt-3 text-xs text-slate-400">暂无新消息</p>
      )}
    </section>
  );
}
