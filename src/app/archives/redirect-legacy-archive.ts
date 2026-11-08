import { redirect } from "next/navigation";
import type { ArchiveTab } from "./archive-tabs";

export async function redirectLegacyArchive(
  tab: ArchiveTab,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  params.set("tab", tab);
  redirect(`/archives?${params}`);
}
