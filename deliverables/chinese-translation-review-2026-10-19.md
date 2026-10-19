# 利之创中文版本复审记录 · 2026-10-19

状态：负责人已明确授权直接上线；中文版本已发布至 https://lzcglobal.com/zh，正式站逐页复审通过。工作台任务 4876015f-2464-46be-8531-3435718d5d45；站点 f62485cf-d3ad-40ad-9797-8ede3f6f601b。租户 6c1aa2e0-a38c-47a3-9f83-7ba87a52f203。

## 公司身份与资料依据

- 正式中文名称：郑州利之创机械设备有限公司。依据客户资料目录“公司资料”中的《企业资料&产品&FAQ问题收集表(1).xlsx》企业资料页第3行及《郑州利之创机械设备有限公司彩页-2025年.pdf》封面和第2页。
- 现有英文名 Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. 与彩页双语名称一致。Excel英文名栏为“无”，故不以该空栏自行重新翻译或变更现有英文名。
- 公司介绍按彩页第2页核对设计研发、生产调试、销售及售后服务，以及项目规划、车间设计布局、生产配套信息共享；没有补写资质、规模或商业承诺。
- 联系电话沿用客户表和现站；旧彩页地址与现站地址存在历史差异，本次仅翻译现站地址，不迁移旧地址。
- 术语重点校正：十连包与十片装区别；桶装湿巾复卷机；分切与点断；中包包装。型号、证书编号和技术单位保留。

## 实现和数据

新增 /zh 路由、EN/中文切换，正文、导航、表单文案、页脚、产品/文章及SEO信息使用同一语言上下文。英文URL保持不变，切换保留当前详情路径及查询参数。双语 canonical、hreflang 和 sitemap 已覆盖全部页面。

仅给本租户10个产品、5个分类、2篇文章及租户设置追加中文，并回读18行；保留原英文。复审后精确修正5行中文，英文未改。supported_languages 已启用 en、zh，默认语言仍为 en。没有改账号或其他租户。文章终审另将 coding 精确译为“喷码”，hygiene equipment 明确为“卫生用品生产设备”，保存后回读确认英文不变。

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

## 正式站验证

- 双语36个URL的HTTP、语言、公司名、canonical、hreflang、JSON-LD和禁用词审计通过；首页末尾斜杠按URL语义归一化比较。
- 正式中文18页双端均有浏览器文本与截图记录，无横向溢出或破图。每页均实际执行中文→英文→中文切换，核对详情路径、正文、页头、页脚、版权主体及导航链接语言。正式证据位于 output/playwright/live；本地预审位于 output/zh-review。
- 手机导航展开/关闭、分类筛选、第三项解决方案折叠内容，以及产品询价后中英文切换保持目标设备，均实测通过。
- 自动测试8项通过；ESLint无错误，原有 components/ui/use-toast.ts 存在1条未使用类型变量警告。
- 最终 pnpm build 通过，TypeScript 检查通过。
- 正式中文询价页验证码图片、输入框及刷新按钮已在真实浏览器检查；未解答或提交验证码、未生成测试询盘。实际切换保留 LZC-LPMS20 的产品 slug 和下拉框选择。
- 公司介绍主标题、简介、页脚全称及版权逐页一致；手机菜单和桌面/手机页脚导航点击后到达对应中文页面。
- 初次发布版本 732af38e1db395c1df82496a1e4983ce38d7cba8，Vercel 部署 dpl_51wbQcBHCxwSYX3fSspadJDAPFTj，READY 且正式域名别名正确。随后发布本记录及两处术语校正；最终 SHA 以工作台回读记录为准。
- 内置浏览器曾连续超时，备用 WebKit 完成桌面检查及前三个手机页面。重新建立控制会话后，内置浏览器页面读取约0.1秒、切换英文约1.6秒；完成其余15个手机页及询价/导航检查，控制台未见错误。未重启浏览器、修改代理或触碰 Chrome 登录环境；超时根因未确认，不宣称永久修复。
- 本次没有创建 v0 项目。客户源码和必要证据暂保留，最终清理尚未执行；依《交付前终审》清理授权门槛，不将上线授权扩大解释为目录外源码删除授权。
