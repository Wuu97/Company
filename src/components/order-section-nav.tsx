"use client";

import businessStyles from "@/components/business.module.css";
import { useEffect, useState } from "react";
import { NavTabs } from "@/components/ui/nav-tabs";

type Section = { label: string; element: HTMLElement };

/** Keeps the long SO workspace navigable without duplicating its business content. */
export function OrderSectionNav() {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = [...document.querySelectorAll<HTMLElement>("main h3")]
      .filter(heading => heading.textContent)
      .map(heading => ({ label: heading.textContent!.trim(), element: heading }));
    setSections(headings);
    setActive(headings[0]?.label || "");
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive((visible.target as HTMLElement).textContent?.trim() || "");
    }, { rootMargin: "-96px 0px -65% 0px", threshold: 0 });
    headings.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  if (!sections.length) return null;

  return <NavTabs className={businessStyles["section-nav"]} label="快速定位" items={sections.map(({ label, element }) => ({ label, active: active === label, onClick: () => { setActive(label); element.scrollIntoView({ behavior: "smooth", block: "start" }); } }))} />;
}
