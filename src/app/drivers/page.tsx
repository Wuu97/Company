import { redirectLegacyArchive } from "@/app/archives/redirect-legacy-archive";

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return redirectLegacyArchive("drivers", searchParams);
}
