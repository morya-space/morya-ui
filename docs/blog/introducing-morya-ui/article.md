# 开源 Vue 3 组件库 Morya UI：把组件、文档、AI 工具链一起做进一个包

![封面：Morya UI](./assets/cover.png)

做 Vue 3 项目，常见三件麻烦事：组件够用但主题难统一、文档和真实 API 对不上、交给 AI 写页面它总「发明」不存在的 props。

**Morya UI**（npm：`morya-ui`）的做法是把组件、设计令牌、可交互文档、AI 可检索的知识一起塞进一个包。这篇文章用官方文档站和一个真实搭出来的演示项目 **morya-admin** 来说明它到底能干什么。

- 文档站：<https://morya-space.github.io/morya-ui/>
- GitHub：<https://github.com/morya-space/morya-ui>
- npm：[`morya-ui`](https://www.npmjs.com/package/morya-ui)
- 演示后台：<https://github.com/morya-space/morya-admin>
- 许可证：MIT

![文档站首页](./assets/01-docs-home.png)

> 配图来自文档站与本地 `morya-admin` 截图。上一篇：[别手搓了，搓也搓不过 Agent](../dont-handcraft-agent-wins/article.md)。

---

## Morya UI 是什么？

**Morya UI** 是一套开源的 Vue 3 组件库，当前 **v0.4.3**，组件目录 107 个。

装一个包能拿到什么：统一视觉的控件、亮暗主题、密度和动效开关、可在线预览的文档。如果你用 Cursor 或 VS Code 这类支持 MCP 的编辑器，还能让 Agent 直接查官方文档，按真实 API 写页面。

| 场景 | 为什么合适 |
| --- | --- |
| Web 应用 / SaaS 产品 | 表单、浮层、反馈、导航、主题、密度一套齐 |
| 中后台 / 运营平台 | Layout、Page、Table、筛选区、Dialog 一条龙 |
| 内容 / 展示型站点 | Carousel、Gallery、Image、Tour、Watermark、Timeline 这类组件都有 |
| 内部工具 | 快速铺页面，视觉不靠个人发挥 |
| 想让 AI 写页面 | setup + Skill + MCP，减少「臆造 prop」 |

组件覆盖面是通用的，不挑业务类型。想换品牌气质就改 `--m-*` token 和字体，不用换库。

![组件目录](./assets/02-components-catalog.png)

---

## 它和别的组件库差在哪？

同类库不少。Morya UI 真正不同的地方是几条成体系的能力，不是某个按钮长什么样。

### 1. 组件齐全，按业务场景覆盖

基础、表单、导航、数据展示、布局、反馈都有。从布局壳、表格筛选、表单浮层到消息反馈，常用的不用东拼西凑。

单个组件页把说明、可交互预览、API 放在一起。Button 的 `type` / `color` / `variant` 直接点着看：

![Button 组件文档与实时预览](./assets/04-button-preview.png)

文档站还有 Table、Layout 等更重的组件页可对照：

![Table 文档预览](./assets/05-table-preview.png)

![Layout 文档](./assets/06-layout-shell.png)

### 2. 设计令牌驱动的主题系统（`--m-*`）

颜色、间距、圆角都走 CSS 变量。亮暗主题、密度（`useDensity`）、动效强度（`useMotion`）同包导出。局部可以用 `MConfigProvider` 覆盖，品牌色改 `--m-color-primary` 一类 token，不用在业务里到处写死 hex。

![主题文档](./assets/03-theme-docs.png)

![设计令牌文档](./assets/09-tokens.png)

业务项目里可以跑配套的 `check:colors` 脚本拦截裸 hex/rgb，逼着团队走设计系统，不能写「看起来差不多」的色值。暗色模式下同一套组件的可读性也保持住了：

![暗色主题下的组件预览](./assets/03-theme-dark.png)

### 3. TypeScript 优先 + 多种接入方式

Composition API + 完整 Props / Emits / locale 类型。接入方式包括：

- 全量 `app.use(MoryaUI)`
- 具名导入
- 子路径按需（如 `morya-ui/button`）
- `unplugin-vue-components` + `MoryaUIResolver`

还提供 `@morya-ui/nuxt`，以及 Nuxt / Astro / Vite SSR 指南，适合不只做 SPA 的团队。

### 4. 文档即预览

每个组件自带 Markdown 和可交互 `vue preview`，文档站本身就是最好的样板间。支持中英切换、⌘K 搜索、暗色模式，组件页还带章节目录，适合一边对照 API 一边抄写法。

### 5. AI 原生工具链：Skill + MCP + 一键 setup

大部分组件库谈到 AI 时停在一句口号上，Morya UI 把「查真实文档、拼页面、校验用法」直接做成了可调用的协议。

| 包 | 作用 |
| --- | --- |
| `morya-ui` | 组件、样式、主题、locale |
| `@morya-ui/mcp` | MCP 服务：组件 API、示例、页面配方、`validate_usage` / `validate_page` |
| `@morya-ui/setup` | 一键给业务项目装库、样式、`DESIGN.md`、Agent Skill、Cursor 规则、多编辑器 MCP |

![Agent MCP 文档](./assets/08-mcp.png)

![一键接入文档](./assets/08-ai-setup.png)

推荐工作流：

1. `recommend_page` / `map_reference` 定页面结构
2. `get_page_snippet` 拿区块片段拼装
3. `get_component` / `get_example` 查真实 API，禁止瞎编 prop
4. `validate_usage` + `validate_page` 做契约校验

对 Cursor 这类支持 Agent 的编辑器来说，相当于给组件库装了「官方知识库 + 质检闸」。黄金样例列表页可以直接对照块顺序：

![黄金样例列表页](./assets/07-golden-list.png)

---

## 五分钟上手

需要 Vue 3（推荐 3.5+），构建工具能解析 package `exports` 即可（Vite、webpack 5+）。

```bash
pnpm add morya-ui
# npm i morya-ui
```

### 全量注册（上手最快）

```ts
import MoryaUI from 'morya-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App).use(MoryaUI).mount('#app')
```

模板里直接写 `<MButton>`、`<MInput>`。

### 按需子路径（体积敏感）

```ts
import { MButton } from 'morya-ui/button'
import { MInput } from 'morya-ui/input'
```

子路径会自动带上主题与依赖样式。

### 应用级默认（语言、尺寸等）

```ts
import { createMoryaUI, zhCN } from 'morya-ui'

createApp(App).use(createMoryaUI({ locale: zhCN })).mount('#app')
```

若希望「装库 + AI 配置」一步到位，在业务项目根目录：

```bash
npx @morya-ui/setup
# 或只升级 AI / MCP：
npx @morya-ui/setup ai
```

更多细节见文档：[快速上手](https://morya-space.github.io/morya-ui/docs/quick-start)、[一键接入](https://morya-space.github.io/morya-ui/docs/setup)。

---

## 案例：morya-admin

光看组件还不够。**morya-admin** 是用 `morya-ui` 搭出来的中后台演示，登录、工作台、系统管理（用户/角色/菜单/部门/字典/参数）、业务订单与商品、日志、异常页、主题与布局设置都有，一套中后台骨架基本齐了。

仓库：<https://github.com/morya-space/morya-admin>

技术栈很干净：Vue 3 + Vite + TypeScript + Vue Router + `morya-ui`（当前依赖 `morya-ui ^0.4.3`，即本文对应的最新版）。接口层是 mock，本地能跑通体验。

### 1. 登录页

分栏登录、记住我、暗色切换，表单和按钮直接用库内组件，视觉和文档站是同一套 token。

![morya-admin 登录页](./assets/10-admin-login.png)

试用账号提示写得很清楚：`admin` 全权限、`ops` 偏业务权限，密码任意非空即可登录，方便演示 RBAC。

### 2. 工作台

`MLayout` 系列布局、侧栏菜单、顶栏工具、多标签、统计指标、时间线，拼成完整的 dashboard。

![morya-admin 工作台](./assets/11-admin-dashboard.png)

### 3. 列表页范式

用户管理是典型 CRUD 列表：搜索、状态下拉、高级筛选、新建、行内编辑/删除、状态 Tag、分页器。中后台大部分页面都是这个形状。

![用户管理列表](./assets/12-admin-users.png)

订单管理用的是同一套业务列表范式，说明组件库不只能做系统管理页。

![订单管理列表](./assets/13-admin-orders.png)

### 4. 布局与主题

顶栏进布局设置，配合亮暗切换、密度等开关。主题系统不是文档里的概念，是产品里能拨的开关。

![布局设置抽屉](./assets/14-admin-settings.png)

### 这个案例想说明什么

组件够用了：登录、壳层、表单、表格、反馈、空错页都覆盖了，不用再混一套 UI。视觉也一致：`--m-*` token 加统一组件皮肤，后台不会一页一个风格。

开发路径也短。Vite 脚手架加 `morya-ui` 就能搭出可演示的中后台；接上 `@morya-ui/setup` 和 MCP，列表和表单页可以让 Agent 按配方生成，再人工补业务逻辑。

权限指令、动态菜单、多 Tab 是业务层的事，但交互表面还是落在 `M*` 组件上。以后换接口或接真实后端，UI 层不用推倒重来。

---

## 适合谁用？

做 Vue 3 项目的团队都可以试。组件覆盖通用场景，从 Web 应用、SaaS 产品、中后台到内容站都够用。如果再加上这几条里的任意一条，收益会更明显：希望主题、密度、动效可控，不让业务侧乱写色值；想统一团队的视觉语言，不靠个人发挥；已经在用 Cursor 等 AI 编辑器，希望组件库能被 Agent 正确调用。

也有几件事建议先想清楚：

- 库在 0.x 阶段，发版节奏快。跨 0.y 升级建议先看 [CHANGELOG](https://github.com/morya-space/morya-ui/blob/main/CHANGELOG.md)，0.3 升到 0.4 就有 Button `type`/`color` × `variant` 双轴 API、语义色 `severity` 统一为 `type` 等破坏性变更
- 图表（工作台的折线、环图）还是要业务侧自绘或接图表库，Morya UI 管的是控件和布局
- AI 工具链是加分项，不是必选项，日常只装 `morya-ui` 完全够用

---

## 小结

Morya UI 把组件、设计令牌、可交互文档、AI 工具链放进了一个包，让你能从「装组件」一路走到「让 Agent 按官方文档写页面」：100+ 个 `M*` 控件走 ESM 和按需加载，`--m-*` 令牌管亮暗、密度、动效，文档站里每个组件都能点着看，`@morya-ui/mcp` 和 `@morya-ui/setup` 把组件 API、页面配方、用法校验喂给编辑器里的 Agent，morya-admin 证明这条路能跑通一个完整项目。

正在选 Vue 3 组件库，或者想给团队补一条「文档 + Agent 可复用」的工程化路径的话，可以按这个顺序试一下：

1. 打开 [文档站](https://morya-space.github.io/morya-ui/) 翻几个组件预览
2. clone [morya-admin](https://github.com/morya-space/morya-admin) 本地 `pnpm i && pnpm dev` 点一遍
3. 在自己的业务仓跑一次 `npx @morya-ui/setup`，看看「装库 + AI 配置」是什么体验

欢迎 Star、提 Issue，也可以直接拿 morya-admin 当脚手架骨架改成自己的项目。

---

**参考链接**

- 文档站：https://morya-space.github.io/morya-ui/
- 组件库：https://github.com/morya-space/morya-ui
- npm：https://www.npmjs.com/package/morya-ui
- MCP：https://www.npmjs.com/package/@morya-ui/mcp
- Setup：https://www.npmjs.com/package/@morya-ui/setup
- morya-admin：https://github.com/morya-space/morya-admin
