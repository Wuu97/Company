"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { SoUploadForm } from "@/components/so-upload-form";

const OpenUpload = createContext<() => void>(() => {});

export function OrderUploadActions({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <OpenUpload.Provider value={() => setOpen(true)}>
      {children}
      <SoUploadForm open={open} onClose={() => setOpen(false)} />
    </OpenUpload.Provider>
  );
}

export function OrderUploadButton({ compact = false }: { compact?: boolean }) {
  const open = useContext(OpenUpload);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={open}
      className={compact
        ? "mt-4 cursor-pointer rounded-md border border-solid border-blue-100 bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-blue-700 hover:bg-blue-100"
        : "inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border-0 bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700"}
    >
      {!compact && <Plus size={16} aria-hidden="true" />}
      导入 SO 单据
    </button>
  );
}
