import { getArchiveTab } from "./archive-tabs";
import { CustomerFactoryList } from "./CustomerFactoryList";
import { DriverList } from "./DriverList";
import { ContractTruckList } from "./ContractTruckList";
import { TemporaryTruckList } from "./TemporaryTruckList";

type Search = {
  tab?: string;
  q?: string;
  status?: string;
  page?: string;
  pageSize?: string;
};
export default async function ArchivesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const tab = getArchiveTab(input.tab);
  const Content = {
    customers: CustomerFactoryList,
    drivers: DriverList,
    contract_trucks: ContractTruckList,
    temporary_trucks: TemporaryTruckList,
  }[tab];
  return <Content key={tab} searchParams={Promise.resolve(input)} />;
}
