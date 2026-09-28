export function duplicateFingerprint(input:{customerId:string;carrier:string;soNumber:string;sha256:string}){return `${input.customerId}:${input.carrier.trim().toUpperCase()}:${input.soNumber.trim().toUpperCase()}:${input.sha256}`}
export function validatePlanAssignment(activePlanIds:string[]){if(activePlanIds.length>0)throw new Error("该内部柜子已在生效中的装柜计划内")}
export function nextInternalContainerCode(orderId:string,index:number){return `IC-${orderId.slice(-6).toUpperCase()}-${String(index).padStart(3,"0")}`}
export const orderStatuses=["PENDING_REVIEW","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED"] as const;
export type OrderStatus=(typeof orderStatuses)[number];
const allowedOrderTransitions:Record<OrderStatus,OrderStatus[]>={PENDING_REVIEW:["CONFIRMED","CANCELLED"],CONFIRMED:["IN_PROGRESS","CANCELLED"],IN_PROGRESS:["COMPLETED","CANCELLED"],COMPLETED:[],CANCELLED:[]};
export function validateOrderStatusTransition(from:OrderStatus,to:OrderStatus){if(from===to)return;if(!allowedOrderTransitions[from].includes(to))throw new Error(`订单状态不能从 ${from} 变更为 ${to}`)}
