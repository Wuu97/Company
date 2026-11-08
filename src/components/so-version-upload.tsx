"use client";

import { useState } from "react";
import { SoUploadForm } from "@/components/so-upload-form";
import { Button } from "@/components/ui/button";

export function SoVersionUpload({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button create size="toolbar" variant="secondary" onClick={() => setOpen(true)}>重新上传</Button>
      {open && <SoUploadForm open orderId={orderId} onClose={() => setOpen(false)} />}
    </>
  );
}
