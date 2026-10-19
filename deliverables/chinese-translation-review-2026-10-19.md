# 利之创中文版本复审记录 · 2026-10-19

状态：本地实现和翻译复审已完成，尚未推送、部署或启用线上中文。工作台任务 4876015f-2464-46be-8531-3435718d5d45；站点 f62485cf-d3ad-40ad-9797-8ede3f6f601b。租户 6c1aa2e0-a38c-47a3-9f83-7ba87a52f203。

## 公司身份与资料依据

- 正式中文名称：郑州利之创机械设备有限公司。依据客户资料目录“公司资料”中的《企业资料&产品&FAQ问题收集表(1).xlsx》企业资料页第3行及《郑州利之创机械设备有限公司彩页-2025年.pdf》封面和第2页。
- 现有英文名 Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. 与彩页双语名称一致。Excel英文名栏为“无”，故不以该空栏自行重新翻译或变更现有英文名。
- 公司介绍按彩页第2页核对设计研发、生产调试、销售及售后服务，以及项目规划、车间设计布局、生产配套信息共享；没有补写资质、规模或商业承诺。
- 联系电话沿用客户表和现站；旧彩页地址与现站地址存在历史差异，本次仅翻译现站地址，不迁移旧地址。
- 术语重点校正：十连包与十片装区别；桶装湿巾复卷机；分切与点断；中包包装。型号、证书编号和技术单位保留。

## 实现和数据

新增 /zh 路由、EN/中文切换，正文、导航、表单文案、页脚、产品/文章及SEO信息使用同一语言上下文。英文URL保持不变，切换保留当前详情路径及查询参数。双语 canonical、hreflang 和 sitemap 已覆盖全部页面。

仅给本租户10个产品、5个分类、2篇文章及租户设置追加中文，并回读18行；保留原英文。复审后精确修正5行中文，英文未改。supported_languages 仍为原来的 en；待上线时启用 zh。没有改账号或其他租户。

## 逐页复审

| 中文路由 | 翻译 | 桌面1440px | 手机390px |
|---|---|---|---|
| /zh | 已复审 | 已记录 | 已记录 |
| /zh/products | 已复审 | 已记录 | 已记录 |
| /zh/solutions | 已复审 | 已记录 | 已记录 |
| /zh/about | 已复审 | 已记录 | 已记录 |
| /zh/news | 已复审 | 已记录 | 已记录 |
| /zh/contact | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-wftg60b-cube-pack-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-lpdt20-super-mini-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-lpdt60-super-mini-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-lpm100-portable-wipes-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-lpms20-portable-ten-pack-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-lpt60-cubic-pack-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-scm400tg-single-wipe-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-tr150-barrel-wipes-rewinder | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-scm400-single-wipe-line | 已复审 | 已记录 | 已记录 |
| /zh/products/lzc-scm400dt-multi-sheet-line | 已复审 | 已记录 | 已记录 |
| /zh/news/wet-wipes-making-machine-types-production-specs-and-features | 已复审 | 已记录 | 已记录 |
| /zh/news/baby-wipes-making-machine-types-production-capacity-and-core-specs | 已复审 | 已记录 | 已记录 |

文章正文逐项检查术语、段落和数字：第一篇43个数字项、第二篇42个数字项；第二篇“每8小时约58,000”的中文语序调整不改变数值。文章原有技术和成本论述是忠实翻译，并不代表重新独立验证全部业务事实。

## 验证与待上线项目

- 双语36个URL的HTTP、语言、公司名、canonical、hreflang、JSON-LD和禁用词审计通过；首页末尾斜杠按URL语义归一化比较。
- 中文18页双端均有浏览器文本与截图记录，无横向溢出或破图。证据位于 output/zh-review（本地忽略目录）。
- 手机导航展开/关闭、分类筛选、第三项解决方案折叠内容，以及产品询价后中英文切换保持目标设备，均实测通过。
- 自动测试8项通过；ESLint无错误，原有 components/ui/use-toast.ts 存在1条未使用类型变量警告。
- 最终 pnpm build 通过，TypeScript 检查通过。
- 本地未配置生产验证码密钥，因此本地验证码图片不能作为线上验证证据；未提交测试询盘。发布后仍需检查正式中文页验证码显示及页面回读。
- 依项目《客户独立站统一执行标准》“已有客户站只有负责人明确要求上线时才 push/deploy”，目前保留本地成果，未完成工作台、未删除本地项目。
