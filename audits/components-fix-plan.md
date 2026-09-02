# @well-insight/ui 组件库修复任务手册

> 依据 `audits/components-audit.md`（2026-09-02）制定，覆盖报告全部 P0/P1/P2 发现。
> 每个任务自包含：含目标、涉及文件与行号、具体改法、验证命令、完成标准。
> 执行者无需重读审计报告即可动手；动手前仍应重读目标文件确认行号未漂移。

## 执行规则

1. **按阶段顺序执行**：Phase 0（基建）→ Phase 1（P0 修复）→ Phase 2（键盘/浮层）→ Phase 3（API 对齐）→ Phase 4（P2 打磨）→ Phase 5（终验）。
2. **同一阶段内任务互相独立**，可并行或指派给不同执行者；跨阶段依赖在每个任务的「依赖」字段注明。
3. **每完成一个任务**：运行该任务的验证命令；组件级任务至少运行 `pnpm vitest run src/components/<Name>` 与 `pnpm typecheck`。
4. **建议一个任务一个 commit**（conventional commits），便于审阅与回滚；未经要求不要 push。
5. **禁止事项**：不引入第二套 UI 库；样式禁止新增裸 `#hex`/`rgb()`；不改组件视觉 identity，只修复与对齐。
6. 仓库统一命令：
   - 单测：`pnpm vitest run <path>`
   - 类型：`pnpm typecheck`
   - Lint：`pnpm lint`
   - 裸色扫描：`pnpm check:colors`
   - 构建：`pnpm build`
7. 行号引用基准为 2026-09-02 的代码，若漂移以符号/类名为准重新定位。

## 全局约定（后续任务反复引用）

- **token 正典**：边框宽度一律 `var(--wi-border-width)`；禁用透明度一律 `var(--wi-opacity-disabled)`；动效一律 `var(--wi-motion-*)`；z-index 一律 `var(--wi-z-*)`。
- **severity 正典**：`primary / success / info / warning / danger / help / contrast`。`warn` 与 `error` 仅作运行时别名，集中在 `normalizeSeverity` 归一，新代码不得直接使用。
- **折叠双轨正典**：可折叠组件一律「受控 prop + `defaultXxx` 非受控初值 + `update:xxx` emit」。
- **字段族基线**：输入类组件应尽量具备 `label / invalid / errorMessage / helpText / size / disabled / readonly`（不适用的除外，需在文档说明）。
- **浮层正典**：Esc 可关（`closeOnEsc`）、外部点击可关（`closeOnOutsideClick`）、关闭后焦点返还触发器、z-index 走 `--wi-z-*`、定位走 shared flip/clamp。
- **图标管线正典**：菜单/按钮类组件的 `icon` 字段一律经 `resolveMenuIcon` + `WiIcon` 渲染，禁止 `{{ item.icon }}` 裸文本。

---

# Phase 0 — 基建与护栏（先行，防回归）

### T0.1 失效 CSS 变量扫描与修复
- 来源：P0-3、P1-14
- 目标：让"引用了从未定义的 `--wi-*` 变量"成为 CI 可拦截的错误。
- 改动点：
  1. 新建 `ai-design-config/scripts/check-undefined-tokens.mjs`：扫描 `src/**/*.css`，收集所有 `var(--wi-*)` 引用，与定义集（`src/theme/styles.css`、组件 `:root`/类内自定义属性、base.css）比对，报告未定义引用；`package.json` 加 `check:tokens` 脚本。
  2. 修复现有失效引用：
     - `--wi-space-5`：在 `src/theme/styles.css:61-66` 的 spacing 刻度中补 `--wi-space-5: 1.25rem`（介于 space-4=1rem 与 space-6=1.5rem 之间），同时在 `[data-wi-density="compact"]`（约 :120-140）与 `spacious`（约 :141-162）块补对应缩放值。受益方：`Card/styles.css:57`、`Panel/styles.css:57`、`Table/styles.css:406` 自动生效。
     - `--wi-menu-min-width`（`src/styles/base.css:257,431`）：在 `base.css` 或 theme 中补定义（建议 `--wi-menu-min-width: 12rem`），或删除引用改组件内定义。
- 验证：`node ai-design-config/scripts/check-undefined-tokens.mjs` 输出 0 个失效引用；`pnpm typecheck`。
- 完成标准：脚本存在且有 0 报告；Card `size="large"`、Table 空态 padding 实际生效。

### T0.2 共享 keyframes 上移，修复跨组件动画断裂
- 来源：P0-4
- 改动点：
  1. 将 `@keyframes wi-progress-spinner-rotate` 从 `src/components/ProgressSpinner/styles.css:20-24` 移到 `src/styles/base.css`（所有 style.ts 均已聚合 base.css）。
  2. 检查 `Switch/style.ts:1-3`、`ProgressBar/style.ts:1-4`、`AutoComplete/style.ts` 的聚合链，确认 base.css 在其依赖内；ProgressSpinner/styles.css 中删除原 keyframes（保留引用）。
  3. 检查其他 keyframes（如 `wi-select-spin`）是否有同类跨组件引用，一并处理。
- 验证：`pnpm vitest run src/components/Switch src/components/ProgressBar`；人工确认按需入口 `dist/switch/style.css` 产物包含 keyframes（`pnpm build` 后抽查）。
- 完成标准：单独引入 Switch/ProgressBar 时 loading 动画可转。

### T0.3 浮层定位 flip/clamp（shared）
- 来源：P0-14
- 改动点：
  1. `src/shared/overlayPlacement.ts:43-117`：计算 bottom 下发后检测视口溢出，空间不足时向上翻转（bottom→top）、横向 clamp 到视口内边距 8px。
  2. 为该模块补单测：模拟 `innerHeight`/锚点 rect，断言翻转与 clamp。
  3. 消费方无需改动即可受益：Select / AutoComplete / CascadeSelect / TreeSelect / DatePicker / Popover / Tooltip / ConfirmPopup / Menu popup / Menubar / MegaMenu。
- 依赖：无。
- 验证：`pnpm vitest run src/shared`；playground 中将 Select/Popover 贴视口底部人工确认翻转。
- 完成标准：所有共享该模块的浮层贴边不溢出。

### T0.4 共享键盘导航 composable `useMenuKeyboard`
- 来源：P0-13
- 改动点：
  1. 新建 `src/shared/useMenuKeyboard.ts`：roving tabindex 管理；`↑/↓`（或水平模式 `←/→`）移动高亮、`Home/End` 跳首尾、`Enter/Space` 激活、`Esc` 关闭并焦点返还触发器；跳过 disabled 项；可选 `aria-activedescendant` 输出。
  2. 参考实现以 Dropdown 现有键盘逻辑（`src/components/Dropdown/Dropdown.vue:118-146`）为基线抽取。
  3. 配套单测覆盖：方向循环、跳过 disabled、Esc 回调、焦点返还。
- 验证：`pnpm vitest run src/shared`。
- 完成标准：composable 可被任意菜单类组件一行接入。

### T0.5 severity 正典化
- 来源：P1-1
- 改动点：
  1. `src/shared/types.ts:12`：`WiToastSeverity` 等以 `warning`/`danger` 为正典，保留 `warn`/`error` 别名并标注 `@deprecated`。
  2. 确认/补齐 `normalizeSeverity` 作为唯一归一入口（当前 ProgressBar 在 `ProgressBar.vue:17-20` 手动映射，改为调用共享函数）。
  3. `Button/types.ts:5-13`：联合类型补 `'primary'`、`'warning'`，保留 `'warn'` 别名。
- 验证：`pnpm typecheck`；`pnpm vitest run src/components/ProgressBar src/components/Button`。
- 完成标准：全库 severity 字面量收敛，别名仅在一处归一。

### T0.6 文档-实现对账脚本
- 来源：P1-2
- 改动点：
  1. 新建 `ai-design-config/scripts/check-docs-drift.mjs`：解析各组件 `docs/index.md` 中声明的 Props/Emits/Slots 表，与 `types.ts` 的 props/emits、模板中的 `<slot>` 比对，输出漂移清单（先 warn 不 fail）。
  2. 修复存量漂移（实现优先或删文档，逐条按审计报告裁决）：
     - 插槽未实现：Select（docs/index.md:321-326）、AutoComplete（:99-104）、CascadeSelect（:95-100）、TreeSelect（:128-133）、Listbox（:54-58）、ToggleButton（:69-73）、DatePicker（:197-201 `trigger`）、TreeTable（:60-63 `expansion`）、Dock（docs:47-50）。**裁决：实现优先**——补 `value`/`option`/`empty`/`trigger` 等插槽（Select/CascadeSelect/TreeSelect 参考各自展示逻辑；Dock 补 default 插槽）。
     - 死 API 文档：Table `sortMode`（docs:271）——随 T1.10 一并处理。
     - Tree `node-select` 事件（docs:166-169）——裁决：实现该 emit（选中节点时抛出，与 update:selectedKeys 并存）。
- 验证：`node ai-design-config/scripts/check-docs-drift.mjs` 无新增漂移；`pnpm vitest run` 相关组件。
- 完成标准：存量漂移清零，脚本纳入 `pnpm lint` 前置或 CI。

---

# Phase 1 — P0 组件修复（互相独立）

### T1.1 Checkbox 暗色白勾 + Radio 白点
- 来源：P0-1
- 改动点：
  1. `Checkbox/styles.css:9`：`stroke: white` → `stroke: var(--wi-color-on-emphasis)`。
  2. `Checkbox.vue:70-72`：勾路径仅在 `checked || indeterminate` 时渲染（或用 opacity/scale 控制隐藏）。
  3. `Radio/styles.css:5`：`background: white` → `var(--wi-color-on-emphasis)`。
  4. 检查 `[data-theme="dark"]` 下 `--wi-color-on-emphasis` 是否需要暗色覆写（`theme/styles.css:191-220` 区域），如暗色下对比不足则在暗色块补覆写。
- 验证：`pnpm vitest run src/components/Checkbox src/components/Radio`；playground 暗色模式人工核对。
- 完成标准：暗色未选中态无漏勾；亮色视觉无回归。

### T1.2 ToggleButton 水平 padding 修复
- 来源：P0-2
- 改动点：`ToggleButton/styles.css:15,21,27` 三处 `var(--wi-button-padding-x-*)` 改为 `var(--wi-control-padding-x-*)`（全局已定义），或在 `.wi-togglebutton` 根补定义 `--wi-button-padding-x-*`（与 `Button/styles.css:1-8` 对齐）。
- 验证：`pnpm vitest run src/components/ToggleButton`；playground 三档尺寸目测。
- 完成标准：small/medium/large 水平内边距均生效。

### T1.3 Carousel `v-model:page` 受控修复
- 来源：P0-5
- 改动点：`Carousel/types.ts:1-10` 加 `page?: number`；`Carousel.vue:20` 的内部 ref 改为「受控优先、内部兜底」模式（参考 Switch/Input 的 v-model 写法），所有翻页路径统一 emit `update:page`。
- 验证：`pnpm vitest run src/components/Carousel` 补受控用例。
- 完成标准：父组件可双向绑定 page；非受控用法不回归。

### T1.4 Dock `position` 落地
- 来源：P0-9
- 改动点：`Dock/styles.css` 补 `.wi-dock--top` / `.wi-dock--bottom` 规则（`position: fixed`、左右居中、`z-index: var(--wi-z-overlay)`、安全间距 token），或裁决删除 prop 并修正 `Dock/types.ts:10` 与 `docs/index.md:41`。**建议实现**，文档已有示例。
- 验证：`pnpm vitest run src/components/Dock`；playground 两档位置目测。
- 完成标准：prop 有真实样式效果；文档与实现一致。

### T1.5 Stepper 状态样式 + marker 图标
- 来源：P0-10
- 改动点：
  1. `Stepper/styles.css:84-87`：补 `--finish`（主色描边/对勾底）、`--process`（主色填充+on-emphasis 字）、`--wait`（muted 文字）规则。
  2. `Stepper.vue:60`：finish 渲染 WiIcon 对勾、error 渲染警示图标，其余显示序号。
- 验证：`pnpm vitest run src/components/Stepper` 补状态断言。
- 完成标准：四态视觉可区分；无未定义类输出。

### T1.6 Chip severity 补齐
- 来源：P0-11
- 改动点：`Chip/styles.css:98-121` 补 `secondary`（text-muted 系）、`help`（--wi-color-help）、`contrast`（--wi-color-contrast*）三档，配色参照 `Tag/styles.css` 同档位做法。
- 验证：`pnpm vitest run src/components/Chip`。
- 完成标准：8 档 severity 全部有样式。

### T1.7 PickList 缺失样式与按钮禁用
- 来源：P0-12
- 改动点：
  1. `PickList/styles.css`：补 `.wi-picklist__item`（padding `--wi-space-2/3`、hover 底色 `color-mix(primary 10%, surface)`）、`.wi-picklist__item--selected`（主色 12% 底）、`.wi-picklist__btn`（复用按钮 token 或直接改用 WiButton 模板替换 `PickList.vue:96-110`）；`.wi-picklist__list` 补 `border: var(--wi-border-width) solid var(--wi-color-border)`（:27-30）；`:36` 的 `1.75rem` 改 flex 对齐。
  2. `PickList.vue:96-110`：4 个移动按钮按 `selectedSource/selectedTarget` 长度加 `:disabled`。
  3. 选中态按 `dataKey` 存储（`PickList.vue:17-18,31-36`）。
- 验证：`pnpm vitest run src/components/PickList` 补禁用与移动用例。
- 完成标准：列表可视、选中可见、空选择按钮禁用。

### T1.8 OrderList 选中样式与按钮禁用
- 来源：P0-12
- 改动点：`OrderList/styles.css` 补 `.wi-orderlist__item`（padding/border/hover）与 `.wi-orderlist__item--selected`（对齐 Tree 的 primary 12% 配方）；`OrderList.vue:107-112` 上下移按钮在无选中/越界时 `:disabled`。
- 验证：`pnpm vitest run src/components/OrderList`。
- 完成标准：选中态可见；按钮禁用正确。

### T1.9 InputNumber 输入草稿态
- 来源：P0-15
- 改动点：`InputNumber.vue:52-64,96`：输入中保留本地字符串草稿，仅在 blur/Enter/步进按钮时 parse+clamp+emit；输入过程非法中间态（`-`、`+`、`1.`）不打扰受控值。
- 验证：`pnpm vitest run src/components/InputNumber` 补「键入 -5、1.5」用例。
- 完成标准：可键入负数与小数；min/max clamp 仍生效。

### T1.10 Table 死代码清理与正确性修复
- 来源：P0-6、P0-7、P1-16
- 改动点：
  1. 删除零引用子组件：`TableButtonsPagination.vue`、`TablePaginationArrows.vue`、`TableRowsSelector.vue`、`TableMultipleSelectCheckBox.vue`、`TableSingleSelectCheckBox.vue`、`TableLoading.vue`（删除前全局 grep 二次确认无 import）。
  2. 死 API 裁决：`sortMode`/`filters`/`buttonsPagination`（`Table/types.ts:78,81,114,143,155`）——**建议实现 `sortMode: 'emit'`（只抛事件不内置排序）**，`filters` 实现受控筛选，`buttonsPagination` 若无产品需求则连文档（docs:271）一起删除。
  3. `expandedRowKeys` 接线：`useExpandableRow.ts:11,26` 改按 `rowKey` 管理集合，消费 prop/emit（`types.ts:117,154`）；`Table.vue:551-554` 翻页/排序时不再清空。
  4. 身份比较去 `JSON.stringify`：`usePageItems.ts:47-52,67-72`、`useTotalItems.ts:141`、`Table.vue:336-340` 统一改 `rowKey` 比较。
  5. 排序数值感知：`useTotalItems.ts:90-94,110-113` 比较前探测双方为 number 则数值比较；搜索 `:31` 的 `new RegExp` 改转义或 `String.includes`（不区分大小写）。
  6. 右冻结：`normalize.ts:14-15` 支持 `'right'`，`Table.vue:407-414` 生成 `right:` 定位，阴影用 `--wi-shadow-sticky-end`。
- 依赖：无（可分多个 PR 合入）。
- 验证：`pnpm vitest run src/components/Table` 全绿；补排序/筛选/展开/右冻结用例；`pnpm typecheck`。
- 完成标准：无死代码；数字排序正确；搜索输入 `[` 不抛异常；`v-model:expandedRowKeys` 可用。

### T1.11 TieredMenu popup 定位
- 来源：P0-8
- 依赖：T0.3
- 改动点：`TieredMenu.vue:1-67` popup 分支接入 `computeFloatingOverlayStyle`（参照 `Menu.vue:86-94` 用法），以触发元素为锚；`styles.css:16-25` 补 top/left 变量绑定。
- 验证：`pnpm vitest run src/components/TieredMenu`；按 docs:42-58 示例人工确认浮层落在按钮下方。
- 完成标准：popup 模式按锚点定位且支持翻转。

### T1.12 多选模式尺寸分档
- 来源：B 组共性
- 改动点：`Select/styles.css:39-45` 与 `TreeSelect/styles.css:53-58` 的 `.wi-select--multiple` min-height 改为按 `--small/--large` 修饰类分档（跟随 `--wi-control-height-*`）。
- 验证：`pnpm vitest run src/components/Select src/components/TreeSelect`；playground 三档尺寸+多选目测。
- 完成标准：多选模式下 small/large 生效。

### T1.13 TreeSelect 过滤框暗色 + InputOtp 默认档
- 来源：B/A 组
- 改动点：
  1. `TreeSelect/styles.css:81-89`：`.wi-treeselect__filter` 补 `background: var(--wi-color-surface); color: var(--wi-color-text)`。
  2. `InputOtp/styles.css:17-21,34-43`：默认（medium）档 height/width 改用 `--wi-control-height-medium`，large 档保持放大；删除与 `base.css:495-510` 重复的 focus-visible 定义（`:24-28`）。
- 验证：`pnpm vitest run src/components/TreeSelect src/components/InputOtp`；暗色模式目测。
- 完成标准：暗色过滤框可读；InputOtp 默认 34px 与全库一致。

---

# Phase 2 — 键盘与浮层行为（依赖 T0.3/T0.4）

### T2.1 CascadeSelect 键盘与初始路径
- 依赖：T0.3、T0.4
- 改动点：`CascadeSelect.vue:156-166` trigger 补 keydown（↓ 打开、Esc 关闭）；面板接入 useMenuKeyboard（列内 ↑↓、←→ 跨列、Enter 选中叶子）；`CascadeSelect.vue:76-79` 打开时按 modelValue 回溯父链设置初始 path；trigger 补 `aria-controls`/`aria-expanded`。
- 验证：`pnpm vitest run src/components/CascadeSelect` 补键盘用例。
- 完成标准：Esc 可关；键盘可完整操作；已选路径自动展开。

### T2.2 TreeSelect treeview 键盘
- 依赖：T0.4
- 改动点：`TreeSelect.vue:217-225` disabled 时 `tabindex=-1`；面板实现 WAI-ARIA treeview 键盘（← 折叠/→ 展开/↑↓ 移动/Home/End）+ Esc 关闭；`TreeSelect.vue:284-299` 过滤无匹配时渲染空态文案（locale）。
- 验证：`pnpm vitest run src/components/TreeSelect`。
- 完成标准：treeview 键盘模型完整；disabled 不可聚焦。

### T2.3 SplitButton / SpeedDial 浮层行为
- 依赖：T0.4
- 改动点：
  1. SplitButton：菜单挂 keydown（Esc/↑↓/Enter，参照 `Dropdown.vue:118-146`）；`SplitButton/styles.css:12-43` 补主按钮/触发器 hover 与 `:focus-visible { box-shadow: var(--wi-focus-shadow) }`；`types.ts` 补 `loading`、菜单项补 `icon`/`divider`（对齐 `Dropdown/types.ts:7-19`）。
  2. SpeedDial：`SpeedDial.vue:70-84` 补 document click 与 Esc 关闭；主按钮补 `aria-haspopup="menu"`；action 项按方向映射 Arrow 键；`SpeedDial/styles.css:91-107` 补 action hover/focus-visible；`SpeedDial.vue:113` 图标改 WiIcon。
- 验证：两组件测试补键盘/关闭用例。
- 完成标准：与 Dropdown 浮层行为对齐。

### T2.4 Menu / Menubar / MegaMenu 键盘统一
- 依赖：T0.4
- 改动点：
  1. Menu：`MenuNodes.vue:166-181` 叶子项改可聚焦（roving tabindex）；`Menu.vue:230-248` 挂 keydown；popup 模式 Esc 关闭；`MenuNodes.vue:100-104,128-135` 补 `aria-haspopup="menu"` 与选中项 `aria-current`。
  2. Menubar：`Menubar.vue:77-104` 补 ←→ 切顶级、↓ 打开、Esc；类型收窄或递归渲染子级（`Menubar.vue:144-159`），二选一并修文档。
  3. MegaMenu：补 `select` emit 与可选 `selectedKey`；Esc/方向键；`MegaMenu.vue:93` aria-haspopup 改 `'menu'`、`:81` aria-label 接 locale。
- 验证：三组件测试补键盘用例。
- 完成标准：组内键盘行为一致；Menu popup Esc 可关。

### T2.5 Listbox / SelectButton / OrderList roving tabindex
- 依赖：T0.4
- 改动点：Listbox（`Listbox.vue:67-77`）改 roving tabindex + ArrowUp/Down/Home/End，ul 补 `aria-label`；SelectButton（`SelectButton.vue:50-61`）组级 roving tabindex；OrderList（`OrderList.vue:116-133`）li 加 tabindex 与方向键移动。
- 验证：三组件测试补键盘用例。
- 完成标准：单 Tab 停靠 + 方向键导航。

### T2.6 Rating / Knob slider 语义完整化
- 改动点：
  1. Rating（`Rating.vue:61`）：实现 slider 键盘（←/→ 步进、Shift+方向半星、Home/End）+ `aria-label`/`aria-valuetext`；或裁决改 radiogroup 语义（二选一，建议保 slider 并补齐）。`cancel`/`allowClear`（`types.ts:6-9`）保留一个、另一个标 deprecated。
  2. Knob（`Knob.vue:112-120`）：补 `ariaLabel`/`ariaLabelledby` prop 与 `:aria-valuetext="displayValue"`；`types.ts:6` 的像素 `size` 改名 `diameter`（保留 size 兼容别名 + deprecated）。
- 验证：补键盘与 aria 断言用例。
- 完成标准：role=slider 组件键盘可操作、读屏可读。

### T2.7 DatePicker 日历键盘与 label 关联
- 改动点：`DatePicker.vue:316,318-331` 补 input id + label `:for`；`:383-400` 日历改 grid/gridcell 角色 + 方向键移动 + 单 Tab 停靠 + `aria-selected`；Esc 关闭后焦点回 input；`types.ts:41-44` 补 `show`/`hide`/`change` 事件与 `errorMessage`/`helpText`。
- 验证：`pnpm vitest run src/components/DatePicker`。
- 完成标准：label 点击聚焦输入框；日历纯键盘可选日期。

### T2.8 Tree / TreeTable treegrid 化
- 改动点：Tree：`TreeNodeItem.vue:60-70,87-99` 合并 toggler/label 为单焦点 + roving tabindex，补 `aria-level`/`aria-expanded` 与方向键；`Tree.vue:180-184` 懒加载改非突变（emit 或内部映射）+ 失败态；`Tree.vue:223-249` 补 `dragend` 清理；实现 `node-select` emit（见 T0.6）。TreeTable：`TreeTableRow.vue:33-39` 补 `aria-expanded`/`aria-level`，表格 `role="treegrid"`；`TreeTable.vue:12` 展开态支持 `v-model:expandedKeys`（对齐 Tree）。
- 验证：两组件测试补用例。
- 完成标准：树键盘模型可用；懒加载不突变 props。

### T2.9 Gallery / Carousel 交互完整化
- 改动点：Gallery（`Gallery.vue:56-67`）：补 roving tabindex + 方向键，或移除 listbox 角色降级按钮组（建议前者）；缩略图 `:focus-visible` 样式（`Gallery/styles.css:47-49`）；`images` 支持 `{ src, alt, caption }` 对象项。Carousel：触摸滑动（pointer events）、左右方向键、悬停/聚焦暂停 autoplay（`Carousel.vue:62-73`）；指示器 aria-label 改语义化（"第 x 页 / 共 n 页"，locale）；`Carousel/styles.css:37-49` 补 nav/indicator hover/focus-visible 与点击热区扩大（伪元素）。
- 验证：两组件测试补用例。
- 完成标准：键盘/触摸可用；autoplay 可被打断。

### T2.10 Inplace 与 ConfirmPopup 行为修正
- 改动点：Inplace（`Inplace.vue:40-44`）：补 `:aria-expanded`、`:aria-disabled`；提供 `closeOnEsc`/`dismissable`（外部点击关闭）选项；补 `open`/`close` emit（`types.ts:5-7`）。ConfirmPopup（`ConfirmPopup.vue:141-143`）：移除 `aria-modal` 或改非模态语义；关闭后焦点还原 target（`:93-112`）；`types.ts:7-25` 补 `acceptSeverity`。
- 验证：两组件测试补用例。
- 完成标准：aria 与行为一致；危险确认可标 danger。

### T2.11 其余浮层细节（Popover/Tooltip/BlockUI）
- 依赖：T0.3
- 改动点：Popover：`types.ts:15-28` 补 `disabled`；expose `show/hide/toggle`。Tooltip：`Tooltip.vue:103-124` 用 `useId()` 生成 id 并挂 `aria-describedby`；`Tooltip/styles.css:19` teleported 模式改 `white-space: normal`（否则 maxWidth 失效）。BlockUI：`BlockUI.vue:16-19` blocked 时内容区加 `inert`；overlay 加 Transition + `--wi-motion-enter/exit`；`styles.css:19` z-index 改组件变量。
- 验证：三组件测试。
- 完成标准：Tooltip 长文本正常换行；遮罩挡键盘。

---

# Phase 3 — API 与一致性

### T3.1 折叠双轨统一
- 依赖：无
- 改动点：Panel（`Panel.vue:19,30-35`）加 `defaultCollapsed` 非受控分支；Fieldset（`Fieldset.vue:7-9,16-19`）同；Accordion（`Accordion.vue:8-13,33-42`）加 `defaultValue`；三者复用同一 `useControllable` composable（如已有则对齐）；Panel 的 `collapsed`/`modelValue` 双 model 裁决保留一个（建议 collapsed，modelValue 标 deprecated）；Fieldset toggler 补 `aria-controls`（内容区加 id）。
- 验证：三组件测试补非受控用例。
- 完成标准：不传 v-model 时 toggleable 可用。

### T3.2 字段族基线补齐
- 改动点（按全局约定「字段族基线」逐项补 props + 模板 + 样式 + 文档）：
  - TreeSelect（`TreeSelect/types.ts:16-38`）：label/invalid/errorMessage/helpText。
  - AutoComplete（`types.ts:11-24`）：同上四件 + `emptyMessage`。
  - InputNumber（`types.ts:6-22`）：readonly/helpText/errorMessage。
  - InputOtp（`types.ts:3-13`）：invalid（+ 样式）。
  - InputTags（`types.ts:1-10`）：label/invalid/size（+ invalid 样式 `InputTags/styles.css`）。
  - InputColor（`types.ts:1-6`）：size/label/invalid（+ size 档位样式）。
  - Rating/Slider（`Rating/types.ts:1-12`、`Slider/types.ts:3-18`）：size/label/invalid。
  - Listbox（`Listbox/types.ts:9-15`）：size/invalid/emptyMessage；`listStyle` 类型放宽 `string | Record<string, string>`。
- 验证：各组件测试 + typecheck。
- 完成标准：表单页黄金样例中所有输入组件均可直接接 label/invalid。

### T3.3 三浮层 prop 对齐（Dialog/Drawer/ConfirmDialog）
- 改动点：统一为 `closable` / `closeOnEsc` / `closeOnOutsideClick` / `beforeClose` / `blockScroll`：
  - Drawer（`Drawer/types.ts:6-24`）：补 closeOnEsc（透传 `useModalOverlay`，`:60-67`）、closeOnOutsideClick（别名 dismissable）、beforeClose；事件补 `close`（`:27-32`）。
  - ConfirmDialog：`ConfirmDialog.vue:100` blockScroll 改 prop；补 `closeOnOutsideClick` 开关。
  - Dialog：`Dialog.vue:66-70` 移除内联 zIndex，改组件级 CSS 变量 `--wi-dialog-z`（默认 `var(--wi-z-overlay)`）；补 `ariaLabel` prop（`:180`）与 `close()`/`maximize()` expose。
- 验证：三组件测试；typecheck。
- 完成标准：同语义开关同名；z-index 不再内联硬编码。

### T3.4 菜单模型与图标管线统一
- 改动点：
  1. `src/shared/menu.ts`（如已有则扩展）：定义 `MenuItemBase { key, label, icon?, disabled?, items?, separator?, shortcut?, command? }`，Menu/Menubar/MegaMenu/TieredMenu/ContextMenu/Dropdown/SplitButton/SpeedDial/Dock/CommandMenu/Sidebar 的类型继承它（各组件保留扩展字段）。
  2. 图标渲染统一走 `resolveMenuIcon + WiIcon`：改造 Menubar（`Menubar.vue:124-127` 去裸文本回退）、MegaMenu（`MegaMenu.vue:96`）、Dock（`Dock.vue:30`，保留首字母兜底）、CommandMenu（`CommandMenu.vue:121`）、Sidebar（`Sidebar.vue:34`）、SpeedDial（`SpeedDial.vue:113`，随 T2.3）、ToggleButton（`ToggleButton.vue:44`）。
  3. ContextMenu 补 `shortcut` 渲染（`ContextMenu/types.ts:3-11`）。
- 验证：全菜单组件测试；typecheck。
- 完成标准：`{{ item.icon }}` 在全库绝迹（grep 验证）。

### T3.5 z-index 语义统一
- 改动点：
  1. Popover（`Popover/styles.css:69-78`）与 Tooltip（`Tooltip/styles.css:43-50`）：teleport 后从 `--wi-z-toast` 改 `--wi-z-dropdown`（或新增 `--wi-z-tooltip: calc(var(--wi-z-base) + 60)` 入 `theme/styles.css:50-57` 层级区）。
  2. CommandMenu 模态 backdrop：`CommandMenu/styles.css:11` 改 `--wi-z-overlay`。
  3. SplitButton/Dropdown/SpeedDial 非 teleport 与 teleport 层级统一（`SplitButton/styles.css:127,134`、`Dropdown/styles.css:28,42`、`SpeedDial/styles.css:31-44`）：统一用 overlay 系。
  4. Menu 的 `zIndex ?? 1000` 回退（`Menu.vue:92`）改 `var(--wi-z-base)` 语义。
- 验证：playground 组合场景（Toast + Popover 同开）目测层级。
- 完成标准：层级语义化，无双标准。

### T3.6 `useConfirm` 命令式 API
- 改动点：参照 `toast.ts`/`message.ts` 的 service 模式，新建 `src/components/ConfirmDialog/useConfirm.ts`：`useConfirm().require(options): Promise<boolean>`，内部动态渲染 ConfirmDialog（复用现有组件与 `WI_CONFIG_KEY` 挂载点）；文档与测试。
- 验证：`pnpm vitest run src/components/ConfirmDialog`。
- 完成标准：命令式确认可用，resolve true/false 语义清晰。

### T3.7 Toast / Message 对齐
- 改动点：
  1. 去重：`toast.ts:57-65`、`message.ts:47-57` add 前按 summary+detail 查重，命中则刷新 life（可选 `dedupe` 开关）。
  2. 悬停暂停：`toastState.ts:52-63` 与 messageState 支持 mouseenter 暂停、mouseleave 恢复剩余时间（`Toast.vue:75-99` 挂事件）。
  3. Toast `position` 补 `top`/`bottom` 居中档（`Toast/types.ts:10` 对齐 `Message/types.ts:10-16`）。
  4. Message 补受控 `messages` prop（`Message/types.ts:35-50`、`Message.vue:82`）。
  5. 配置 API 统一 `setDefaults`，Message 的 `config()`（`message.ts:69-72`）保留别名。
- 验证：两组件测试补去重/暂停用例。
- 完成标准：双服务能力对齐。

### T3.8 空态/加载态补齐
- 改动点：TreeTable、DataView（`DataView.vue:35-51`）、OrderList（`OrderList.vue:115-148`）、PickList、Tree 过滤结果：统一 `emptyMessage?: string` prop + `#empty` 插槽，默认走 locale 文案（参照 Table 的 `emptyText`/`#empty` 实现 `Table.vue:790-806`）；DataView 另补 `loading` prop 与遮罩。
- 验证：各组件测试。
- 完成标准：空数据渲染提示而非空白。

### T3.9 ConfigProvider 主题与副作用清理
- 改动点：
  1. `shared/config.ts:40-60`：`WiGlobalConfig` 加 `theme?: 'light' | 'dark' | 'system'`，在 `ConfigProvider.vue:66-72` 的 watchEffect 中调 `theme/index.ts:31` 的 `applyTheme` 落 `data-theme`（system 模式监听 matchMedia）。
  2. 同处 onBeforeUnmount 还原 `data-wi-density`、`--wi-z-base`、`data-theme` 内联副作用。
  3. `ConfigProvider.vue:80-86` 的 scoped style 与 `ConfigProvider/styles.css:2-4` 合并为一处。
- 验证：`pnpm vitest run src/components/ConfigProvider` 补 theme 用例。
- 完成标准：`<WiConfigProvider theme="dark">` 一行切暗色；卸载无残留。

### T3.10 尺寸与密度体系
- 改动点：
  1. `Button/types.ts:17,54`：`ButtonSize` 补 `'medium'`，legacy `sm/md/lg` 集中映射（保留兼容）。
  2. Avatar：`Avatar/types.ts:5` 词表对齐 `small/medium/large/xlarge`（`Avatar.vue:21-27` 补映射与 small 样式），保留旧值兼容。
  3. Menu：`Menu/styles.css:3` 的 `--wi-menu-item-height` 在密度块中缩放；`Menu.vue:184-189` 内联 px 缩进改 token 计算。
  4. IconField：`IconField/styles.css` 内置 `.wi-icon-field--left .wi-input__el { padding-left: var(--wi-control-affix-padding) }`（用 `theme/styles.css:58-60` 已备 token），图标偏移按尺寸档。
  5. Form：`Form/types.ts` 加 `size` prop 经 context 下发；`Form/styles.css:39` label 行高跟随。
  6. Checkbox/Radio：`base.css:224-229` 控件尺寸接密度变量。
- 验证：各组件测试；playground 三档密度目测。
- 完成标准：`data-wi-density` 切换时全控件高度/间距一致缩放。

### T3.11 路由集成
- 改动点：Menu：`Menu/types.ts:3-11` MenuItem 加 `to?: RouteLocationRaw`，`MenuNodes.vue` 渲染分支支持 RouterLink（或 expose item 插槽让业务自渲染）；Breadcrumb：`Breadcrumb.vue:29-33` 加 item 作用域插槽或 `as` prop；home 默认文案接 locale（`:14`）。
- 验证：两组件测试（mock router）。
- 完成标准：SPA 内点击不整页刷新。

### T3.12 事件面与 expose 补齐
- 改动点：输入族（Input `Input.vue:19-22`、Textarea `Textarea.vue:26-29`、InputNumber、InputPassword）补 `focus`/`blur`/`change` emit；expose 补 `focus()`/`blur()`/`select()`（对齐 `Input.vue:74-76`）；Inplace 补 open/close（随 T2.10）；MegaMenu 补 select（随 T2.4）；SpeedDial 补项点击 emit（`SpeedDial/types.ts:24-26`）；FileUpload 的 `change` 改为仅选择/状态迁移时触发（`FileUpload.vue:85-89,228`），`abort()` 补 emit（`:280-286`），`maxSize` 超限补 `exceed-size` 事件（`:134-137`）。
- 验证：各组件测试。
- 完成标准：表单校验库/埋点可直接订阅。

### T3.13 Form 能力补齐
- 改动点：`Form.vue:117` expose 补 `reset`/`resetFields`（恢复初始快照 + clearValidate）；`disabled` 经 context 透传控件或容器 `aria-disabled` + 抑制内部 tabindex（`Form/types.ts:60`、`Form/styles.css:20-23`）；FormItem 校验触发允许控件 inject context 主动 notify（`FormItem.vue:119`）。
- 验证：`pnpm vitest run src/components/Form`。
- 完成标准：reset 可用；Form 级 disabled 键盘不可穿透。

### T3.14 半受控修复（DataView / Terminal）
- 改动点：DataView：`DataView.vue:12,26-30` 补 `v-model:page`，数据追加不强制回第 1 页；`:52-58` 透传 Pagination 的 page-sizes/show-size-picker/disabled；补 `#header` 插槽（`types.ts:1-8`）。Terminal：`Terminal.vue:16-27` 补受控 `lines`/`responses` 数据通道（命令结果可回显）；↑/↓ 命令历史；`role="application"` 改 `role="log"`（`:32`）。
- 验证：两组件测试。
- 完成标准：page 可控；Terminal 可展示完整会话。

---

# Phase 4 — P2 打磨（批量，可按文件并行）

### T4.1 边框宽度 token 化
- 改动点：以下位置 `1px solid` → `var(--wi-border-width) solid`：Card（`styles.css:3,17,23`）、Panel、Fieldset（`styles.css:4`）、Tabs（`styles.css:23,42,61`，其中 2px 指示条保留）、Toolbar（`styles.css:5`）、Divider（`styles.css:14,30,35,56,67,73`）、Input（`styles.css:112`）、Terminal（`styles.css:9,32`）、InputGroup（`styles.css:13`）、FileUpload（`styles.css:49`）、Button（`styles.css:26`）、Slider thumb（`Slider/styles.css:67-68`）。
- 验证：`pnpm check:colors` + grep `border: 1px` 残留为 0；相关组件测试。
- 完成标准：全局边框宽度可经 `--wi-border-width` 一处覆写。

### T4.2 禁用透明度统一
- 改动点：Menu（`styles.css:315-319` 的 0.45）、Dialog（`styles.css:186-188` 的 0.5）、Form（`styles.css:4,21` 的 0.65 自定义变量删除）、ProgressSpinner（`styles.css:53` 的 0.45）、DatePicker（`styles.css:197` 的 0.4）全部改 `var(--wi-opacity-disabled)`。
- 验证：grep `opacity: 0.` 逐一裁决；相关测试。
- 完成标准：禁用透明度唯一来源。

### T4.3 动效 token 化与减动效
- 改动点：
  1. 硬编码时长改 token：Skeleton（`styles.css:14` 1.4s）、ProgressSpinner（`styles.css:4,13` 1s/1.5s）、Badge（`styles.css:131-133` 1.2s）、Icon（`styles.css:30-37` 0.8s）、Switch（`styles.css:99` 0.8s）、Button（`styles.css:641` 700ms）、Select（`styles.css:63` 0.7s）、AutoComplete（`styles.css:130` 0.8s）、Menu（`styles.css:263-267,281-282` 0.2s）、Scrollbar（`styles.css:89,92` 340ms/120ms）。
  2. 无限动画（spinner/skeleton wave/pulse）补 `@media (prefers-reduced-motion: reduce)` 与 `[data-wi-motion="none"]` 下的停转/降速规则（可在 base.css 集中一段）。
  3. 补缺失过渡：Gallery 主图切换、Carousel 翻页、ScrollTop 出现/消失（`ScrollTop/styles.css:16,29-31`）、BlockUI 遮罩、Panel/Fieldset/Accordion 展开收起（v-show 改 Transition + `--wi-motion-*`）；Menu 展开动画从 max-height 改 grid-template-rows 方案。
- 验证：`data-wi-motion="none"` 下全库无动画（playground 人工）；`prefers-reduced-motion` 模拟。
- 完成标准：动效全部可经主题开关调控。

### T4.4 hover / focus-visible 补齐清单
- 改动点（统一配方：hover 底色 `color-mix(in srgb, var(--wi-color-primary) 10%, var(--wi-color-surface))` 或 fill-light；focus-visible `box-shadow: var(--wi-focus-shadow)`）：
  - SplitButton 主按钮/触发器（T2.3 已含则跳过）、SpeedDial action（同上）、FileUpload choose/clear（`styles.css:17-33`，或直接换 WiButton 一并解决）、Pagination 页码（`Pagination/styles.css`，补 `:hover:not(:disabled):not(--active)`）、Dock（`styles.css:20-31`）、MegaMenu（禁用+focus）、Sidebar（`styles.css:28-46` focus-visible + disabled）、Breadcrumb 链接（`styles.css:28-30`）、Gallery 缩略图、ScrollTop hover（`--wi-color-primary-hover`）、Listbox option、DatePicker 日格、Menubar subitem（`styles.css:80-103`）、Drawer 关闭按钮（`styles.css:106-116` 对齐 Dialog）、Tag close 按钮 hover（`styles.css:126-129`）、Checkbox/Radio hover（`base.css:218-249`）。
- 验证：playground 键盘 Tab 走查（焦点全程可见）。
- 完成标准：可交互元素无"零反馈"状态。

### T4.5 ARIA 补强清单
- 改动点：
  - Tooltip `aria-describedby`（随 T2.11）；Tabs tab↔panel 关联（`Tabs.vue:110-116,157` 补 aria-controls/labelledby，DOM id 改内部 uid）；BlockUI/ProgressSpinner 包裹模式 `inert`/`aria-busy`；Divider `role="separator"` 恒设置（`Divider.vue:29` 逻辑修正）；Toolbar 补 `ariaLabel` prop（`Toolbar/types.ts:2`）；MeterGroup 补 `aria-valuenow`（`MeterGroup.vue:26`）；InputPassword 强度补 `role="meter"`（`InputPassword.vue:222-229`）；Slider 补 `aria-valuetext`（`Slider.vue:116-126`）；group 命名：CheckboxGroup（`CheckboxGroup.vue:36-41`）/RadioGroup（`RadioGroup.vue:30-34`）/InputOtp（`InputOtp.vue:111`）/SelectButton（`SelectButton.vue:48`）补 label/aria-label；InputColor 文本框（`InputColor.vue:49-57`）与 InputTags 输入框（`InputTags.vue:109-118`）补可访问名；Card 标题层级 `headingLevel` prop（`Card.vue:33`）；Switch 无 label 时 dev warn（`Switch.vue:63`）。
- 验证：相关组件测试补 aria 断言。
- 完成标准：交互组件均具备可访问名与正确关联。

### T4.6 样式回收 base.css + 死代码清理
- 改动点：
  1. Menubar 选中态（`base.css:380-385`）收回 `Menubar/styles.css`。
  2. ContextMenu 子菜单/图标/箭头（`base.css:95-129`）收回 `ContextMenu/styles.css`，`z-index: 1` 裸值改 token。
  3. 死选择器 `.wi-menu__item--selected`（`base.css:380`）删除（Menu 实际用 `__item-content--selected`）。
  4. ConfigProvider scoped 双轨合并（随 T3.9）。
  5. Accordion 重复规则合并（`Accordion/styles.css:11-23,50-56`）；ConfirmPopup 重复规则合并（`styles.css:18-22,30-34`）。
- 验证：各组件测试；grep 死选择器为 0。
- 完成标准：组件样式单文件可读，base.css 只留真正全局规则。

### T4.7 零散裸值与布局细节
- 改动点：Slider tooltip/marks 定位抽组件变量（`Slider/styles.css:122-135`）；Rating 星尺寸/内距（`Rating/styles.css:15-18`）接 size prop；Tag small 档 `0.65rem` 入刻度（`Tag/styles.css:80-82`）；LayoutSider 触发器魔法值收敛 `--wi-layout-trigger-*`（`Layout/styles.css:319-322,341-356`）；Grid/Flex gap 支持 token 名映射（`shared/gap.ts:22-31`、`Grid.vue:110-119`）；`Fluid/styles.css:3-7` 去掉对子元素 `width:100%` 强压；`Space/styles.css:8-10` wrapItem 改 `display: block; max-width: 100%`；Stepper 补步骤连接线；InputPassword `right: 2.1rem` 改 affix token 计算（`InputPassword/styles.css:121-123`）；Splitter `max: '99999px'` 改 Infinity 语义（`Splitter.vue:47`）并修 `resizeTriggerSize` 被 `flex: 0 0 6px` 架空问题（`Splitter/styles.css:35,41-49`）；Tabs 滚动步长按可视宽度比例（`Tabs.vue:97,141`）；Timeline 尺寸抽 token（`Timeline/styles.css:14,46-53`）；Tree/TreeSelect/TreeTable 缩进统一 `--wi-tree-indent` 系 token；TreeTable 表头复用 `--wi-table-header-bg`（`TreeTable/styles.css:20`）；DataView 网格 `minmax(10rem,1fr)` 抽 `--wi-dataview-grid-min`。
- 验证：相关组件测试 + playground 目测。
- 完成标准：魔法值清零或全部有名。

### T4.8 测试加固
- 改动点：Knob（键盘步进/clamp/disabled）、Inplace（键盘激活/disabled/插槽 close）、TreeTable（展开/受控）、Carousel（受控 page/触摸/暂停）、新行为（useMenuKeyboard、overlayPlacement flip、useConfirm、Toast 去重）全部补用例；目标：薄弱组件从 2 条提到 ≥6 条核心路径用例。
- 验证：`pnpm test` 全绿；覆盖率报告抽查。
- 完成标准：新增行为均有断言守护。

---

# Phase 5 — 最终验收

1. `pnpm test` 全绿。
2. `pnpm typecheck` 无错。
3. `pnpm lint` 无新增告警。
4. `pnpm check:colors` 通过。
5. `node ai-design-config/scripts/check-undefined-tokens.mjs` 0 报告（T0.1）。
6. `node ai-design-config/scripts/check-docs-drift.mjs` 0 漂移（T0.6）。
7. `pnpm build` 成功，抽查按需入口样式产物（如 `dist/switch/style.css` 含 keyframes）。
8. playground 人工走查：亮色/暗色 × comfortable/compact/spacious × `data-wi-motion="full|reduced|none"` 组合下核心页面（表单、表格、弹窗、菜单）无破版。
9. 更新 `CHANGELOG.md`：列出 breaking 别名（`warn`/`error` deprecated、Knob `size`→`diameter`、Avatar 尺寸词表、Panel `modelValue` deprecated）。

---

# 附：任务总览与依赖图

| 任务 | 名称 | 阶段 | 依赖 | 影响面 | 规模 |
| --- | --- | --- | --- | --- | --- |
| T0.1 | 失效 token 扫描与修复 | 0 | - | Card/Panel/Table/base.css/theme | 小 |
| T0.2 | keyframes 上移 | 0 | - | Switch/ProgressBar/AutoComplete | 小 |
| T0.3 | overlayPlacement flip/clamp | 0 | - | 全部浮层（~10 组件） | 中 |
| T0.4 | useMenuKeyboard | 0 | - | 全部菜单/列表（~10 组件） | 中 |
| T0.5 | severity 正典 | 0 | - | Button/Tag/Message/Toast/ProgressBar/Badge/Chip/Timeline | 中 |
| T0.6 | docs 对账 + 存量漂移 | 0 | - | 9+ 组件文档 | 中 |
| T1.1 | Checkbox/Radio 暗色 | 1 | - | Checkbox/Radio | 小 |
| T1.2 | ToggleButton padding | 1 | - | ToggleButton | 小 |
| T1.3 | Carousel page 受控 | 1 | - | Carousel | 小 |
| T1.4 | Dock position | 1 | - | Dock | 小 |
| T1.5 | Stepper 状态样式 | 1 | - | Stepper | 小 |
| T1.6 | Chip severity | 1 | - | Chip | 小 |
| T1.7 | PickList 样式 | 1 | - | PickList | 小 |
| T1.8 | OrderList 样式 | 1 | - | OrderList | 小 |
| T1.9 | InputNumber 草稿 | 1 | - | InputNumber | 中 |
| T1.10 | Table 死代码与正确性 | 1 | - | Table | 大 |
| T1.11 | TieredMenu 定位 | 1 | T0.3 | TieredMenu | 小 |
| T1.12 | 多选尺寸分档 | 1 | - | Select/TreeSelect | 小 |
| T1.13 | TreeSelect 过滤框/InputOtp 档位 | 1 | - | TreeSelect/InputOtp | 小 |
| T2.1 | CascadeSelect 键盘 | 2 | T0.3/T0.4 | CascadeSelect | 中 |
| T2.2 | TreeSelect 键盘 | 2 | T0.4 | TreeSelect | 中 |
| T2.3 | SplitButton/SpeedDial 浮层 | 2 | T0.4 | SplitButton/SpeedDial | 中 |
| T2.4 | Menu/Menubar/MegaMenu 键盘 | 2 | T0.4 | 三组件 | 大 |
| T2.5 | Listbox/SelectButton/OrderList 键盘 | 2 | T0.4 | 三组件 | 中 |
| T2.6 | Rating/Knob slider 语义 | 2 | - | Rating/Knob | 中 |
| T2.7 | DatePicker 键盘 | 2 | - | DatePicker | 中 |
| T2.8 | Tree/TreeTable treegrid | 2 | - | Tree/TreeTable | 大 |
| T2.9 | Gallery/Carousel 交互 | 2 | - | Gallery/Carousel | 中 |
| T2.10 | Inplace/ConfirmPopup | 2 | - | Inplace/ConfirmPopup | 小 |
| T2.11 | Popover/Tooltip/BlockUI | 2 | T0.3 | 三组件 | 小 |
| T3.1 | 折叠双轨 | 3 | - | Panel/Fieldset/Accordion | 中 |
| T3.2 | 字段族基线 | 3 | - | 8 个输入组件 | 大 |
| T3.3 | 三浮层 prop 对齐 | 3 | - | Dialog/Drawer/ConfirmDialog | 中 |
| T3.4 | 菜单模型统一 | 3 | T2.3/T2.4 | 11 个菜单类组件 | 大 |
| T3.5 | z-index 语义 | 3 | - | Popover/Tooltip/CommandMenu 等 | 小 |
| T3.6 | useConfirm | 3 | - | ConfirmDialog | 中 |
| T3.7 | Toast/Message 对齐 | 3 | - | Toast/Message | 中 |
| T3.8 | 空态补齐 | 3 | - | TreeTable/DataView/OrderList/PickList/Tree | 中 |
| T3.9 | ConfigProvider theme | 3 | - | ConfigProvider/theme | 中 |
| T3.10 | 尺寸密度体系 | 3 | - | Button/Avatar/Menu/IconField/Form/Checkbox/Radio | 大 |
| T3.11 | 路由集成 | 3 | - | Menu/Breadcrumb | 中 |
| T3.12 | 事件面补齐 | 3 | - | 输入族/FileUpload 等 | 中 |
| T3.13 | Form 能力补齐 | 3 | - | Form | 中 |
| T3.14 | DataView/Terminal 半受控 | 3 | - | DataView/Terminal | 中 |
| T4.1 | 边框 token 化 | 4 | T0.1 | 12 组件 | 小 |
| T4.2 | 禁用透明度统一 | 4 | - | 5 组件 | 小 |
| T4.3 | 动效 token 化 | 4 | - | 13 组件 | 中 |
| T4.4 | hover/focus 补齐 | 4 | T2.3 | 16 组件 | 中 |
| T4.5 | ARIA 补强 | 4 | 多数 P2 任务 | 14 组件 | 中 |
| T4.6 | base.css 回收 | 4 | T3.9 | Menubar/ContextMenu/base.css | 小 |
| T4.7 | 裸值清零 | 4 | - | 15 组件 | 中 |
| T4.8 | 测试加固 | 4 | 全部 | 全库 | 中 |

**依赖关系说明**：T0.3/T0.4 是关键路径（解锁 Phase 1 的 T1.11 与整个 Phase 2）；T0.1 解锁 T4.1；T3.4 依赖 T2.3/T2.4 的图标改造；T4.5 依赖涉及组件的行为任务先行（避免重复改同一文件产生冲突）。同文件只被一个任务修改是并行的安全边界；上表中影响面重叠的任务（如 T2.3 与 T4.4 都碰 SplitButton/styles.css）已用依赖标注串行。

**冲突回避规则**：若两个任务必须改同一文件，按表中序号小的先合并；执行前 `git status` 确认工作区干净，逐任务提交。
