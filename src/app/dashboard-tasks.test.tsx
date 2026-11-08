import React from "react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardTasks } from "./dashboard-tasks";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("dashboard workflow overview", () => {
  it("keeps the table headers and filter links visible with an empty queue", () => {
    const html = renderToStaticMarkup(
      <DashboardTasks rows={[]} counts={[0, 0, 0, 0]} />,
    );
    expect(html).toContain("暂无待处理调度任务");
    expect(html).toContain("SO 编号 / 提单号");
    expect(html.match(/href="\/\?step=/g)).toHaveLength(4);
  });

  it("shows the selected risk and links to the affected order", () => {
    const html = renderToStaticMarkup(
      <DashboardTasks
        activeLabel="派车超时"
        counts={[0, 0, 0, 1]}
        rows={[
          {
            id: "order-1",
            soNumber: "SO-1",
            vessel: "航次 A",
            cargo: "40HC × 1",
            containers: "BOX-1",
            blockers: ["派车超时"],
          },
        ]}
      />,
    );
    expect(html).toContain('href="/orders/order-1"');
    expect(html).toContain("清除筛选");
    expect(html).toContain("派车超时");
  });
});
