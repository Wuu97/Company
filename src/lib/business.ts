export function duplicateFingerprint(input:{customerId:string;carrier:string;soNumber:string;sha256:string}){return `${input.customerId}:${input.carrier.trim().toUpperCase()}:${input.soNumber.trim().toUpperCase()}:${input.sha256}`}
export function validatePlanAssignment(activePlanIds:string[]){if(activePlanIds.length>0)throw new Error("该内部柜子已在生效中的装柜计划内")}
export function nextInternalContainerCode(orderId:string,index:number){return `IC-${orderId.slice(-6).toUpperCase()}-${String(index).padStart(3,"0")}`}
