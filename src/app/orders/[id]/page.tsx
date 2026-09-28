import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderActions } from "@/components/order-actions";
import { SoReviewForm } from "@/components/so-review-form";
import { SoFilePreview } from "@/components/so-file-preview";

export default async function OrderDetail({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const order=await prisma.soOrder.findUnique({where:{id},include:{customer:true,files:true,containers:true,confirmations:true,plans:{include:{factory:true,items:true}}}});
  if(!order)notFound();
  const raw=order.files.at(-1)?.rawExtraction as {soNumber?:string;carrier?:string;vesselName?:string;voyage?:string;raw?:Record<string,string>;containers?:{containerType:string;quantity:number}[]}|null;
  const times=raw?.raw||{}; const timeLabels:Record<string,string>={opening:"开仓/收货时间",etd:"装货港 ETD",eta:"卸货港 ETA",cutoff:"截关/补料截止时间",portCutoff:"截关时间",vgmCutoff:"VGM 截止时间",siCutoff:"补料（SI）截止时间"};
  return <>
    <h2>SO 详情：{order.soNumber}</h2>
    <section><b>客户：</b>{order.customer?.name||"待匹配"}　<b>船公司：</b>{order.carrier}　<b>船名：</b>{raw?.vesselName||"未识别"}　<b>航次：</b>{raw?.voyage||"未识别"}　<span className="tag">{order.parseStatus}</span></section>
    <section><h3>订舱与运输信息</h3><table><tbody><tr><td>客户参考号</td><td>{order.customerReference||"待人工核对"}</td></tr><tr><td>船名 / 航次</td><td>{order.vesselName||raw?.vesselName||"待人工核对"} / {order.voyage||raw?.voyage||"待人工核对"}</td></tr><tr><td>航线</td><td>{order.loadPort||"待人工核对"} → {order.dischargePort||"待人工核对"}</td></tr><tr><td>预计开船 ETD</td><td>{order.etdText||"待人工核对"}</td></tr><tr><td>预计到港 ETA</td><td>{order.etaText||"待人工核对"}</td></tr><tr><td>原文件截止时间</td><td>{order.cutoffText||"待人工核对"}</td></tr></tbody></table></section>
    <section><h3>提柜与还柜信息</h3><table><tbody><tr><td>提空柜地点</td><td>{order.emptyPickupLocation||"待人工核对"}</td></tr><tr><td>交重柜地点</td><td>{order.fullReturnLocation||"待人工核对"}</td></tr><tr><td>运输方式</td><td>{order.transportMode||"待人工核对"}</td></tr></tbody></table></section>
    <section><h3>ETB 信息</h3><p><b>当前 ETB：</b>{order.etbText||"待查询"}</p><p><b>来源：</b>{order.etbSource||"未查询"}　<b>观测时间：</b>{order.etbObservedAt?order.etbObservedAt.toLocaleString("zh-CN"):"—"}</p>{order.etbNeedsReview&&<span className="tag warning-tag">ETB 变化待人工核对</span>}</section>
    <section><h3>SO 自动解析结果</h3><p className="muted">系统展示解析出的业务字段，人工只需对照上传的 PDF 核对。</p><table><tbody>{Object.entries(times).filter(([key])=>key!=="extractedText").map(([key,value])=><tr key={key}><td>{timeLabels[key]||key}</td><td>{value||"待人工核对"}</td></tr>)}</tbody></table>{order.files.at(-1)&&<a className="open-pdf-link" href={`/api/files/${order.files.at(-1)!.id}`} target="_blank" rel="noreferrer">▶ 打开上传的 SO PDF</a>}</section>
    <SoReviewForm orderId={id} soNumber={order.soNumber} carrier={order.carrier} siCutoffText={order.siCutoffText||times.siCutoff||""} initialContainers={raw?.containers||[]}/>
    <OrderActions orderId={id}/>
    <section><h3>上传的 SO 文件</h3>{order.files.map(f=><SoFilePreview key={f.id} fileId={f.id} fileName={f.originalName} version={f.version}/>)}</section>
    <section><h3>内部柜子</h3><table><thead><tr><th>内部编号</th><th>实际柜号</th><th>柜型</th></tr></thead><tbody>{order.containers.map(c=><tr key={c.id}><td>{c.internalCode}</td><td>{c.containerNo||"待确定"}</td><td>{c.containerType}</td></tr>)}</tbody></table></section>
    <section><h3>客户确认</h3>{order.confirmations.length?order.confirmations.map(c=><p key={c.id}>{c.status}：{c.quantity} 柜</p>):"暂无确认记录"}</section>
    <section><h3>装柜计划</h3>{order.plans.length?order.plans.map(p=><p key={p.id}>{p.scheduledAt.toLocaleString("zh-CN")} · {p.factory.name} · {p.status} · {p.items.length} 柜</p>):"暂无计划"}</section>
  </>;
}
