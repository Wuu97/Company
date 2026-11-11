import { accessSync, constants } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, dirname, join, sep } from "node:path";

/** Resolve assets from the installed package, independent of the caller's location. */
export function pdfResourceOptions(failures: string[] = []) {
  const require = createRequire(join(process.cwd(), "package.json"));
  const root = dirname(require.resolve("pdfjs-dist/package.json"));
  const cMapUrl = join(root, "cmaps") + sep;
  const standardFontDataUrl = join(root, "standard_fonts") + sep;
  accessSync(cMapUrl, constants.R_OK);
  accessSync(standardFontDataUrl, constants.R_OK);

  const load = async (directory: string, name: string) => {
    try {
      if (!name || basename(name) !== name) throw new Error("无效的 PDF 资源名称");
      return new Uint8Array(await readFile(join(directory, name)));
    } catch (error) {
      failures.push(`PDF 资源 ${name} 加载失败`);
      throw error;
    }
  };
  // PDF.js can swallow resource errors and keep rendering partial pages.
  // Keep those failures on this document instead of relying on global logging.
  class CMapReaderFactory {
    async fetch({ name }: { name: string }) {
      return { cMapData: await load(cMapUrl, name + ".bcmap"), isCompressed: true };
    }
  }
  class StandardFontDataFactory {
    async fetch({ filename }: { filename: string }) {
      return load(standardFontDataUrl, filename);
    }
  }
  return {
    cMapUrl, cMapPacked: true, standardFontDataUrl,
    wasmUrl: join(root, "wasm") + sep,
    useWorkerFetch: false,
    CMapReaderFactory, StandardFontDataFactory,
  };
}

export function pdfTextQualityIssues(text: string) {
  const replacements = (text.match(/\uFFFD/g) ?? []).length;
  return replacements >= 3 || text.includes("\u0000")
    ? ["PDF 文字含有无法解码的字符，需要独立页面渲染"]
    : [];
}
