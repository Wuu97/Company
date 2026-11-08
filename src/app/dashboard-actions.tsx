"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, RefreshCw } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardActions() {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="toolbar" onClick={() => setGuideOpen(true)}>
        <BookOpen size={14} aria-hidden="true" />
        操作指南
      </Button>
      <Button
        size="toolbar"
        variant="outline"
        disabled={refreshing}
        onClick={() => startTransition(() => router.refresh())}
      >
        <RefreshCw
          size={14}
          className={refreshing ? "animate-spin" : ""}
          aria-hidden="true"
        />
        {refreshing ? "刷新中…" : "刷新"}
      </Button>
      {guideOpen && (
        <Dialog
          title="调度工作台操作指南"
          onClose={() => setGuideOpen(false)}
          actions={
            <Button variant="secondary" onClick={() => setGuideOpen(false)}>
              关闭
            </Button>
          }
        >
          <ol className="m-0 space-y-2 pl-5 text-sm text-slate-700">
            <li>
              在 <Link href="/orders">SO 订单</Link> 页面上传并识别 SO 单据。
            </li>
            <li>点击流转标签筛选待办，选择「查看」进入订单详情处理。</li>
            <li>点击右侧风险计数筛选相关订单，处理后点击「刷新」同步数据。</li>
          </ol>
        </Dialog>
      )}
    </div>
  );
}
