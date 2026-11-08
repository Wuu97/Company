import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import Orders from "./page";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { customer: { findMany: async () => [] }, soOrder: { findMany } },
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/orders",
  useRouter: () => ({}),
}));

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("SO orders table", () => {
  it("keeps all eight column headers and the upload action when there are no matches", async () => {
    findMany.mockResolvedValueOnce([]);
    const html = renderToStaticMarkup(await Orders({ searchParams: Promise.resolve({ q: "missing" }) }));
    expect(html.match(/scope="col"/g)).toHaveLength(8);
    expect(html).toMatch(/<tbody><tr><td colSpan="8">/i);
    expect(html).toContain("未找到符合条件的订单");
    expect(html.match(/导入 SO 单据/g)).toHaveLength(2);
  });

  it("filters cutoffs before slicing the table into pages", async () => {
    findMany.mockResolvedValueOnce([
      ...Array.from({ length: 10 }, () => ({ portCutoffText: "2099-01-01", files: [] })),
      { id: "closed", soNumber: "SO-CLOSED", portCutoffText: "2000-01-01", status: "CONFIRMED", parseStatus: "VERIFIED", files: [], containers: [] },
    ]);
    const html = renderToStaticMarkup(await Orders({ searchParams: Promise.resolve({ cutoff: "CLOSED" }) }));
    expect(html).toContain("SO-CLOSED");
    expect(html).not.toContain("未找到符合条件的订单");
  });
});
