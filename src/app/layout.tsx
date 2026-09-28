import "./styles.css";
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><aside><h1>运柜管理</h1><a href="/">工作台</a><a href="/orders">SO 订单</a><a href="/customers">客户与工厂</a><a href="/plans">装柜计划</a><a href="/logs">操作日志</a></aside><main>{children}</main></body></html>}
