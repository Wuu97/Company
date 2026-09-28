import { prisma } from "@/lib/prisma";
import { CustomerForm } from "@/components/customer-form";
import { FactoryForm } from "@/components/factory-form";
export default async function Customers(){const customers=await prisma.customer.findMany({include:{factories:true},orderBy:{name:"asc"}});return <><h2>客户与工厂</h2><CustomerForm/><FactoryForm customers={customers}/><table><thead><tr><th>客户</th><th>工厂数量</th><th>状态</th></tr></thead><tbody>{customers.length?customers.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.factories.length}</td><td><span className="tag">{c.active?"启用":"停用"}</span></td></tr>):<tr><td colSpan={3}>暂无客户档案。</td></tr>}</tbody></table></>}
