"use client";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";

/** Re-measure on window/container and table resizing, including column changes. */
export function TableScrollSurface({ children, onScroll, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [remaining, setRemaining] = useState(false);
  const measure = () => {
    const node = ref.current;
    if (node) setRemaining(node.scrollWidth > node.clientWidth + 1 && node.scrollLeft < node.scrollWidth - node.clientWidth - 1);
  };
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    measure();
    return () => observer.disconnect();
  }, []);
  return <div {...props} ref={ref} data-scroll-right={remaining ? "true" : "false"} onScroll={event => { measure(); onScroll?.(event); }}>{children}</div>;
}
