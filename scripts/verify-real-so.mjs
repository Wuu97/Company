import { access, readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import { ParserRegistry } from "../src/lib/so-parser.ts";

const fixtures = [
  { file: "uploads/362c60e0046e917348645b4d387e878a86fe4e9732c247efc2d2a5d8b801d645-SO_TSHGSZX26016499.pdf", expected: { soNumber: "TSHGSZX26016499", carrier: "TAILWIND", vesselName: "PANDA 009", voyage: "619", etdText: "19/09/2026 22:00", etaText: "25/10/2026 05:00", containers: [{ containerType: "40HC", quantity: 1 }] } },
  { file: "uploads/a1dc904f7e55cfdf49101c4cad3d550f54664396713c52c05a1efee9529308fe-SO_GGZ3207192.pdf", expected: { soNumber: "GGZ3207192", carrier: "CMA CGM", vesselName: "CMA CGM JACQUES JUNIOR", voyage: "0R11CW1MA", siCutoffText: "20-SEP-2026 16:00", vgmCutoffText: "18-SEP-2026 16:00", portCutoffText: "18-SEP-2026 13:00", containers: [{ containerType: "40HC", quantity: 1 }] } },
  { file: "uploads/c819f16248c843c8a6a74e467a8f207a467f8a858ba40bec0d3d425df284e4e2-SO_GGZ3207178.pdf", expected: { soNumber: "GGZ3207178", carrier: "CMA CGM", vesselName: "CMA CGM JACQUES JUNIOR", voyage: "0R11CW1MA", siCutoffText: "20-SEP-2026 16:00", vgmCutoffText: "18-SEP-2026 16:00", portCutoffText: "18-SEP-2026 13:00", containers: [{ containerType: "40HC", quantity: 1 }] } },
];

for (const fixture of fixtures) {
  await access(fixture.file);
  const pdf = new PDFParse({ data: await readFile(fixture.file) });
  const result = await pdf.getText();
  await pdf.destroy();
  const parsed = new ParserRegistry().parse({ fileName: fixture.file, text: result.text });
  for (const [field, expected] of Object.entries(fixture.expected)) {
    if (JSON.stringify(parsed[field]) !== JSON.stringify(expected)) throw new Error(`${fixture.file}: ${field} expected ${JSON.stringify(expected)}, received ${JSON.stringify(parsed[field])}`);
  }
  console.log(`PDF_REGRESSION_PASS ${fixture.file}`);
}
