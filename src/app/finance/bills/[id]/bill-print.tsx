"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { chineseMoney, statementAccount, statementBank, statementCompany, statementData, statementColumnWidths, statementHiddenColumns, statementHeaders, yuan } from "@/lib/settlement/bill-statement";
import { DriverStatementTable } from "@/components/driver-statement-table";
import css from "./bill-print.module.css";

const PAPER_WIDTH = 1123;
const PAPER_HEIGHT = 794;

export function PrintPreviewModal({ bill, onClose }: { bill: any; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const frame = useRef<HTMLIFrameElement | null>(null);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const data = statementData(bill), money = (n: bigint) => yuan(n).toFixed(2);
  const visibleColumns = statementHeaders.map((_, i) => i).filter(i => !statementHiddenColumns.includes(i + 2));
  const visibleWidth = visibleColumns.reduce((sum, i) => sum + statementColumnWidths[i + 1], 0);
  const pages = Array.from({ length: Math.max(1, Math.ceil(data.rows.length / 14)) }, (_, i) => data.rows.slice(i * 14, (i + 1) * 14));
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const buttons = root.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      if (!buttons?.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === root.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root.current)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", keydown); frame.current?.remove(); opener?.focus(); };
  }, [onClose]);

  useEffect(() => {
    const container = preview.current;
    if (!container) return;
    const resize = () => {
      const style = getComputedStyle(container);
      const width = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      if (width > 0 && height > 0) setScale(Math.min(width / PAPER_WIDTH, height / PAPER_HEIGHT));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = preview.current;
    if (!container) return;
    // Pick the page with the largest visible area inside the preview viewport.
    const updatePage = () => {
      const bounds = container.getBoundingClientRect();
      let bestPage = 1;
      let bestArea = -1;
      canvas.current?.querySelectorAll<HTMLElement>(`.${css.pageSlot}`).forEach((slot, index) => {
        const rect = slot.getBoundingClientRect();
        const area = Math.max(0, Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top))
          * Math.max(0, Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left));
        if (area > bestArea) { bestArea = area; bestPage = index + 1; }
      });
      setCurrentPage(bestPage);
    };
    container.addEventListener("scroll", updatePage, { passive: true });
    const observer = new ResizeObserver(updatePage);
    observer.observe(container);
    updatePage();
    return () => { container.removeEventListener("scroll", updatePage); observer.disconnect(); };
  }, [scale, pages.length]);

  async function print() {
    if (printing || !canvas.current) return;
    setPrinting(true); setError("");
    frame.current?.remove();
    const iframe = document.createElement("iframe");
    iframe.title = "对账单打印";
    iframe.className = css.printFrame;
    frame.current = iframe;
    document.body.appendChild(iframe);
    try {
      const doc = iframe.contentDocument!;
      doc.open();
      doc.write("<!doctype html><html><head><title>对账单</title></head><body></body></html>");
      doc.close();
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
      await Promise.all(styles.map(source => new Promise<void>(resolve => {
        const clone = source.cloneNode(true) as HTMLElement;
        if (clone.tagName === "LINK") { clone.onload = () => resolve(); clone.onerror = () => resolve(); } else resolve();
        doc.head.appendChild(clone);
      })));
      // Copy only paper content: preview transforms must never affect printing.
      const sheets = canvas.current.querySelectorAll(`.${css.paper}`);
      doc.body.innerHTML = Array.from(sheets, sheet => { const copy = sheet.cloneNode(true) as HTMLElement; copy.style.removeProperty("transform"); return copy.outerHTML; }).join("");
      await Promise.all(Array.from(doc.images, image => image.decode()));
      await doc.fonts.ready;
      await new Promise<void>(resolve => iframe.contentWindow!.requestAnimationFrame(() => resolve()));
      iframe.contentWindow!.onafterprint = () => setPrinting(false);
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
    } catch { setError("打印未能启动或公司抬头图片加载失败，请重试。"); }
    finally { setPrinting(false); }
  }
  return createPortal(<div className={css.backdrop} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={css.modal} ref={root} role="dialog" aria-modal="true" aria-label="打印对账单预览" tabIndex={-1}>
      <header className={css.header}><h2>打印对账单预览</h2><Button type="button" variant="text" size="small" iconOnly aria-label="关闭打印预览" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></Button></header>
      <div className={css.body} ref={preview}><div className={css.pages} ref={canvas}>{pages.map((rows, page) => <div className={css.pageSlot} key={page} style={{ width: PAPER_WIDTH * scale, height: PAPER_HEIGHT * scale }}><section className={css.paper} style={{ transform: `scale(${scale})` }}>{["DRIVER", "PARTNER"].includes(bill.billType) ? <>
        <h1><img className={css.companyTitle} src="/images/statement-company-title-provided.png" alt={statementCompany} /></h1>
        <h2 className={css.driverTitle}><img src={bill.billType === "PARTNER" ? "/images/partner-statement-title.png" : "/images/driver-statement-title.png"} alt={bill.billType === "PARTNER" ? "车辆作业明细表" : "司机作业明细表"} /></h2>
        <div className={css.driverMeta}><span>{bill.billType === "PARTNER" ? "合作车：" : "司机姓名："}{data.customer}</span><span>{data.period}</span></div>
        <DriverStatementTable partner={bill.billType === "PARTNER"} className={css.driverTable} items={bill.lines.slice(page * 14, (page + 1) * 14)} allItems={bill.lines} offset={page * 14} />
        <p className={css.driverMeta}>— 表示未记录 · Page {page + 1} of {pages.length}</p>
      </> : <table>
        <colgroup>{visibleColumns.map(i => <col key={i} style={{ width: `${statementColumnWidths[i + 1] / visibleWidth * 100}%` }} />)}</colgroup>
        <thead>
          <tr className={css.titleRow}><td colSpan={18}><h1><img className={css.companyTitle} src="/images/statement-company-title-provided.png" alt={statementCompany} /></h1></td></tr>
          <tr className={css.subtitle}><td>TO:</td><td colSpan={4}>{data.customer}</td><td colSpan={8} /><td colSpan={4}>{data.period}</td><td /></tr>
          <tr className={css.gridRow}>{visibleColumns.map(i => <th key={i}>{statementHeaders[i]}</th>)}</tr>
        </thead>
        <tbody>{rows.map((row, i) => <tr className={css.gridRow} key={i}>{visibleColumns.map(j => <td key={j}>{typeof row[j] === "bigint" ? money(row[j] as bigint) : row[j]}</td>)}</tr>)}
          {page === pages.length - 1 && <>
            <tr className={css.summary}><td colSpan={7}>{statementCompany}</td><td className={css.label}>汇总：</td>{data.totals.map((n, i) => statementHiddenColumns.includes(i + 10) ? null : <td key={i}>{money(n)}</td>)}<td /></tr>
            <tr className={css.total}><td colSpan={7} /><td className={css.label}>合计：</td><td colSpan={3} className={css.totalAmount}>{money(data.total)}</td><td colSpan={7} /></tr>
            <tr className={css.uppercase}><td colSpan={7}>Tel：0755-25284377 Fax:0755-25284396</td><td className={css.label}>合计大写：</td><td colSpan={8}>{chineseMoney(data.total)}</td><td colSpan={2} /></tr>
          </>}
          <tr className={css.accountCompany}><td colSpan={14}>公司名称：{statementCompany}</td><td colSpan={4} className={css.pageNumber}>Page {page + 1} of {pages.length}</td></tr>
          <tr className={css.account}><td colSpan={18}>开户银行：{statementBank}</td></tr>
          <tr className={css.account}><td colSpan={18}>帐号：{statementAccount}</td></tr>
        </tbody></table>}</section></div>)}</div></div>
      <footer className={css.footer}><span role="status">共 {pages.length} 页 / 当前第 {currentPage} 页{error && <span className={css.printError} role="alert">{error}</span>}</span><div><Button size="toolbar" wide="mobile" variant="neutral" onClick={onClose}>取消</Button><Button size="toolbar" wide="mobile" variant="primary" disabled={printing} onClick={print}>{printing ? "正在打印…" : "开始打印"}</Button></div></footer>
    </div>
  </div>, document.body);
}
