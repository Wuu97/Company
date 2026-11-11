import { pdfResourceOptions } from "./pdf-resources";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

type Cell = { x: number; text: string };
export type SoPdfRow = { page: number; y: number; cells: Cell[] };

export async function readSoPdfLayout(data: Uint8Array): Promise<SoPdfRow[]> {
  const failures: string[] = [];
  const task = getDocument({ ...pdfResourceOptions(failures), data: new Uint8Array(data), isEvalSupported: false });
  try {
    const doc = await task.promise;
    const rows: SoPdfRow[] = [];
    for (let page = 1; page <= doc.numPages; page++) {
      const content = await (await doc.getPage(page)).getTextContent();
      const cells = content.items.flatMap(item => "str" in item && item.str.trim()
        ? [{ x: Math.round(item.transform[4]), y: Math.round(item.transform[5]), text: item.str.trim() }]
        : []);
      for (const cell of cells.sort((a, b) => b.y - a.y)) {
        const last = rows.at(-1);
        if (last?.page === page && last.y - cell.y <= 3) last.cells.push(cell);
        else rows.push({ page, y: cell.y, cells: [cell] });
      }
    }
    for (const row of rows) row.cells.sort((a, b) => a.x - b.x);
    if (failures.length) throw new Error(failures.join("；"));
    return rows;
  } finally {
    await task.destroy();
  }
}

export function formatSoPdfLayout(rows: SoPdfRow[]) {
  return rows.map((row, index) =>
    `row ${index + 1}, page ${row.page}, y=${row.y}: ${row.cells.map(cell => `x=${cell.x} ${cell.text}`).join(" | ")}`,
  ).join("\n");
}
