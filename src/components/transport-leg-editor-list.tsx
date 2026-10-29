import { TransportLegAddForm, TransportLegForm, type TransportLeg } from "@/components/transport-leg-form";
import businessStyles from "@/components/business.module.css";

type Props = {
  taskId: string;
  status: string;
  legs: TransportLeg[];
  factoryFallback: string;
  emptyMessage?: string;
};

/** Shared editable leg list used by both the plan execution chain and the transport workspace. */
export function TransportLegEditorList({ taskId, status, legs, factoryFallback, emptyMessage }: Props) {
  const canAddLeg = !["COMPLETED", "CANCELLED"].includes(status);
  return <>{legs.length ? legs.map(leg => <div key={leg.id} className={businessStyles["transport-leg"]}><p><b>第 {leg.sequence} 段：</b>{`${leg.vehicleNo || "车辆待定"} · ${leg.driverName || "司机待定"}`}</p><p>{leg.pickupTerminal || "提柜码头待定"} → {leg.factoryLocation || factoryFallback} → {leg.returnTerminal || "还柜码头待定"}</p><TransportLegForm taskId={taskId} status={status} leg={leg}/></div>) : emptyMessage ? <p className={businessStyles["muted"]}>{emptyMessage}</p> : null}{canAddLeg && <TransportLegAddForm taskId={taskId}/>}</>;
}
