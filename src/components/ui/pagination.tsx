import { AppPagination } from "./app-pagination";
/** Server URL adapter: callbacks never cross the server/client boundary. */
export function Pagination({currentPage,total,pageSize=10,pageSizeOptions,href,label}: {currentPage:number;totalPages:number;total:number;pageSize?:number;pageSizeOptions?:number[];href:(page:number)=>string;label:string}) {
  return <AppPagination total={total} currentPage={currentPage} pageSize={pageSize} pageSizeOptions={pageSizeOptions} baseHref={href(currentPage)} label={label} />;
}
