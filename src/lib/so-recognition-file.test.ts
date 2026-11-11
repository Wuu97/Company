import { afterEach, describe, expect, it, vi } from "vitest";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as resources from "./pdf-resources";
import { prepareSoPdf } from "./so-recognition-file";

vi.mock("node:child_process", () => ({ execFile: vi.fn() }));
const directories: string[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  vi.mocked(execFile).mockReset();
  await Promise.all(directories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

// A non-embedded Chinese font using an external predefined Adobe CMap.
async function chinesePdf() {
  const directory = await mkdtemp(join(tmpdir(), "so-cmap-test-"));
  directories.push(directory);
  const text = "截关时间";
  const hex = [...text].map(character => character.charCodeAt(0).toString(16).padStart(4, "0")).join("");
  const stream = `BT /F1 18 Tf 30 130 Td <${hex}> Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 7 0 R >>",
    "<< /Type /Font /Subtype /Type0 /BaseFont /STSong-Light /Encoding /UniGB-UCS2-H /DescendantFonts [5 0 R] >>",
    "<< /Type /Font /Subtype /CIDFontType0 /BaseFont /STSong-Light /CIDSystemInfo << /Registry (Adobe) /Ordering (GB1) /Supplement 4 >> /FontDescriptor 6 0 R /DW 1000 >>",
    "<< /Type /FontDescriptor /FontName /STSong-Light /Flags 6 /FontBBox [-25 -254 1000 880] /ItalicAngle 0 /Ascent 880 /Descent -120 /CapHeight 880 /StemV 80 >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const start = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map(offset => String(offset).padStart(10, "0") + " 00000 n \n").join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  const path = join(directory, "chinese.pdf");
  await writeFile(path, pdf);
  return path;
}

describe("PDF preparation", () => {
  it("preserves non-embedded Chinese text, coordinates, and page images using local resources", async () => {
    const result = await prepareSoPdf(await chinesePdf());
    expect(result.text).toContain("截关时间");
    expect(result.rows.some(row => row.cells.some(cell => cell.text.includes("截关时间")))).toBe(true);
    expect(result.images).toHaveLength(1);
    expect(result.images[0]).toMatch(/^data:image\/png;base64,/);
    expect(result.preparationErrors).toEqual([]);
    expect(result.pdfPreparation.renderer).toBe("pdfjs");
    expect(execFile).not.toHaveBeenCalled();
  });

  it("uses an independent renderer when primary font resources cannot load", async () => {
    const file = await chinesePdf();
    vi.spyOn(resources, "pdfResourceOptions").mockImplementation(() => { throw new Error("CMap missing"); });
    vi.mocked(execFile).mockImplementation(((_command: string, args: string[], _options: unknown, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
      void writeFile(args.at(-1)! + "-1.png", Buffer.from("fake-independent-page")).then(() => callback(null, "", ""));
      return {} as ReturnType<typeof execFile>;
    }) as typeof execFile);
    const result = await prepareSoPdf(file);
    expect(result.pdfPreparation.renderer).toBe("poppler");
    expect(result.images).toHaveLength(1);
    expect(result.text).toBe("");
    expect(result.rows).toEqual([]);
    expect(result.preparationErrors).toContain("CMap missing");
  });

  it("fails visibly when both PDF readers fail", async () => {
    const file = await chinesePdf();
    vi.spyOn(resources, "pdfResourceOptions").mockImplementation(() => { throw new Error("CMap missing"); });
    vi.mocked(execFile).mockImplementation(((_command: string, _args: string[], _options: unknown, callback: (error: Error) => void) => {
      callback(new Error("renderer unavailable"));
      return {} as ReturnType<typeof execFile>;
    }) as typeof execFile);
    await expect(prepareSoPdf(file)).rejects.toThrow("独立渲染也未成功");
  });

  it("rejects successful native rendering that reports missing language resources", async () => {
    const file = await chinesePdf();
    vi.spyOn(resources, "pdfResourceOptions").mockImplementation(() => { throw new Error("CMap missing"); });
    vi.mocked(execFile).mockImplementation(((_command: string, args: string[], _options: unknown, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
      void writeFile(args.at(-1)! + "-1.png", Buffer.from("incomplete-page")).then(() => callback(null, "", "Syntax Error: Missing language pack for 'Adobe-GB1' mapping"));
      return {} as ReturnType<typeof execFile>;
    }) as typeof execFile);
    await expect(prepareSoPdf(file)).rejects.toThrow("生成的页面可能漏字");
  });
});

it("records individual CMap read failures that PDF.js might otherwise swallow", async () => {
  const failures: string[] = [];
  const options = resources.pdfResourceOptions(failures);
  await expect(new options.CMapReaderFactory().fetch({ name: "does-not-exist" })).rejects.toThrow();
  expect(failures).toEqual(["PDF 资源 does-not-exist.bcmap 加载失败"]);
  expect(resources.pdfTextQualityIssues("乱码\uFFFD\uFFFD\uFFFD")).toHaveLength(1);
});
