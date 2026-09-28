import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderActions } from "@/components/order-actions";
import { SoReviewForm } from "@/components/so-review-form";
import { SoFilePreview } from "@/components/so-file-preview";
import { SoVersionUpload } from "@/components/so-version-upload";
import { CancelActionButton } from "@/components/cancel-action-button";
import { ApplyVersionChangeButton } from "@/components/apply-version-change-button";

export default async function OrderDetail({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const [order,customers]=await Promise.all([prisma.soOrder.findUnique({where:{id},include:{customer:true,files:true,containers:true,confirmations:true,plans:{include:{factory:true,items:true}},versionChanges:{where:{status:"PENDING"},include:{soFileVersion:true}}}}),prisma.customer.findMany({select:{id:true,name:true},orderBy:{name:"asc"}})]);
  if(!order)notFound();
  const raw=order.files.at(-1)?.rawExtraction as {soNumber?:string;carrier?:string;vesselName?:string;voyage?:string;raw?:Record<string,string>;containers?:{containerType:string;quantity:number}[]}|null;
  const times=raw?.raw||{}; const timeLabels:Record<string,string>={opening:"开仓/收货时间",etd:"装货港 ETD",eta:"卸货港 ETA",cutoff:"截关/补料截止时间",portCutoff:"截关时间",vgmCutoff:"VGM 截止时间",siCutoff:"补料（SI）截止时间"};
  const planByContainer=new Map(order.plans.filter(plan=>["DRAFT","CONFIRMED"].includes(plan.status)).flatMap(plan=>plan.items.filter(item=>item.active).map(item=>[item.containerUnitId,plan] as const)));
  return <>
    <h2>SO 详情：{order.soNumber}</h2>
    <section><b>客户：</b>{order.customer?.name||"待匹配"}　<b>船公司：</b>{order.carrier}　<b>船名：</b>{raw?.vesselName||"未识别"}　<b>航次：</b>{raw?.voyage||"未识别"}　<span className="tag">{order.parseStatus}</span></section>
    {order.versionChanges.map(change=><section key={change.id}><h3>新版本差异待确认（v{change.soFileVersion.version}）</h3><pre>{JSON.stringify(change.changes,null,2)}</pre><p className="muted">柜型/柜量变化不会通过此处自动应用，需走专门调整流程。</p><ApplyVersionChangeButton url={`/api/orders/${id}/version-changes/${change.id}/apply`}/></section>)}
    <section><h3>订舱与运输信息</h3><table><tbody><tr><td>客户参考号</td><td>{order.customerReference||"待人工核对"}</td></tr><tr><td>船名 / 航次</td><td>{order.vesselName||raw?.vesselName||"待人工核对"} / {order.voyage||raw?.voyage||"待人工核对"}</td></tr><tr><td>航线</td><td>{order.loadPort||"待人工核对"} → {order.dischargePort||"待人工核对"}</td></tr><tr><td>预计开船 ETD</td><td>{order.etdText||"待人工核对"}</td></tr><tr><td>预计到港 ETA</td><td>{order.etaText||"待人工核对"}</td></tr><tr><td>原文件截止时间</td><td>{order.cutoffText||"待人工核对"}</td></tr></tbody></table></section>
    <section><h3>提柜与还柜信息</h3><table><tbody><tr><td>提空柜地点</td><td>{order.emptyPickupLocation||"待人工核对"}</td></tr><tr><td>交重柜地点</td><td>{order.fullReturnLocation||"待人工核对"}</td></tr><tr><td>运输方式</td><td>{order.transportMode||"待人工核对"}</td></tr></tbody></table></section>
    <section><h3>ETB 信息</h3><p><b>当前 ETB：</b>{order.etbText||"待查询"}</p><p><b>来源：</b>{order.etbSource||"未查询"}　<b>观测时间：</b>{order.etbObservedAt?order.etbObservedAt.toLocaleString("zh-CN"):"—"}</p>{order.etbNeedsReview&&<span className="tag warning-tag">ETB 变化待人工核对</span>}</section>
    <section><h3>SO 自动解析结果</h3><p className="muted">系统展示解析出的业务字段，人工只需对照上传的 PDF 核对。</p><table><tbody>{Object.entries(times).filter(([key])=>key!=="extractedText").map(([key,value])=><tr key={key}><td>{timeLabels[key]||key}</td><td>{value||"待人工核对"}</td></tr>)}</tbody></table>{order.files.at(-1)&&<a className="open-pdf-link" href={`/api/files/${order.files.at(-1)!.id}`} target="_blank" rel="noreferrer">▶ 打开上传的 SO PDF</a>}</section>
    <SoReviewForm orderId={id} soNumber={order.soNumber} carrier={order.carrier} customerId={order.customerId} customers={customers} siCutoffText={order.siCutoffText||times.siCutoff||""} initialContainers={raw?.containers||[]}/>
    <OrderActions orderId={id}/>
    <SoVersionUpload orderId={id}/>
    <section><h3>上传的 SO 文件</h3>{order.files.map(f=><SoFilePreview key={f.id} fileId={f.id} fileName={f.originalName} version={f.version}/>)}</section>
    <section><h3>内部装柜安排</h3><table><thead><tr><th>内部柜子</th><th>实际柜号</th><th>柜型</th><th>工厂</th><th>计划时间</th><th>状态</th></tr></thead><tbody>{order.containers.map(c=>{const plan=planByContainer.get(c.id);return <tr key={c.id}><td>{c.internalCode}</td><td>{c.containerNo||"待确定"}</td><td>{c.containerType}</td><td>{plan?.factory.name||"待分配"}</td><td>{plan?.scheduledAt.toLocaleString("zh-CN")||"—"}</td><td>{plan?.status||"待安排"}</td></tr>})}</tbody></table></section>
    <section><h3>客户确认</h3><p>已确认：{order.confirmations.filter(c=>["PARTIAL","CONFIRMED"].includes(c.status)).reduce((sum,c)=>sum+c.quantity,0)} / {order.containers.filter(c=>c.active).length} 柜</p>{order.confirmations.length?<table><thead><tr><th>状态</th><th>本次柜量</th><th>确认时间</th><th>备注</th><th>操作</th></tr></thead><tbody>{order.confirmations.map(c=><tr key={c.id}><td>{c.status}</td><td>{c.quantity}</td><td>{c.confirmedDate?.toLocaleString("zh-CN")||"—"}</td><td>{c.note||"—"}</td><td>{c.status!=="CANCELLED"&&<CancelActionButton url={`/api/orders/${id}/confirmations/${c.id}`} label="撤销确认"/>}</td></tr>)}</tbody></table>:"暂无确认记录"}</section>
    <section><h3>装柜计划</h3>{order.plans.length?order.plans.map(p=><p key={p.id}>{p.scheduledAt.toLocaleString("zh-CN")} · {p.factory.name} · {p.status} · {p.items.length} 柜　{["DRAFT","CONFIRMED"].includes(p.status)&&<CancelActionButton url={`/api/plans/${p.id}/cancel`} label="取消计划"/>}</p>):"暂无计划"}</section>
  </>;
}
