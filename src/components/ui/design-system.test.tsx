import React from "react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, ButtonLink } from "./button";
import { FileUploadTrigger } from "./file-upload-trigger";
import { UserCreateForm, CredentialForm } from "../admin-settings-forms";
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());
describe("dialog form ownership", () => {
  it.each([
    ["新增成员", <UserCreateForm onCancel={() => {}} />],
    ["平台凭证", <CredentialForm terminal="盐田" onCancel={() => {}} />],
  ])(
    "keeps %s submit controls outside the form and natively associated",
    (_, element) => {
      const html = renderToStaticMarkup(element);
      const form = html.match(/<form id="([^"]+)"[\s\S]*?<\/form>/)?.[0];
      expect(form).toBeDefined();
      expect(form).not.toContain('type="submit"');
      const id = form!.match(/id="([^"]+)"/)![1];
      expect(html.slice(html.indexOf("</form>") + 7)).toContain(`form="${id}"`);
      expect(form).toContain("required");
    },
  );
  it("gives concurrently rendered forms distinct IDs", () => {
    const html = renderToStaticMarkup(
      <>
        <CredentialForm terminal="盐田" onCancel={() => {}} />
        <CredentialForm terminal="蛇口" onCancel={() => {}} />
      </>,
    );
    const ids = [...html.matchAll(/<form id="([^"]+)"/g)].map((x) => x[1]);
    expect(new Set(ids).size).toBe(2);
  });
});
describe("shared button semantics", () => {
  it("retains disabled, native submit ownership, and accessible icon labels", () => {
    const html = renderToStaticMarkup(
      <Button
        size="toolbar"
        variant="outline"
        type="submit"
        form="test-form"
        disabled
        iconOnly
        aria-label="保存"
      >
        保存
      </Button>,
    );
    expect(html).toContain('type="submit"');
    expect(html).toContain('form="test-form"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-label="保存"');
  });
  it("supports compact links and upload triggers without leaking styling props", () => {
    const html = renderToStaticMarkup(
      <>
        <ButtonLink size="compact" variant="text" href="/orders">
          查看
        </ButtonLink>
        <FileUploadTrigger size="compact" disabled>
          上传
        </FileUploadTrigger>
      </>,
    );
    expect(html).toContain('href="/orders"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain('size="compact"');
    expect(html).not.toContain('variant="text"');
  });
});

describe("button CSS architecture", () => {
  it("keeps size and visual variant declarations independent", async () => {
    const { readFileSync } = await import("node:fs");
    const { default: postcss } = await import("postcss");
    const css = postcss.parse(
      readFileSync("src/components/action-button.module.css", "utf8"),
    );
    const sizeProperties = new Set([
      "min-height",
      "height",
      "width",
      "padding",
      "font-size",
      "line-height",
      "gap",
    ]);
    const visualProperties = new Set([
      "color",
      "background",
      "border",
      "border-color",
      "box-shadow",
      "text-decoration",
    ]);
    css.walkRules((rule) => {
      if (
        [".default", ".toolbar", ".small", ".compact"].includes(rule.selector)
      ) {
        rule.walkDecls((declaration) =>
          expect(
            sizeProperties.has(declaration.prop),
            `${rule.selector}: ${declaration.prop}`,
          ).toBe(true),
        );
      }
      if (
        /^\.(primary|secondary|outline|danger|neutral|text)(:|$)/.test(
          rule.selector,
        )
      ) {
        rule.walkDecls((declaration) =>
          expect(
            visualProperties.has(declaration.prop),
            `${rule.selector}: ${declaration.prop}`,
          ).toBe(true),
        );
      }
    });
    css.walkDecls((declaration) => expect(declaration.important).toBeFalsy());
    expect(css.toString()).not.toContain(":has(");
  });
});

describe("pagination button migration", () => {
  it("keeps boundary controls disabled with the configured page size", async () => {
    const { Pagination } = await import("./pagination");
    const html = renderToStaticMarkup(
      <Pagination
        currentPage={1}
        totalPages={3}
        pageSize={40}
        total={120}
        href={(page) => `/orders?q=SO123&status=OPEN&page=${page}`}
        label="订单分页"
      />,
    );
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>上一页<\/button>/);
    expect(html).toContain('第 1 / 3 页');
    expect(html).toContain('共 120 条数据');
    expect(html).toContain('max="3"');
  });
});

describe("standard business controls", () => {
  it("preserves log disclosure accessibility", async () => {
    const { AuditExpandedRow } = await import("../audit-expanded-row");
    const html = renderToStaticMarkup(
      <AuditExpandedRow detail={<p>变化</p>}>
        <span>记录</span>
      </AuditExpandedRow>,
    );
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("查看");
    expect(html).not.toContain("expandButton");
  });
  it("renders the shared left prefix search input", async () => {
    const { FilterTextField } = await import("./list");
    const html = renderToStaticMarkup(
      <FilterTextField name="q" defaultValue="SO123" />,
    );
    expect(html).toContain('name="q"');
    expect(html).toContain('type="search"');
    expect(html).toContain('width="16"');
    expect(html.indexOf("<svg")).toBeLessThan(html.indexOf("<input"));
    expect(html).not.toContain("searchButton");
  });
});
