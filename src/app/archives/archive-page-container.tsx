"use client";

import { useRouter } from "next/navigation";
import {
  PageContainer,
  type PageContainerProps,
} from "@/components/ui/page-container";
import { archiveTabs } from "./archive-tabs";

/** The selected tab is controlled by the server-validated URL query. */
export function ArchivePageContainer(props: PageContainerProps) {
  const router = useRouter();
  return (
    <PageContainer
      {...props}
      tabs={
        props.activeTab
          ? archiveTabs.map((tab) => ({
              ...tab,
              onClick: () =>
                router.push(`/archives?tab=${tab.value}`, { scroll: false }),
            }))
          : props.tabs
      }
    />
  );
}
