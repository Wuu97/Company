import React from "react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CalendarGrid, moveCalendarDate } from "./calendar-grid";
vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());
describe("calendar navigation", () => {
  it.each([
    ["2026-12-31", "ArrowRight", "2027-01-01"],
    ["2026-03-01", "ArrowLeft", "2026-02-28"],
    ["2024-03-01", "ArrowLeft", "2024-02-29"],
    ["2026-11-05", "ArrowUp", "2026-10-29"],
    ["2026-11-05", "ArrowDown", "2026-11-12"],
    ["2026-11-05", "Home", "2026-11-01"],
    ["2026-11-05", "End", "2026-11-07"],
  ])("moves %s with %s", (date, key, result) =>
    expect(moveCalendarDate(date, key)).toBe(result),
  );
  it("leaves selection and unrelated keys to native button behavior", () =>
    expect(moveCalendarDate("2026-11-05", "Enter")).toBeNull());
  it("renders one roving date and exposes the selected date and year controls", () => {
    const html = renderToStaticMarkup(
      <CalendarGrid
        value="2026-11-05"
        month={new Date(2026, 10, 1)}
        onMonthChange={() => {}}
        onSelect={() => {}}
      />,
    );
    expect(html.match(/tabindex="0"/g)).toHaveLength(1);
    expect(html.match(/role="gridcell"/g)).toHaveLength(42);
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-label="上一年"');
    expect(html).toContain('aria-label="下一年"');
  });
});
