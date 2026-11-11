import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { pdfResourceOptions, pdfTextQualityIssues } from "./pdf-resources";
import { readSoPdfLayout, type SoPdfRow } from "./so-pdf-layout";
import { recognizeSoDocument } from "./so-recognition";

const maxPages = 20;
const pageLimitMessage = "SO 超过 20 页，请拆分后上传";

export async function renderIndependentSoPages(path: string) {
  const directory = await mkdtemp(join(tmpdir(), "so-pdf-fallback-"));
  try {
    const cache = join(directory, "cache");
    await mkdir(cache);
    const stderr = await new Promise<string>((resolve, reject) => execFile(process.env.PDFTOPPM_BIN || "pdftoppm", [
      "-f", "1", "-l", String(maxPages + 1), "-scale-to", "1500", "-png", path, join(directory, "page"),
    ], { timeout: 45_000, maxBuffer: 1024 * 1024, env: { ...process.env, XDG_CACHE_HOME: cache } },
    (error, _stdout, diagnostics) => error ? reject(error) : resolve(diagnostics)));
    // Poppler can exit successfully while omitting text whose fonts/CMaps are unavailable.
    if (/missing language pack|fontconfig error|couldn't (?:find|create).*font|unknown character collection|failed to.*(?:font|cmap)/i.test(stderr)) {
      throw new Error("独立渲染器缺少字体或语言资源，生成的页面可能漏字");
    }
    const files = (await readdir(directory)).filter(file => /^page-\d+\.png$/.test(file))
      .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
    if (files.length > maxPages) throw new Error(pageLimitMessage);
    if (!files.length) throw new Error("独立 PDF 渲染器未生成页面");
    return Promise.all(files.map(async file => "data:image/png;base64," + (await readFile(join(directory, file))).toString("base64")));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/** Prepare both text and page images using the same installed CMap/font assets. */
export async function prepareSoPdf(path: string) {
  const started = performance.now();
  const data = await readFile(path);
  const resourceFailures: string[] = [];
  const preparationErrors: string[] = [];
  let text = "";
  let images: string[] = [];
  let rows: SoPdfRow[] = [];
  let totalPages: number | undefined;
  let needsIndependentRendering = false;
  try {
    const pdf = new PDFParse({ ...pdfResourceOptions(resourceFailures), data });
    try {
      try {
        const result = await pdf.getText();
        totalPages = result.total;
        if (totalPages > maxPages) throw new Error(pageLimitMessage);
        text = result.text;
      } catch (error) {
        if (error instanceof Error && error.message === pageLimitMessage) throw error;
        preparationErrors.push(error instanceof Error ? error.message : String(error));
        needsIndependentRendering = true;
      }
      try {
        const result = await pdf.getScreenshot({ desiredWidth: 1500, imageDataUrl: true, imageBuffer: false });
        totalPages ??= result.total;
        if (result.total > maxPages) throw new Error(pageLimitMessage);
        images = result.pages.map(page => page.dataUrl).filter(Boolean);
        if (images.length !== result.total) {
          preparationErrors.push("PDF 页面渲染数量不完整");
          needsIndependentRendering = true;
        }
      } catch (error) {
        if (error instanceof Error && error.message === pageLimitMessage) throw error;
        preparationErrors.push(error instanceof Error ? error.message : String(error));
        needsIndependentRendering = true;
      }
    } finally {
      await pdf.destroy();
    }
    try {
      rows = await readSoPdfLayout(data);
    } catch (error) {
      preparationErrors.push(error instanceof Error ? error.message : String(error));
      needsIndependentRendering = true;
    }
  } catch (error) {
    if (error instanceof Error && error.message === pageLimitMessage) throw error;
    preparationErrors.push(error instanceof Error ? error.message : String(error));
    needsIndependentRendering = true;
  }
  preparationErrors.push(...resourceFailures, ...pdfTextQualityIssues(text));
  needsIndependentRendering ||= resourceFailures.length > 0 || pdfTextQualityIssues(text).length > 0 || !images.length;
  if (totalPages !== undefined && new Set(rows.map(row => row.page)).size > totalPages) {
    preparationErrors.push("PDF 文字坐标页数不一致");
    needsIndependentRendering = true;
  }

  let renderer = "pdfjs" as "pdfjs" | "poppler";
  if (needsIndependentRendering) {
    try {
      images = await renderIndependentSoPages(path);
      if (totalPages !== undefined && images.length !== totalPages) throw new Error("独立渲染页数与原单不一致");
      // Do not pair partially decoded text with an independently rendered page.
      text = "";
      rows = [];
      renderer = "poppler";
    } catch (error) {
      if (error instanceof Error && error.message === pageLimitMessage) throw error;
      throw new Error("PDF 字体、文字或页面读取异常，独立渲染也未成功，请提供完整显示的 PDF。"
        + (error instanceof Error ? `（${error.message.slice(0, 300)}）` : ""));
    }
  }
  return {
    text, rows, images, preparationErrors,
    pdfPreparation: {
      renderer, pageCount: images.length,
      textCharacters: text.length, chineseCharacters: (text.match(/\p{Script=Han}/gu) ?? []).length,
      resourceFailures, seconds: (performance.now() - started) / 1000,
    },
  };
}

/** Shared entry point for uploads, explicit reparse, and read-only recognition checks. */
export async function recognizeSoFile(path: string) {
  const start = performance.now();
  const prepared = await prepareSoPdf(path);
  const result = await recognizeSoDocument(prepared);
  return { ...result, extraction: { ...result.extraction, pdfPreparation: prepared.pdfPreparation, totalSeconds: (performance.now() - start) / 1000 } };
}
