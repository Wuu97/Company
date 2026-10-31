# 基础档案页面规范与迁移清单

以 src/app/layout.tsx 中业务档案导航为准，实际仅有以下四个页面，无详情子路由。

| 路由 / 页面文件 | 功能及操作 | 查询 / 列表 | 公共组件 / 专有样式 |
| --- | --- | --- | --- |
| /customers · src/app/customers/page.tsx | 客户新增、编辑、启停；关联工厂新增、编辑、联系方式维护 | 名称/编码/工厂名称、客户状态筛选；名称排序、50条分页、嵌套工厂卡片 | PageHeader、ListFilter/Fields/Actions、ResultSummary、Pagination、RecordCard、StatusBadge；customers/page.module.css |
| /drivers · src/app/drivers/page.tsx | 司机新增、编辑编码/姓名/电话、启停 | 原有姓名排序，记录卡片；无筛选和分页 | ResourceRecords、PageHeader、RecordCard、Dialog、Form Controls；无页面专有CSS |
| /fleet-owners · src/app/fleet-owners/page.tsx | 合作车老板/车队新增、编辑编码/名称/电话、启停 | 原有姓名排序，记录卡片；无筛选和分页 | 同上 |
| /temporary-vehicles · src/app/temporary-vehicles/page.tsx | 新增、编辑车牌/车型、启停；仅展示 fleetOwnerId=null 车辆 | 原有车牌排序，记录卡片；无筛选和分页 | 同上 |

这些页面原本不提供删除操作，本次未增加或删除能力。保留既有 API、数据关系及数据库。

## 迁移前问题

ResourceRecords 常驻新增表单、Disclosure 编辑、缺少独立列表区域；客户页已有新增弹窗，但编辑仍为展开表单。页面容器和空状态重复定义。资源保存回调异步读取 event.currentTarget，可能已被置空。

## 已落地规范

- PageHeader 统一标题/说明，右上放新增操作。
- ArchiveSection 仅负责带标题、可选数量的卡片容器；ArchiveEmptyState 复用 EmptyState 提供居中状态。
- 筛选沿用 ListFilter，客户页使用 Grid 和底部对齐的操作区域。其他页面没有原生筛选，不强加筛选。
- 列表保留各页排序、客户页分页和关联工厂结构。
- 新增与简单编辑复用 Dialog、Button、Form Controls、FeedbackMessage；共同使用 archive.module.css 的 form 间距。
- 保存时禁用重复操作及关闭；成功关闭并 router.refresh；失败保留输入。
- 客户页新增工厂仍预选客户，客户编码仍由后端生成。所有编辑字段保留。
- 样式使用 Typography Tokens；无额外组件库、!important、数据库或API改动。
- 共享新增组件仅被业务档案使用；未修改通用 Button/Dialog/ListFilter 的全局行为。
