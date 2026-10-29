export const orderMilestones = [
  { type: "SI_SUBMITTED", label: "SI 已提交" },
  { type: "VGM_SUBMITTED", label: "VGM 已提交" },
  { type: "CUSTOMS_DECLARED", label: "报关已完成" },
  { type: "GATE_IN", label: "重柜已进港" },
  { type: "BILL_OF_LADING", label: "提单已确认" },
  { type: "CARGO_RELEASE", label: "放货已完成" },
] as const;

export type OrderMilestoneType = (typeof orderMilestones)[number]["type"];
export const orderMilestoneTypes = orderMilestones.map(item => item.type) as [OrderMilestoneType, ...OrderMilestoneType[]];
export function orderMilestoneLabel(type: string) { return orderMilestones.find(item => item.type === type)?.label || type; }
