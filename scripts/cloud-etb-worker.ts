import { processNextEtbQuery } from "./process-next-etb-query";
import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { manualSessions } from "../src/lib/etb-manual-session";
import { processCredentialTestRun } from "./process-etb-credential-test";
const token = process.env.ETB_WORKER_TOKEN;
if (!token || token.length < 32) throw new Error("ETB_WORKER_TOKEN 必须至少 32 位");
const server = createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const supplied = Buffer.from(req.headers.authorization || "");
  const expected = Buffer.from("Bearer " + token);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) { res.writeHead(401).end(); return; }
  try {
    if (req.url === "/health") { res.end("ok"); return; }
    const id = req.url?.match(/^\/sessions\/([a-z0-9]+)$/)?.[1];
    const page = id && manualSessions.get(id);
    if (!page || page.isClosed()) { res.writeHead(404).end(); return; }
    if (req.method === "GET") { res.setHeader("Content-Type", "image/jpeg"); res.end(await page.screenshot({ type: "jpeg", quality: 75 })); return; }
    if (req.method !== "POST") { res.writeHead(405).end(); return; }
    let body = "";
    for await (const chunk of req) { body += chunk; if (body.length > 2048) { res.writeHead(413).end(); return; } }
    const points = JSON.parse(body).points;
    if (!Array.isArray(points) || points.length < 1 || points.length > 60 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.x < 0 || p.x > 1200 || p.y < 0 || p.y > 800)) { res.writeHead(400).end(); return; }
    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();
    try { for (const p of points.slice(1)) await page.mouse.move(p.x, p.y, { steps: 2 }); }
    finally { await page.mouse.up(); }
    res.end("ok");
  } catch { res.writeHead(503).end("操作未完成，请重试"); }
});
server.listen(Number(process.env.ETB_WORKER_PORT || 3100), process.env.ETB_WORKER_HOST || "127.0.0.1");
let stopping = false;
process.on("SIGTERM", () => { stopping = true; });
async function loop() {
  while (!stopping) {
    try {
      const run = await prisma.etbCredentialTestRun.findFirst({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, select: { id: true } });
      if (run) await processCredentialTestRun(run.id);
      else {
        await processNextEtbQuery();
        await new Promise(done => setTimeout(done, 2000));
      }
    } catch (error) { console.error(error); await new Promise(done => setTimeout(done, 2000)); }
  }
  server.close(); await prisma.$disconnect();
}
void loop();
