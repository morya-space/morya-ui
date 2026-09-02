# @well-insight/ui 组件库全局检查报告

- 审计日期：2026-09-02
- 审计范围：`src/components/` 下全部 **88 个组件**，逐组件检查
- 审计方式：只读源码审计（未修改任何产品源码），每条结论附 `文件:行号` 证据
- 评判基准：`src/theme/styles.css`（`--wi-*` token 体系、暗色 `[data-theme="dark"]`、密度 `[data-wi-density]`、动效 `[data-wi-motion]`）、`ai-design-config/DESIGN.md` 设计规则、库内 `Wi*` API 约定

---

## 一、总体结论

**整体质量良好**：绝大多数组件具备完整的 `types.ts` / 主组件 / `styles.css` / `index.ts` / 中英文档 / 单元测试；`style.ts` 统一为 CSS 聚合导入（非 CSS-in-JS 双轨分叉）；颜色面 token 化程度高，全库未发现裸 `#hex`/`rgb()` 滥用。

**主要短板集中在六个方面**：

1. **文档与实现漂移**：10+ 个组件的 docs 声明了不存在的插槽/事件/prop，个别组件输出没有样式落地的"死类"。
2. **键盘与 Esc 支持参差**：多个浮层组件（CascadeSelect、TreeSelect、SplitButton、SpeedDial、Menu、Menubar、MegaMenu、TieredMenu）无任何键盘处理，违反设计红线"浮层可 Esc 关闭"。
3. **浮层定位基建缺失**：`src/shared/overlayPlacement.ts` 无视口碰撞翻转/clamp，所有下拉类组件贴边溢出。
4. **失效 token 与死代码**：`--wi-space-5`、`--wi-menu-min-width` 等被引用但从未定义；Table 有一组死 API 与 6 个零引用子组件。
5. **命名与状态管理不统一**：`warning`/`warn`、`error`/`danger` 并存；折叠态有的受控有的双 model；Table/PickList/OrderList 用索引或 `JSON.stringify` 做行身份。
6. **动效体系空转**：`--wi-motion-*` 与 reduced-motion 机制已在主题层就位，但多个组件动画时长硬编码、无限动画不减动效。

质量标杆组件（可作为全库对齐参照）：**Input、Textarea、InputPassword、Switch、Dropdown、Dialog、Toast、ContextMenu、Tag**。

---

## 二、全局共性问题（按优先级）

### P0 — 功能缺陷 / 明显错误（建议优先修复）

| # | 问题 | 证据 | 建议 |
| --- | --- | --- | --- |
| P0-1 | Checkbox 暗色主题下未选中框也显示白勾 | `Checkbox/styles.css:9` `stroke: white` 硬编码 + `Checkbox.vue:70-72` 勾路径恒渲染；暗色底 `#0f172a`（`theme/styles.css:195`）上白勾可见 | 勾色改 `var(--wi-color-on-emphasis)`，且仅在 checked/indeterminate 时渲染 |
| P0-2 | ToggleButton 水平 padding 失效 | `ToggleButton/styles.css:15,21,27` 引用 `--wi-button-padding-x-*`，但该 token 仅定义在 `.wi-button`/`.wi-selectbutton` 根上 | 在 `.wi-togglebutton` 根补定义或改用 `--wi-control-padding-x-*` |
| P0-3 | 引用未定义 token `--wi-space-5`，padding 静默回退 | `Card/styles.css:57`、`Panel/styles.css:57`、`Table/styles.css:406`；`theme/styles.css:61-66` 只定义 space-1/2/3/4/6/8 | 主题补 `--wi-space-5` 或改用 space-4/6；建议加"未定义 CSS 变量引用"扫描脚本 |
| P0-4 | 跨组件 keyframes 依赖断裂：单独引入时动画静止 | `Switch/styles.css:99`、`ProgressBar/styles.css:92-95` 引用 `wi-progress-spinner-rotate`，但各自 `style.ts` 未导入 `ProgressSpinner/styles.css` | 共享 keyframes 上移到 base.css，或 style.ts 显式补依赖导入 |
| P0-5 | Carousel `v-model:page` 断裂：有 emit 无 prop | `Carousel/types.ts:12-14` 声明 `update:page`，但 props（`types.ts:1-10`）无 `page`，`Carousel.vue:20` 仅内部 ref | 补 `page?: number` 受控支持 |
| P0-6 | Table 死 API 成组 + 展开态不可受控 | `sortMode`（`types.ts:78`）、`filters`（`types.ts:81/143/155`）、`buttonsPagination`（`types.ts:114`）无消费逻辑；`expandedRowKeys` 声明未接线，展开按行索引管理（`useExpandableRow.ts:11`），翻页即丢 | 实现或删除死 API；按 `rowKey` 管理展开集合 |
| P0-7 | Table 排序/搜索正确性缺陷 | `useTotalItems.ts:90-94` 一律 `String(...)` 字典序（数字列 "10"<"2"）；`:31` `new RegExp(searchValue)` 未转义，输入 `[` 即抛异常 | 数值感知比较 + 搜索转义/改 `includes` |
| P0-8 | TieredMenu popup 模式完全无定位，文档示例实际落在视口原点 | `TieredMenu.vue:1-67` 无定位逻辑；`styles.css:16-25` 只有 position/z-index；`docs/index.md:42-58` 仍给出 popup 示例 | 复用 `shared/overlayPlacement` |
| P0-9 | Dock `position` prop 无实现（有类无样式） | `Dock/types.ts:10` 声明 top/bottom，`styles.css:1-46` 无任何位置规则 | 补位置样式或删 prop 修文档 |
| P0-10 | Stepper 输出未定义的状态类 | `Stepper.vue:53` 输出 `--finish/--process/--wait`，`styles.css:84-87` 仅 `--error` 有规则 | 补三态样式 |
| P0-11 | Chip 三档 severity 有类型无样式 | `Chip/types.ts:4` 含 secondary/help/contrast，`styles.css:98-121` 只实现五档 | 补齐样式或收窄类型 |
| P0-12 | PickList 列表项/按钮样式整体缺失；OrderList 选中态无样式 | `PickList/styles.css` 全文 7 条规则，无 `__item`/`__item--selected`/`__btn`（模板均引用）；`OrderList.vue:121` 输出 `--selected` 类但 styles.css 无规则 | 补齐缺失选择器 |
| P0-13 | 多个浮层组件无 Esc/键盘（违反设计红线） | CascadeSelect（`CascadeSelect.vue:156-166` 无 keydown）、TreeSelect（`TreeSelect.vue:223` 声明 haspopup 无键盘）、SplitButton（全文无 keydown）、SpeedDial（`SpeedDial.vue:70-84` 仅 resize/scroll）、Menu/Menubar/MegaMenu/TieredMenu 同 | 抽共享 `useMenuKeyboard`（roving tabindex + 方向键 + Esc），各浮层统一接入 |
| P0-14 | 所有浮层定位无视口碰撞翻转 | `src/shared/overlayPlacement.ts:43-117` 纯几何计算无 flip/clamp；Select/AutoComplete/CascadeSelect/TreeSelect/DatePicker/Popover/Tooltip/ConfirmPopup/ContextMenu 全部共用 | 在 shared 层补 flip/clamp 一次，全库受益 |
| P0-15 | InputNumber 中间输入态被清空，无法键入负数/小数 | `InputNumber.vue:52-64,96` 输入 `-`/`.` 即 emit null，受控回写打断输入 | 输入中保留本地草稿，blur/Enter 时 clamp+emit |

### P1 — 一致性与能力补齐

| # | 问题 | 涉及组件 | 建议 |
| --- | --- | --- | --- |
| P1-1 | severity 词汇分裂：`warning` vs `warn`、`error` vs `danger` | Button 用 `warn` 且类型缺 `primary`（`Button/types.ts:5-13`）；Toast/Message 用 `error`（`shared/types.ts:12`）；ProgressBar 手动 `error→danger` 映射（`ProgressBar.vue:17-20`） | 以 `warning`/`danger` 为正典，别名集中在 `normalizeSeverity` 处理 |
| P1-2 | 文档与实现漂移成系统性风险 | Select/AutoComplete/CascadeSelect/TreeSelect/Listbox/ToggleButton/DatePicker docs 声明未实现的插槽；Table（`sortMode`）、TreeTable（`expansion` 插槽）、Tree（`node-select` 事件）、Dock（default 插槽）文档失实 | 建立 docs 与 `types.ts` 对账检查（可脚本化纳入 CI） |
| P1-3 | 折叠状态管理三轨并存 | LayoutSider 有 `defaultCollapsed` 非受控；Panel 有 `collapsed`+`modelValue` 双 model 纯受控；Fieldset 仅受控 `collapsed`；Accordion 纯受控 `modelValue`——不传 v-model 时 toggleable 完全无效 | 统一"受控 + `defaultXxx` 非受控"双轨，复用同一 composable |
| P1-4 | 字段族 API 覆盖参差 | `label`/`helpText`/`errorMessage`/`invalid`/`readonly` 仅 Input/Textarea/InputPassword 齐全；TreeSelect/AutoComplete/InputNumber/InputOtp/InputTags/InputColor/Rating/Slider/Knob 各有缺失；Knob 的 `size` 是像素语义 | 定义"表单字段基线 API"清单逐组件对齐 |
| P1-5 | 菜单项模型与图标渲染三条路线 | Menu/ContextMenu 走 resolveMenuIcon+WiIcon；Menubar 裸文本回退；MegaMenu/Dock/CommandMenu/Sidebar/SpeedDial/ToggleButton 直接 `{{ icon }}` 裸文本；模型字段（key/icon/separator/shortcut）各组件不一 | 在 shared 定义统一 `MenuItemBase` 与唯一图标渲染管线 |
| P1-6 | 空态/加载态仅 Table 齐备 | TreeTable、DataView、OrderList、PickList、Tree、VirtualScroller 均无空态（违反"空态需 emptyMessage/#empty"设计规则） | 逐组件补 `emptyMessage`/`#empty` |
| P1-7 | 行身份管理不健壮 | Table 选择/展开用 `JSON.stringify` 深比较（`usePageItems.ts:47-52`、`useExpandableRow.ts:26`）；PickList/OrderList 按索引存选中 | 统一 `rowKey`/`dataKey` 语义 |
| P1-8 | z-index 层级双标准 + 语义错位 | 非 teleport 用 `--wi-z-popper(40)`、teleport 用 `--wi-z-overlay`（SplitButton/Dropdown/SpeedDial）；Popover/Tooltip teleport 后用 `--wi-z-toast` 会压住 Toast；CommandMenu 模态 backdrop 误用 `--wi-z-popper`（`CommandMenu/styles.css:11`） | 统一 overlay 层级语义；新增 `--wi-z-tooltip`；CommandMenu 遮罩 ≥ `--wi-z-overlay` |
| P1-9 | 三浮层 prop 命名不对齐 | Dialog（`closable`/`closeOnEsc`/`closeOnOutsideClick`/`beforeClose`）vs Drawer（`showCloseIcon`/`dismissable`，无 closeOnEsc/beforeClose）vs ConfirmDialog（blockScroll 写死） | 统一为 `closable`+`closeOnEsc`+`closeOnOutsideClick`+`beforeClose` |
| P1-10 | 缺 `useConfirm` 命令式 API | 全库无 useConfirm（`useToast`/`useMessage` 已有先例） | 提供 `useConfirm().require({...}): Promise<boolean>` |
| P1-11 | Toast/Message 无去重与悬停暂停 | `toast.ts:57-65`、`message.ts:47-57` 直接 push；无 mouseenter 暂停 | 补 dedupe 策略与悬停暂停 |
| P1-12 | 事件面普遍过窄 | 输入类几乎只 emit `update:modelValue`(+`clear`)，缺 focus/blur/change；Inplace 无 open/close；InputTags 无 add/remove；MegaMenu 无任何 emit | 按基线补全，提升校验库/埋点集成能力 |
| P1-13 | ConfigProvider 能力缺口 | 无 `theme` prop（theme 模块已有 `applyTheme`/`useTheme` 但未接入）；卸载后 `data-wi-density`/`--wi-z-base` 内联残留（`ConfigProvider.vue:66-72`） | 加 `theme?: 'light'|'dark'|'system'`；onBeforeUnmount 还原副作用 |
| P1-14 | 组件样式寄生 base.css 且夹带死代码 | Menubar 选中态（`base.css:380-385`）、ContextMenu 子菜单/图标（`base.css:95-129`，含 `z-index:1` 裸值）；死选择器 `.wi-menu__item--selected`（`base.css:380`）；悬空 `--wi-menu-min-width`（`base.css:257/431`） | 样式收回组件 styles.css，清理死代码 |
| P1-15 | Tree 懒加载就地突变 prop 节点 | `Tree.vue:180-184` `node.children = children`，无失败态 | 改 emit/内部映射 + error 处理 |
| P1-16 | Table 6 个零引用子组件 | TableButtonsPagination/TablePaginationArrows/TableRowsSelector/TableMultipleSelectCheckBox/TableSingleSelectCheckBox/TableLoading 全局无 import | 删除或接入模板 |
| P1-17 | 尺寸/密度体系断层 | `ButtonSize` 类型缺 `'medium'` 却兼容 legacy `sm/md/lg`；Avatar 用 `normal/large/xlarge` 独一套；Rating/InputColor 无 size 档；InputOtp 默认档错用 large 高度；Select/TreeSelect 多选锁死 medium；Menu 项高定值不随密度 | 全库统一 `small/medium/large` + 密度变量接入 |

### P2 — 打磨项（样式细节与体验）

- **裸值 token 化**：`border: 1px` 未走 `--wi-border-width`（Card/Panel/Fieldset/Tabs/Toolbar/Divider/Input/Terminal/InputGroup/FileUpload 等约 10 处）；禁用透明度 `0.45`（Menu）/`0.5`（Dialog）/`0.65`（Form）/`0.55`(token) 多值并存，应统一 `var(--wi-opacity-disabled)`；零散 rem/px（Slider tooltip 定位、Rating 1.25rem、Tag 0.65rem、LayoutSider 触发器魔法值等）。
- **动效接入**：Skeleton wave(1.4s)、ProgressSpinner(1s/1.5s)、Badge processing(1.2s)、Icon spin(0.8s)、Switch spinner(0.8s)、Button spinner(700ms)、Menu 展开(0.2s)、Scrollbar(340ms/120ms) 全部硬编码秒数，`prefers-reduced-motion`/`[data-wi-motion="none"]` 管不到 keyframes；Gallery/Carousel/ScrollTop/BlockUI/折叠面板（Panel/Fieldset/Accordion）切换零过渡。
- **hover/focus-visible 补齐**：SplitButton 主按钮、SpeedDial action、FileUpload choose/clear、Pagination 页码、Dock/MegaMenu/Sidebar/Breadcrumb/Gallery 缩略图、ScrollTop、Listbox option、DatePicker 日格等缺 hover 或焦点环。
- **ARIA 补强**：Rating/Knob 的 `role="slider"` 缺可访问名；Tree/TreeTable 有 role 无键盘模型与 `aria-level`；Tabs 的 tab↔panel 无 aria 关联；Tooltip 缺 `aria-describedby`；BlockUI/ProgressSpinner 遮罩只挡鼠标不挡键盘（建议 `inert`）；Divider 的 `role="separator"` 逻辑反置（`Divider.vue:29`）。
- **测试薄弱组件**：Knob、Inplace（各 2 条）、TreeTable（2 条）等键盘/拖拽路径无断言。

---

## 三、分组详版

### A. 基础输入类（12 个：Input / InputNumber / InputPassword / InputOtp / InputTags / InputColor / Textarea / Rating / Slider / Knob / Switch / Inplace）

#### Input
- 状态摘要：文件齐全，6 条测试，中英文档；API 含 label/helpText/errorMessage/invalid/clearable/showCount，ARIA 较完整。**组内标杆**。
- 功能：
  - 事件面过窄，只有 `update:modelValue`/`clear` ｜ `Input/Input.vue:19-22` ｜ 补 `focus`/`blur`/`change`。
  - expose 仅 `focus`，缺 `blur`/`select` ｜ `Input/Input.vue:74-76` ｜ 与原生 input 对齐。
  - `readonly` 仅透传属性无视觉态 ｜ `Input/Input.vue:103`（styles.css 无 `:read-only` 规则）｜ 增加弱化背景/光标样式。
- 样式：
  - 边框硬编码 `1px` ｜ `Input/styles.css:112` ｜ 改 `var(--wi-border-width)`。

#### InputNumber
- 状态摘要：文件齐全，4 条测试，中英文档；含 min/max/step/precision/showButtons/buttonPlacement/clearable。
- 功能：
  - **中间输入态被清空（P0-15）**：输入 `-`/`.` 即 emit null，受控回写导致无法键入负数/小数 ｜ `InputNumber.vue:52-64,96` ｜ 输入中保留本地草稿，blur/Enter 时 clamp+emit。
  - 缺 `readonly`/`helpText`/`errorMessage`，与 Input 族不一致 ｜ `InputNumber/types.ts:6-22` ｜ 补齐三件套。
  - 未 expose `focus`/`blur` ｜ `InputNumber.vue` 全文无 defineExpose（对比 `Input/Input.vue:76`）。
- 样式：
  - 默认宽度 `--wi-inputnumber-width: 8rem` 硬编码，不随尺寸/密度变化 ｜ `InputNumber/styles.css:18,40` ｜ 按比例变量化。

#### InputPassword
- 状态摘要：文件齐全，8 条测试；toggleMask/showPasswordOn/强度反馈/自定义图标，ARIA 较好。**组内标杆**。
- 功能：
  - `autocomplete="current-password"` 硬编码，外部 attrs 无法覆盖为 `new-password` ｜ `InputPassword.vue:187` ｜ 改 prop（默认 current-password）或挪入 `v-bind="attrs"` 之前。
  - 未 expose `focus()`，与 Input 不一致 ｜ `InputPassword.vue:168-170`。
  - `readonly` 时显隐切换按钮仍可点，只读态可泄露明文 ｜ `InputPassword.vue:206` ｜ readonly 时禁用/隐藏 toggle。
  - 强度反馈仅文本+颜色，无语义化表达 ｜ `InputPassword.vue:222-229` ｜ 加 `role="meter"`/`aria-valuenow`。
- 样式：
  - 清除按钮偏移硬编码 `right: 2.1rem` ｜ `InputPassword/styles.css:121-123` ｜ 统一用 `--wi-control-affix-*` 计算（同文件 82-92 行已有范例）。

#### InputOtp
- 状态摘要：文件齐全，4 条测试；length/mask/integerOnly/gap，键盘与粘贴处理完整。
- 功能：
  - `inputmode="text"` 硬编码，`integerOnly` 时移动端不弹数字键盘 ｜ `InputOtp.vue:118` ｜ `:inputmode="integerOnly ? 'numeric' : 'text'"`。
  - `role="group"` 无可访问名 ｜ `InputOtp.vue:111` ｜ 加 aria-label（locale）。
  - 无 `invalid` prop 无法表达校验失败 ｜ `InputOtp/types.ts:3-13` ｜ 补 invalid 与样式。
- 样式：
  - **默认尺寸错配**：medium 档直接用 `--wi-control-height-large`，与同族控件（medium=34px）不一致 ｜ `InputOtp/styles.css:17-21,34-43` ｜ 基准改 medium 档。
  - focus-visible 双处定义且颜色不一致 ｜ `InputOtp/styles.css:24-28` vs `base.css:495-510` ｜ 删一处统一走 base.css。

#### InputTags
- 状态摘要：文件齐全，3 条测试；separator/addOnBlur/max/去重。
- 功能：
  - 输入框无可访问名（无 label prop，placeholder 在有 tag 后被清空）｜ `InputTags.vue:109-118` ｜ 加 label prop 或 aria-label。
  - 重复 tag 静默丢弃无事件 ｜ `InputTags.vue:30-33` ｜ 增加 `tag-reject`/`add`/`remove`。
  - remove 按钮 aria-label 不含 tag 文本（所有删除按钮同名）｜ `InputTags.vue:102` ｜ locale 格式化带入 tag 值。
- 样式：
  - 无 invalid 态样式（组件与 base.css 组选择器均未覆盖）｜ `InputTags/styles.css:1-62`、`base.css:513-517` ｜ 补 `--invalid` 边框/danger focus 环。

#### InputColor
- 状态摘要：文件齐全，3 条测试；原生 color + 文本框 + swatches。
- 功能：
  - 文本输入框无可访问名 ｜ `InputColor.vue:49-57` ｜ 加 aria-label。
  - 非法 modelValue 静默回退 `#000000`，文本框仍显示非法值且无 invalid 反馈 ｜ `InputColor.vue:16-19` ｜ 补 invalid + 校验失败事件。
  - 字段族 API 缺失：无 size/label/readonly/format ｜ `InputColor/types.ts:1-6`。
  - swatch 无当前选中态 ｜ `InputColor.vue:60-69` ｜ 加 `aria-pressed` 与高亮环。
- 样式：
  - 仅 medium 一档尺寸，密度仅间接生效 ｜ `InputColor/styles.css:14-35` ｜ 接 size 三档或密度缩放 swatch。
  - 预设色块无 hover/选中样式 ｜ `InputColor/styles.css:55-66`。

#### Textarea
- 状态摘要：文件齐全，4 条测试；autosize/resize/clearable/showCount 完整。**组内标杆**。
- 功能：
  - 事件面仅 `update:modelValue`/`clear` ｜ `Textarea.vue:26-29` ｜ 补 focus/blur/change。
  - expose 仅 `focus` ｜ `Textarea.vue:126-129` ｜ 补 blur/select。
  - `readonly` 无视觉态 ｜ `Textarea.vue:161`。
- 样式：
  - 最小高度私有常量（6rem/4.5rem/7.5rem）不随密度缩放 ｜ `Textarea/styles.css:1-9,26-41` ｜ 以 `--wi-control-height-*` 倍数表达。

#### Rating
- 状态摘要：文件齐全，4 条测试；stars/cancel/allowHalf。
- 功能：
  - **`role="slider"` 但完全无键盘支持**，缺 `aria-valuetext`/可访问名 ｜ `Rating.vue:61`，全文无 keydown ｜ 实现 slider 键盘语义或改 radiogroup 语义。
  - 半星只能鼠标按点击位置判定，键盘不可达 ｜ `Rating.vue:43-52`。
  - `readonly` 直接落 `disabled`，星值对焦点不可感知 ｜ `Rating.vue:82,70` ｜ 用 `aria-readonly`+保留焦点。
  - `cancel` 与 `allowClear` 双 prop 同义冗余 ｜ `Rating/types.ts:6-9` ｜ 保留一个。
- 样式：
  - 星尺寸 `1.25rem`、内距 `0.15rem` 硬编码，无 size 变体 ｜ `Rating/styles.css:15-18` ｜ 接 size prop。
  - 半星遮罩切换无过渡 ｜ `Rating/styles.css:55-75` ｜ 加 `transition: width var(--wi-motion-fast)`。

#### Slider
- 状态摘要：文件齐全，4 条测试；range/marks/tooltip/vertical，复用原生 range input。
- 功能：
  - range 两手柄交叉时直接改写另一侧值 ｜ `Slider.vue:72-75` ｜ 改 push/clamp，提供 `minDistance`。
  - range 的起/止 aria 名称固定走 locale，调用方无法定制 ｜ `Slider/types.ts:16-17` ｜ 支持 `ariaLabels: [string, string]`。
  - tooltip 值未映射 `aria-valuetext` ｜ `Slider.vue:116-126`。
  - marks 越界值不裁剪，百分比溢出轨道 ｜ `Slider.vue:33-47`。
- 样式：
  - tooltip/marks 定位硬编码 ｜ `Slider/styles.css:122-135` ｜ 抽组件级 CSS 变量。
  - thumb `border: 2px solid` 未走 token ｜ `Slider/styles.css:67-68,80-81` ｜ 用 `--wi-border-width` 派生、`--wi-radius-full`。

#### Knob
- 状态摘要：文件齐全，仅 2 条测试（偏薄）；SVG 圆环，指针拖拽+键盘+pointer capture 完整。
- 功能：
  - **`role="slider"` 无可访问名**，连 ariaLabel prop 都没有 ｜ `Knob.vue:112-120` ｜ 必须补 `ariaLabel`/`ariaLabelledby`。
  - `valueTemplate` 只影响视觉文本，未同步 `aria-valuetext` ｜ `Knob.vue:37-39`。
  - `size` 是像素 number，与全库 `size: small/medium/large` 语义冲突 ｜ `Knob/types.ts:6` vs `shared/types.ts:16` ｜ 改名 `diameter` 或文档显著标注。
  - 测试仅 2 条，键盘/拖拽无断言 ｜ `Knob.test.ts`。
- 样式：
  - `stroke-width="8"` 与 `radius = size/2 - 8` 魔法数耦合，小尺寸穿帮 ｜ `Knob.vue:33,134,143` ｜ 抽 `strokeWidth` prop 或按比例。
  - 圆形旋钮 focus-visible 用方形 box-shadow 环 ｜ `Knob/styles.css:42-45` ｜ 容器加 `border-radius: var(--wi-radius-full)`。

#### Switch
- 状态摘要：文件齐全，4 条测试；role=switch/aria-checked/aria-busy/loading 锁定/尺寸三档。**组内标杆**。
- 功能：
  - 无 `trueValue`/`falseValue` 自定义值能力 ｜ `Switch/types.ts:12`、`Switch.vue:34-37` ｜ 对齐 Checkbox 族。
  - 无 label 且无插槽内容时无可访问名，类型层不约束 ｜ `Switch.vue:63` ｜ dev 环境 warn 或支持 `ariaLabel`。
- 样式：
  - **spinner keyframes 跨组件依赖断裂（P0-4）** ｜ `Switch/styles.css:99` 引用 `wi-progress-spinner-rotate`，`Switch/style.ts:1-3` 未导入 ProgressSpinner/styles.css ｜ 单独引入时 loading 永不旋转。
  - `0.8s linear infinite` 不响应 `[data-wi-motion="none"]` ｜ `Switch/styles.css:99`。
  - 状态文字 `0.65rem`、内距 `0.35rem` 硬编码 ｜ `Switch/styles.css:91-95` ｜ 用 `--wi-font-size-xs`。
  - `--wi-switch-checked-offset` 固定 rem，密度切换时 thumb 终点可能偏位 ｜ `Switch/styles.css:5-9,21,41` ｜ 用 calc 推导。

#### Inplace
- 状态摘要：文件齐全，仅 2 条测试；display/content 双插槽 + expose activate/deactivate。
- 功能：
  - `role="button"` 缺 `aria-expanded`，disabled 无 `aria-disabled` ｜ `Inplace.vue:40-44`。
  - 打开态只能经插槽 `close()` 关闭，无 Esc/外部点击路径 ｜ `Inplace.vue:22-31,46-51` ｜ 提供 `closeOnEsc`/`dismissable`。
  - 无 open/close 事件钩子 ｜ `Inplace/types.ts:5-7`。
  - 测试仅 2 条。
- 样式：token 化良好；display/content 切换无过渡（可复用 `base.css:131-139` 的 `wi-fade`）。

**A 组共性**：① 字段族 API 覆盖参差（label/helpText/errorMessage/invalid/size）；② 事件面普遍过窄；③ 自绘控件 ARIA 短板（Rating/Knob/InputOtp/InputTags/InputColor）；④ 硬编码尺寸残留（2.1rem/1.25rem/0.65rem 等）；⑤ 共享 keyframes 跨组件导入遗漏。

---

### B. 选择器类（10 个：Select / AutoComplete / CascadeSelect / TreeSelect / Listbox / Checkbox / Radio / SelectButton / ToggleButton / DatePicker）

#### Select
- 状态摘要：文件齐全，13 条测试，中英双档；token 使用规范。
- 功能：
  - **文档承诺的插槽未实现** ｜ `Select/docs/index.md:321-326` 声明 `value`/`option` 插槽，`Select.vue:313-472` 全文无 `<slot>` ｜ 补插槽或删文档。
  - combobox ARIA 不完整：高亮项仅视觉 class，无 `aria-activedescendant` ｜ `Select.vue:340,430-431`。
  - 浮层无碰撞翻转 ｜ `Select/types.ts:56`、`shared/overlayPlacement.ts:90-95`。
  - 无虚拟滚动/分组/expose ｜ `Select/types.ts:9-13`；无 `defineExpose`（对比 `Input/Input.vue:76`）。
- 样式：
  - 多选模式锁死 medium 高度（同优先级且靠后覆盖 small/large）｜ `Select/styles.css:39-45` ｜ 按尺寸分档。
  - selected 态仅加粗无底色，与 hover 难区分 ｜ `Select/styles.css:186-189` vs `base.css:380-385` ｜ 加主色淡底。
  - loading 动画 0.7s 硬编码 ｜ `Select/styles.css:63`。

#### AutoComplete
- 状态摘要：文件齐全，4 条测试；styles.css 全 token 化。
- 功能：
  - Tab 离开不收面板（仅 document click，无 blur）｜ `AutoComplete.vue:134-139,177-190`。
  - combobox 缺 `aria-controls`/`aria-activedescendant` ｜ `AutoComplete.vue:180,215-220`。
  - 无空结果反馈（无匹配时静默关闭）｜ `AutoComplete.vue:171` ｜ 对齐 Select `emptyMessage`。
  - 字段能力弱于 Select：无 `label`/`invalid`/`errorMessage`/`helpText`；文档插槽未实现 ｜ `AutoComplete/types.ts:11-24`、`docs/index.md:99-104`。
- 样式：
  - 下拉按钮 focus/focus-visible 显式 `outline: none; box-shadow: none`，键盘焦点不可见 ｜ `AutoComplete/styles.css:83-89` ｜ focus-visible 给 `var(--wi-focus-shadow)`。
  - spinner 0.8s 硬编码 ｜ `AutoComplete/styles.css:130`。

#### CascadeSelect
- 状态摘要：文件齐全，5 条测试。
- 功能：
  - **完全无键盘支持、Esc 不可关（P0-13）** ｜ `CascadeSelect.vue:156-166` 仅 click；关闭仅 document click（104-108）｜ 补 Esc/方向键/跨列导航 + `aria-controls`。
  - 打开不回溯已选路径（每次 `path = [options]`）｜ `CascadeSelect.vue:76-79` ｜ 按 modelValue 计算初始 path。
  - 事件面窄于 Select（仅 update/clear）｜ `CascadeSelect/types.ts:35-38`。
  - 文档插槽未实现；显示值只有叶子 label ｜ `docs/index.md:95-100`、`CascadeSelect.vue:49-51` ｜ 参考 TreeSelect `showPath`。
- 样式：
  - 面板宽度=触发器宽度导致多列挤压 ｜ `CascadeSelect.vue:70-71`、`styles.css:90,101-108` ｜ 面板 `width: max-content`、列设 min-width。
  - invalid+focus 用主色环而非 danger 环 ｜ `base.css:494-501` vs `base.css:299-304`（Select 用 `--wi-focus-shadow-danger`）。
  - 选中与 hover 同色无区分 ｜ `CascadeSelect/styles.css:130-133`。

#### TreeSelect
- 状态摘要：文件齐全（含 TreeSelectNodeItem.vue），5+3 条测试。
- 功能：
  - disabled 触发器仍可聚焦（`tabindex="0"` 写死）｜ `TreeSelect.vue:217-225` ｜ `:tabindex="disabled ? -1 : 0"`。
  - **面板无键盘/Esc（P0-13）** ｜ `TreeSelect.vue:223` 声明 `aria-haspopup="tree"` 但无 keydown ｜ 实现 treeview 键盘模型 + Esc。
  - 字段能力缺失：无 label/invalid/errorMessage/helpText ｜ `TreeSelect/types.ts:16-38`。
  - 过滤无空态、文档插槽未实现 ｜ `TreeSelect.vue:284-299`、`docs/index.md:128-133`。
- 样式：
  - **过滤输入框暗色破版**：未设 background/color ｜ `TreeSelect/styles.css:81-89`（对比 `Select/styles.css:122-127` 均设）｜ 补 `background: var(--wi-color-surface); color: var(--wi-color-text)`。
  - 多选模式锁死 medium 高度 ｜ `TreeSelect/styles.css:53-58`。
  - 缩进硬编码内联 rem ｜ `TreeSelectNodeItem.vue:33` ｜ 抽 `--wi-treeselect-indent`。

#### Listbox
- 状态摘要：86 行精简实现，3 条测试。
- 功能：
  - 无方向键导航/roving tabindex（每个 option 独立可 Tab）｜ `Listbox.vue:67-77` ｜ roving tabindex + ArrowUp/Down/Home/End。
  - API 面最窄：无 size/invalid/emptyMessage；`listStyle` 为裸 string ｜ `Listbox/types.ts:9-15`。
  - 文档插槽未实现 ｜ `docs/index.md:54-58`。
- 样式：
  - option 无 `:focus-visible`，键盘焦点不可见 ｜ `Listbox/styles.css:36-78`、`base.css:495-510` 未覆盖。

#### Checkbox
- 状态摘要：Checkbox + CheckboxGroup，5+2 条测试；indeterminate/`aria-checked="mixed"`/`:for` 关联完备。
- 功能：
  - Group `role="group"` 无可访问名称，无 label prop ｜ `CheckboxGroup.vue:36-41`。
  - 无 `change` 事件 ｜ `Checkbox/types.ts:24-26`。
- 样式：
  - **暗色主题未选中态漏勾（P0-1）** ｜ `Checkbox/styles.css:9` `stroke: white` + `Checkbox.vue:70-72` 恒渲染 ｜ 勾色改 `var(--wi-color-on-emphasis)` 且仅 checked/indeterminate 时渲染。
  - 无 hover 反馈 ｜ `base.css:218-249` 无 hover 规则。
  - 密度不适配：控件固定 1.125rem，compact 不缩放 ｜ `base.css:224-229,527-534`。

#### Radio
- 状态摘要：Radio + RadioGroup，4+2 条测试；原生 input 方案，组内箭头键导航由浏览器原生提供。
- 功能：Group `role="radiogroup"` 无 label/aria-label ｜ `RadioGroup.vue:30-34`；无 `change` 事件 ｜ `Radio/types.ts:21-23`。
- 样式：
  - 圆点硬编码白色（暗色主色 `#60a5fa` 上对比不足）｜ `Radio/styles.css:5` ｜ 改 `var(--wi-color-on-emphasis)`。
  - 无 hover、密度不适配（同 Checkbox）。

#### SelectButton
- 状态摘要：3 条测试；文档如实标注"无插槽"；样式状态覆盖最全。
- 功能：
  - 单选不可反选（无 `allowEmpty`）｜ `SelectButton.vue:34-44`。
  - 单选场景 radiogroup/radio 语义更准确，且 group 无可访问名 ｜ `SelectButton.vue:48,58`。
  - 按钮间无方向键导航 ｜ `SelectButton.vue:50-61`。
- 样式：
  - `flex-wrap: wrap` 与连体圆角/`-1px` margin 冲突，换行后边框错位 ｜ `SelectButton/styles.css:11,29-40` ｜ 禁止换行或换行退化样式。
  - invalid 仅描边、focus 不切 danger 环 ｜ `SelectButton/styles.css:76-78`。

#### ToggleButton
- 状态摘要：47 行最简实现，3 条测试。
- 功能：
  - 图标按纯文本渲染，与 WiIcon 体系脱节 ｜ `ToggleButton.vue:44` ｜ 改 `<WiIcon :name="icon">`。
  - 文档插槽未实现 ｜ `docs/index.md:69-73`。
  - 无 `invalid` prop、无 `change` 事件 ｜ `ToggleButton/types.ts:3-14`（SelectButton 有 invalid）。
- 样式：
  - **水平 padding 失效（P0-2）**：引用别家根上的 `--wi-button-padding-x-*` ｜ `ToggleButton/styles.css:15,21,27` ｜ 自身根补定义或改 `--wi-control-padding-x-*`。

#### DatePicker
- 状态摘要：407 行单文件，5 条测试；范围/快捷键/min-max 完备，Esc 支持。
- 功能：
  - **label 未关联输入框**：`<label>` 无 `:for`，input 无 id ｜ `DatePicker.vue:316,318-331`（对比 `Select.vue:316+324`）。
  - 日历网格无键盘导航与 grid 语义：42 个 day 按钮全部可 Tab，无方向键/`aria-selected` ｜ `DatePicker.vue:383-400` ｜ grid/gridcell + 箭头键 + 单 Tab 停靠。
  - 关闭后焦点不回弹、无 show/hide/change 事件 ｜ `DatePicker.vue:282-285`、`types.ts:41-44`。
  - 文档 `trigger` 插槽未实现、无 errorMessage ｜ `docs/index.md:197-201`、`types.ts:20-39`。
- 样式：
  - disabled 日格 `opacity: 0.4` 未用 `--wi-opacity-disabled`（0.55）｜ `DatePicker/styles.css:197`。
  - 日格无 `:focus-visible` ｜ `DatePicker/styles.css:166-198`。
  - 日历单元格用固定 `--wi-control-affix-size`，不随密度缩放 ｜ `DatePicker/styles.css:4-5`。

**B 组共性**：① 文档插槽集体失信（7/10 组件）；② 键盘/Esc 支持参差，CascadeSelect/TreeSelect 完全无键盘；③ 浮层定位无碰撞翻转（全部走 `overlayPlacement.ts:90-95`）；④ 硬编码裸色伤暗色（Checkbox 白勾、Radio 白点、TreeSelect 过滤框）；⑤ API 不对齐（仅 Select 有 change/show/hide 与 errorMessage/helpText）。

---

### C. 表单与按钮类（10 个：Form / Label / InputGroup / IconField / FloatLabel / Button / SplitButton / SpeedDial / FileUpload / Dropdown）

#### Form
- 状态摘要：Form/FormItem/rules.ts/context.ts 齐全，3 个测试文件（210+ 行），校验体系完整（rules/trigger/validate/clearValidate、错误 `role="alert"`）。
- 功能：
  - 缺 `reset`/`resetFields` ｜ `Form.vue:117`（expose 仅 validate/clearValidate/errors）｜ 与 Element/Naive 对齐。
  - Form 无 `size` prop，尺寸上下文不下发；label 行高写死 medium ｜ `Form/types.ts:43-65`、`Form/styles.css:39`。
  - `disabled` 仅 CSS 级禁用，键盘仍可 Tab 进入内部控件 ｜ `Form/types.ts:60`、`Form/styles.css:20-23` ｜ context 透传或 `aria-disabled`。
  - blur/change/input 校验依赖原生事件冒泡，Teleport 浮层操作时 focusout 易误触发 ｜ `FormItem.vue:119` ｜ 允许控件 inject context 主动 notify。
- 样式：
  - 禁用透明度自定义 0.65 而非 `--wi-opacity-disabled`（0.55）｜ `Form/styles.css:4,21`。
  - 裸值 `margin-right: 0.2rem`、`line-height: 1.4` ｜ `Form/styles.css:41,47`。

#### Label
- 状态摘要：17 行极简包装原生 label，1 个测试。
- 功能：无 `required`/`invalid` 能力，与 FormItem 内部 label 割裂 ｜ `Label/types.ts:1-6`、`FormItem.vue:120-128` ｜ 文档明确场景或复用 required 标记。
- 样式：`line-height: 1.4` 硬编码且与 FormItem 重复 ｜ `Label/styles.css:7`、`Form/styles.css:41`。

#### InputGroup
- 状态摘要：InputGroup + InputGroupAddon 各 11 行纯插槽壳，2 个测试。
- 功能：Props 接口为空，根节点无 `role="group"`/aria-label ｜ `InputGroup/types.ts:1-3`、`InputGroup.vue:7-9` ｜ 参照 ButtonGroup。
- 样式：
  - 无子控件圆角/边框合并规则，相邻控件双边框+直角接缝 ｜ `InputGroup/styles.css:1-20` ｜ 参照 `Button/styles.css:485-501` 做法。
  - addon 尺寸写死 medium 档 ｜ `InputGroup/styles.css:17-18`。
  - `border: 1px solid` 未用 `--wi-border-width` ｜ `InputGroup/styles.css:13`。

#### IconField
- 状态摘要：22 行，有测试。
- 功能：图标固定 `aria-hidden`+`pointer-events: none`，无法支持可点击图标（清除/显隐密码高频场景）｜ `IconField.vue:17`、`IconField/styles.css:14` ｜ 增加 clickable 变体或文档指引。
- 样式：
  - **未给内部输入框做图标侧 padding 补偿，图标与文本默认重叠** ｜ `IconField/styles.css:1-27` 全文无 input padding 规则；主题已备 `--wi-control-affix-padding`（`theme/styles.css:58-60`）未被引用 ｜ 内置 padding 补偿规则。
  - 图标偏移固定 `--wi-space-3`，不随尺寸档变化 ｜ `IconField/styles.css:22,26`。

#### FloatLabel
- 状态摘要：28 行，有测试，文档已写明需 `placeholder=" "` 配合。
- 功能：
  - id 绑定在 onMounted 一次性 querySelector，插槽内控件 v-if 延迟渲染则 `label for` 永久失效 ｜ `FloatLabel.vue:10-18` ｜ MutationObserver/watch。
  - CSS `:has` 仅覆盖 input/textarea，WiSelect 等自定义控件永远不会上浮 ｜ `FloatLabel/styles.css:24-25` vs `FloatLabel.vue:11-13` ｜ 加 `has-value` 类约定。
- 样式：
  - 浮动态裸值 `font-size: 0.7rem; padding: 0 0.2rem` ｜ `FloatLabel/styles.css:28-29` ｜ 用 `--wi-font-size-xs`/`--wi-space-1`。
  - 无 invalid 态（FormItem 报错时浮标不变红）｜ `FloatLabel/styles.css:1-32`。

#### Button
- 状态摘要：145 行 + ButtonGroup + 653 行样式（全组最完善），133 行测试，250+ 行文档；loading/icon-only/link/text/outlined/ghost/quaternary/badge 变体齐全，severity 7 档全 token 化。**组内标杆**。
- 功能：
  - severity 联合类型缺 `'primary'` 且用 `'warn'`，与 Tag/Message/Toast 的 `'warning'` 不一致（P1-1）｜ `Button/types.ts:5-13`。
  - `ButtonSize` 类型只有 `'small'|'large'`，缺 `'medium'` 却兼容 legacy `sm/md/lg` ｜ `Button/types.ts:17,54`。
  - 仅 emit click，无 focus/blur ｜ `Button/types.ts:70-72`。
  - icon-only+loading 且无 label 时 `aria-label` 为 undefined ｜ `Button.vue:119` ｜ loading 时回落 locale 文案。
- 样式：
  - **全文无 `:disabled` 视觉规则**，禁用态只剩浏览器默认 ｜ `Button/styles.css:49,55` 之后无任何 disabled 选择器 ｜ 补 `opacity: var(--wi-opacity-disabled); cursor: not-allowed`。
  - spinner `700ms`、raised 阴影硬编码 ｜ `Button/styles.css:641,506-508`。
  - ButtonGroup 首末圆角用 `--wi-radius-md`，与按钮本体 `--wi-radius-control` 不一致 ｜ `Button/styles.css:494-501` vs `:27`。
  - group 内焦点按钮阴影被后邻遮挡，未做 z-index 抬升 ｜ `Button/styles.css:490-492` ｜ `:focus-visible { z-index: 1 }`。

#### SplitButton
- 状态摘要：156 行，59 行测试；支持 teleport/appendTo/severity/菜单 command。
- 功能：
  - **浮层不支持 Esc、无键盘导航（P0-13）** ｜ `SplitButton.vue` 全文无 keydown（Dropdown 的 `Dropdown.vue:118-146` 可作参照）。
  - severity 声明全量但样式只实现 secondary/danger 两档，其余静默回落主色 ｜ `SplitButton/types.ts:15` vs `SplitButton/styles.css:55-70`。
  - 菜单项模型无 icon/divider，与 DropdownItem 不对齐 ｜ `SplitButton/types.ts:5-8` vs `Dropdown/types.ts:7-19`。
  - 主按钮无 loading 态 ｜ `SplitButton/types.ts:11-25`。
- 样式：
  - **主按钮/触发器无 hover、无 focus-visible，交互零反馈** ｜ `SplitButton/styles.css:12-43`。
  - 非 teleport z-index `--wi-z-popper`(40) vs teleport `--wi-z-overlay` 双标准 ｜ `SplitButton/styles.css:127,134`。
  - 触发器分隔线写死主色 color-mix，danger 档下仍带主色 ｜ `SplitButton/styles.css:34-40`。

#### SpeedDial
- 状态摘要：135 行，41 行测试；v-model 开关、4 方向、teleport。
- 功能：
  - 无外部点击/Esc 关闭，打开后只能再点主按钮 ｜ `SpeedDial.vue:70-84`。
  - `item.icon` 按原始文本渲染，不走 WiIcon ｜ `SpeedDial.vue:113` vs `Dropdown/DropdownNodes.vue:76-78`。
  - 有 `role="menu"/"menuitem"` 但无方向键导航；主按钮缺 `aria-haspopup="menu"` ｜ `SpeedDial.vue:103-129`。
  - 项点击只有 command 回调，无 emit ｜ `SpeedDial/types.ts:24-26`。
- 样式：
  - action 按钮无 hover/focus-visible ｜ `SpeedDial/styles.css:91-107`。
  - 非 teleport 列表无 z-index ｜ `SpeedDial/styles.css:31-38` vs `:41-44`。
  - 主按钮 `font-size: 1.25rem` 硬编码 ｜ `SpeedDial/styles.css:16`。

#### FileUpload
- 状态摘要：527 行 + ajax.ts（XHR 进度），165 行测试，270+ 行文档；v-model:fileList/before-upload/http-request/progress/abort/重试/expose 齐全，picture-card 完整。
- 功能：
  - `maxSize` 超限文件静默丢弃，无任何事件/UI 反馈 ｜ `FileUpload.vue:134-137`、`types.ts:41` ｜ 增加 `exceed-size`/`error`。
  - 自定义 `httpRequest` 返回 Promise 时不可取消 ｜ `FileUpload.vue:259-267` ｜ 支持 AbortSignal。
  - `change` 在每次 progress patch 时都触发，噪声大 ｜ `FileUpload.vue:85-89,228`。
  - `abort()` 静默无事件 ｜ `FileUpload.vue:280-286` ｜ emit `abort`。
- 样式：
  - choose/clear 按钮自绘样式（无 hover/focus-visible、圆角用 `--wi-radius-md`），未复用 WiButton ｜ `FileUpload/styles.css:17-33`、`FileUpload.vue:364-381` ｜ 直接换 WiButton。
  - 进度条宽度无 transition ｜ `FileUpload/styles.css:196-201`。
  - dragger `1px dashed` 硬编码线宽 ｜ `FileUpload/styles.css:49`。

#### Dropdown
- 状态摘要：237 行 + DropdownNodes 递归，双测试；click/hover 触发、delay、divider/group/子菜单、v-model、**Esc+焦点返还+方向键/Home/End 齐全——本组浮层交互标杆**。
- 功能：
  - 键盘导航到不了子菜单（enabledItems 排除含 children 项，无 ArrowRight/Left）｜ `Dropdown.vue:31-40,126-146`。
  - 高亮用 CSS 类而非 `aria-activedescendant`，焦点在 menu 容器上读屏无法感知 ｜ `Dropdown.vue:218-219`、`DropdownNodes.vue:100`。
  - 触发器是 `span[role=button]` 而非原生 button ｜ `Dropdown.vue:196-207`。
  - placement 仅 bottom-start/end，无碰撞翻转 ｜ `Dropdown/types.ts:28`、`Dropdown.vue:52-60`。
- 样式：
  - 触发器无 `:focus-visible` ｜ `Dropdown/styles.css:7-15`。
  - z-index 双标准（同 SplitButton）｜ `Dropdown/styles.css:28,42`。
  - group 容器缺 `role="group"`/labelledby ｜ `DropdownNodes.vue:50-60`。

**C 组共性**：① 浮层 Esc/键盘参差（Dropdown 标杆 vs SplitButton/SpeedDial 零支持）；② severity 命名与覆盖不统一（warn/warning、SplitButton 两档实装）；③ 交互态样式系统性缺失（hover/focus-visible/disabled）；④ 局部裸值反复（1px/0.7rem/700ms）；⑤ 尺寸体系断层（ButtonSize 缺 medium、InputGroup/IconField 无尺寸适配、Form 无 size 下发）。

---

### D. 数据展示类（9 个：Table / TreeTable / DataView / VirtualScroller / Pagination / OrderList / PickList / Tree / Timeline）

#### Table
- 状态摘要：体量最大（Table.vue + 10 hooks + 6 子组件 + normalize/utils），11+ 测试用例，14 章节文档。
- 功能：
  - **死 API 成组（P0-6）**：`sortMode`/`filters`/`buttonsPagination` 无消费逻辑，文档仍记载 ｜ `Table/types.ts:78,81,114,143,155`、`docs/index.md:271`。
  - **6 个孤儿子组件零引用（P1-16）**：TableButtonsPagination/TablePaginationArrows/TableRowsSelector/TableMultipleSelectCheckBox/TableSingleSelectCheckBox/TableLoading 全局无 import ｜ `Table.vue:14-22` 仅引 8 个组件。
  - `expandedRowKeys` 受控接口未接线，展开按行索引、翻页即丢 ｜ `useExpandableRow.ts:11,26`、`Table.vue:551-554`。
  - 选择/单选身份用 `JSON.stringify` 深比较（O(n²) 序列化+键序敏感）｜ `usePageItems.ts:47-52,67-72`、`useTotalItems.ts:141`。
  - **排序/搜索正确性（P0-7）**：数字列字典序（"10"<"2"）；搜索 `new RegExp` 未转义，输入 `[` 抛异常 ｜ `useTotalItems.ts:90-94,110-113,31`。
  - 右冻结被静默丢弃（normalizeFixed 只映射 left）；无虚拟滚动选项 ｜ `normalize.ts:14-15`、`Table.vue:407-414`。
- 样式：
  - **引用不存在的 `--wi-space-5`（P0-3）**，空态 padding 实际失效 ｜ `Table/styles.css:406`。
  - sticky 列阴影自写 color-mix 未用 `--wi-shadow-sticky*` token ｜ `Table/styles.css:88-90` vs `theme/styles.css:41-42,216-217`。
  - focus 样式绕开 `--wi-focus-shadow` ｜ `Table/styles.css:147`。
  - 硬编码散点：`gap: 4px`/`font-size: 10px`/`width: 36px`/`23px` ｜ `Table/styles.css:153,273,229,239-240,339-340`。
  - hover `!important`；`--wi-table-cell-padding-block` 不随密度 ｜ `Table/styles.css:373,6,18,23`。

#### TreeTable
- 状态摘要：TreeTable + TreeTableRow 递归行，仅 2 条测试，文档极简。
- 功能：
  - 能力远低于 Table：无排序/筛选/选择/分页/懒加载/空态/加载态，列定义只有 field/header，无任何插槽 ｜ `TreeTable/types.ts:1-4`、`TreeTable.vue:28-48` ｜ 至少补空态与 `cell-{field}` 插槽。
  - 展开态不可受控（无 `v-model:expandedKeys`，Tree 有）｜ `TreeTable.vue:12`。
  - 无 treegrid 角色/aria-level/键盘导航 ｜ `TreeTableRow.vue:33-39`。
  - 文档漂移：`expansion` 插槽不存在 ｜ `TreeTable/docs/index.md:60-63`。
- 样式：
  - 表头背景自创配方与 Table token 不一致 ｜ `TreeTable/styles.css:20` vs `--wi-table-header-bg`（`theme/styles.css:84`）。
  - 缩进硬编码 `depth * 1rem` ｜ `TreeTableRow.vue:31` ｜ 抽 `--wi-treetable-indent`。
  - 无行 hover/striped/selected，不接表格密度 token ｜ `TreeTable/styles.css` 全文。

#### DataView
- 状态摘要：单文件，3 条测试。
- 功能：
  - 分页不受控（内部 ref，`value.length` 一变强制回第 1 页）｜ `DataView.vue:12,26-30` ｜ 暴露 `v-model:page`。
  - 无空态/加载态 ｜ `DataView.vue:35-51` ｜ 对齐 Table 与设计规则。
  - 内置分页能力未透传（page-sizes/show-size-picker/disabled）｜ `DataView.vue:52-58`。
  - 无 `#header` 插槽放布局切换器 ｜ `DataView/types.ts:1-8`。
- 样式：网格列宽硬编码 `minmax(10rem, 1fr)` ｜ `DataView/styles.css:29` ｜ 抽 `--wi-dataview-grid-min`。

#### VirtualScroller
- 状态摘要：单文件，2 条测试，文档含性能说明。
- 功能：
  - 仅支持垂直固定行高，无 horizontal/动态尺寸 ｜ `VirtualScroller/types.ts:1-8`。
  - **字符串高度解析错误**：`Number.parseFloat('20rem')` 得 20 按 px 计算 ｜ `VirtualScroller.vue:13-17` ｜ 非 px 时实测或拒绝。
  - 无 expose（无 scrollToIndex）、无 ResizeObserver ｜ `VirtualScroller.vue`。
- 样式：无明显问题（24 行全 token 化）。

#### Pagination
- 状态摘要：测试存在，文档与实现高度一致。
- 功能：
  - 页码窗口无省略快跳/首页末页按钮 ｜ `Pagination.vue:30-34`。
  - **使用原生 `<select>`/`<input type="number">`**，违反"表单选项用 WiSelect"设计规则 ｜ `Pagination.vue:100-102,105-116` ｜ 换 WiSelect/WiInputNumber。
  - 冗余 emit：`update:rows` 与 `update:pageSize` 同值双发 ｜ `Pagination.vue:50-51`。
- 样式：缺 `:hover` 态（transition 已声明但无 hover 规则）｜ `Pagination/styles.css:21-24,27-41`。

#### OrderList
- 状态摘要：4 条测试（含 DnD）。
- 功能：
  - 键盘不可达：`role="option"` 的 li 无 tabindex，无方向键；上下移按钮无 disabled ｜ `OrderList.vue:107-133`。
  - 无空态 ｜ `OrderList.vue:115-148`。
  - key 回退用索引，重排后 key 即变 ｜ `OrderList.vue:25-30` ｜ 文档强调传 `dataKey`。
- 样式：
  - **选中态样式缺失（P0-12）**：输出 `wi-orderlist__item--selected` 但 styles.css 无该规则 ｜ `OrderList.vue:121`。
  - 列表项基础样式裸缺（无 padding/border/hover）｜ `OrderList/styles.css:13-17`。

#### PickList
- 状态摘要：2 条测试。
- 功能：
  - 交互单薄：无双击移动/目标内排序/拖拽穿梭/过滤 ｜ `PickList.vue:38-67`。
  - 4 个移动按钮恒定可点，空选择静默无操作 ｜ `PickList.vue:96-110` ｜ 按 selected 禁用。
  - 选中态按索引存储，数据异步刷新后错位 ｜ `PickList.vue:17-18,31-36` ｜ 按 `dataKey`。
- 样式：
  - **关键选择器整体缺失（P0-12）**：无 `__item`/`__item--selected`/`__btn` 规则（模板均引用）｜ `PickList/styles.css` 全文 7 条 vs `PickList.vue:80,81,96`。
  - 列表边框断裂（header 有 border、list 无）｜ `PickList/styles.css:18-22,27-30`。
  - 魔法数 `padding-top: 1.75rem` ｜ `PickList/styles.css:36`。

#### Tree
- 状态摘要：Tree + TreeNodeItem + checkStrategy.ts（独立可测）+ context.ts，2 个测试文件，文档覆盖 filter/checkStrategy/懒加载。
- 功能：
  - **懒加载就地突变 prop 节点** `node.children = children`，无加载失败态 ｜ `Tree.vue:180-184`。
  - 有 `role="tree"/"treeitem"` 但无方向键/Home/End、无 `aria-level`；toggler/label 双 Tab 焦点 ｜ `Tree.vue:278`、`TreeNodeItem.vue:43,60-70,87-99`。
  - 节点插槽每次渲染重建组件类型，子树反复卸载重建 ｜ `TreeNodeItem.vue:94` ｜ 缓存渲染函数。
  - 文档漂移：`node-select` 事件不存在；拖拽放弃时 `dragKey` 残留 ｜ `Tree/docs/index.md:166-169`、`Tree.vue:223-249`。
- 样式：
  - 状态色配方与 Table 不一致（primary 6%/12% vs `--wi-table-row-*` 10%/14%）｜ `Tree/styles.css:30-35`。
  - 缩进硬编码 `margin-left: 0.7rem` ｜ `Tree/styles.css:15` ｜ 抽 `--wi-tree-indent`。

#### Timeline
- 状态摘要：3 条测试，文档与实现一致；alternate/horizontal/4 插槽齐备。
- 功能：
  - severity 类型与样式不闭环：类型含 secondary/contrast，样式只定义五种 ｜ `Timeline/types.ts:7`、`Timeline.vue:41-46`、`styles.css:57-81`。
  - `pending: true` 产出空内容节点 ｜ `Timeline.vue:13-27` ｜ locale 默认文案。
- 样式：
  - 硬编码尺寸：`min-height: 4rem`、marker `1.5rem`/`2px`、connector `2px` ｜ `Timeline/styles.css:14,46-53,85-88` ｜ 抽 token。
  - pending 无动效（仅 dashed）｜ `Timeline/styles.css:152-153` ｜ `--wi-motion-*` 脉冲（尊重 reduced-motion）。

**D 组共性**：① 文档与实现漂移系统性风险；② 空态/加载态仅 Table 一家齐备；③ 身份/状态管理普遍依赖索引或 `JSON.stringify`；④ 状态色配方三套并存；⑤ 无效 token（`--wi-space-5`）与硬编码散点。

---

### E. 布局与容器类（14 个：Layout / Grid / Flex / Fluid / Space / Splitter / Scrollbar / Card / Panel / Fieldset / Accordion / Tabs / Toolbar / Divider）

#### Layout
- 状态摘要：5 个子组件 + context/composables，5 个测试文件，文档齐全。
- 功能：
  - `hasSider` 需显式传入，不自动检测插槽中的 LayoutSider ｜ `Layout.vue:14,43` ｜ 扫描 slot 自动推导（Naive 式）。
  - LayoutSider 缺响应式断点自动折叠（无 `breakpoint` prop）｜ `Layout/types.ts:60-88` ｜ 复用 `shared/responsive.ts`。
  - `after-enter`/`after-leave` 只监听 `max-width` 过渡，width 模式下时机依赖巧合 ｜ `LayoutSider.vue:141-142`、`styles.css:180-184`。
  - `position` 仅 static/absolute，不支持 sticky ｜ `Layout/types.ts:3` ｜ 可消费主题中无人使用的 `--wi-shadow-sticky`。
- 样式：
  - bar 触发器大量魔法值（4.5rem/-1.75rem/2rem/2.375rem/0.875rem/4px）｜ `Layout/styles.css:319-322,341-356` ｜ 收敛为 `--wi-layout-trigger-*` 组件级变量。

#### Grid
- 状态摘要：Grid + GridItem，各有测试，文档齐全。
- 功能：
  - 断点表硬编码不可定制 ｜ `shared/responsive.ts:2-9` ｜ 允许 ConfigProvider 注入。
  - context 接口 `assignLayout`/`register`/`unregister` 为空实现（死接口）｜ `Grid.vue:224-226`。
  - 折叠溢出状态只经插槽暴露，Grid 无事件/expose ｜ `GridItem.vue:59-63`。
- 样式：gap 数字直接拼 px 不走 `--wi-space-*` token ｜ `Grid.vue:110-119` ｜ gap 支持 token 名映射。

#### Flex
- 状态摘要：样式极简，有测试。
- 功能：
  - 无子节点时整个根元素不渲染（`v-if="children.length"`），与 Space 行为不一致，$attrs/ref 落点丢失 ｜ `Flex.vue:27,41` ｜ 恒渲染根节点。
  - `size` 数组/数字拼 px，无响应式 gap ｜ `shared/gap.ts:22-31`。
- 样式：无明显问题（gap 走 token）。

#### Fluid
- 状态摘要：13 行（`as` prop），有测试。
- 功能：无明显问题。
- 样式：`.wi-fluid > *` 强制所有直接子元素 `width: 100%`，会覆盖 inline 控件固有宽度 ｜ `Fluid/styles.css:3-7` ｜ 仅容器自身约束。

#### Space
- 状态摘要：有测试，文档齐全。
- 功能：与 Flex 的 props/逻辑几乎完全重复（align/justify/inline/vertical/reverse/wrap/size）｜ `Space.vue:28-39` vs `Flex.vue:26-36` ｜ 抽共享 composable。
- 样式：`wrapItem` 包裹容器强制 `display: flex`，会把块级子元素变 flex item ｜ `Space/styles.css:8-10`。

#### Splitter
- 状态摘要：键盘/aria/事件完备，有测试。
- 功能：
  - px 模式 `max` 默认值魔法值 `'99999px'` ｜ `Splitter.vue:47` ｜ 用 Infinity 语义。
  - 运行时改 `defaultSize` 会覆盖用户拖拽结果 ｜ `Splitter.vue:61-65` ｜ "default*" 应仅初始值。
- 样式：
  - **`resizeTriggerSize` prop 被 CSS 架空**：gutter `flex: 0 0 6px` 固定 basis 优先于内联 width ｜ `Splitter/styles.css:35,41-49` vs `Splitter.vue:111-115` ｜ CSS 只留 `flex: 0 0 auto`。

#### Scrollbar
- 状态摘要：Scrollbar + Thumb，双测试；expose（update/scrollTo/setScrollTop）完整，track 支持键盘。
- 功能：
  - 兜底 view id 用 `Math.random()`，SSR/水合 id 不一致 ｜ `Scrollbar.vue:51` ｜ 自增计数器/`useId()`。
  - `onUpdated` 无条件 `scheduleUpdate`，父组件任意重渲染都触发测量 ｜ `Scrollbar.vue:264-266`。
- 样式：淡入淡出裸 `340ms`/`120ms`，绕过 `data-wi-motion="reduced/none"` ｜ `Scrollbar/styles.css:89,92` ｜ 用 `--wi-motion-enter/exit`。

#### Card
- 状态摘要：props 仅 title/subtitle/size/bordered/hoverable，有测试。
- 功能：
  - 无 `header-extra`/`actions` slot、无 loading/embedded 态 ｜ `Card.vue:30-46`。
  - 标题固定渲染 `h2`，嵌套场景层级错乱 ｜ `Card.vue:33` ｜ 加 `headingLevel`/tag prop。
- 样式：
  - **`size="large"` 引用不存在的 `--wi-space-5`（P0-3）**，实际回退默认 padding ｜ `Card/styles.css:57`。
  - 边框裸写 `1px` ｜ `Card/styles.css:3,17,23`。

#### Panel
- 状态摘要：toggleable + 双 v-model，有测试。
- 功能：
  - **纯受控无内部状态**：toggleable 但不绑 v-model/collapsed 时点击无效 ｜ `Panel.vue:19,30-35` ｜ 加 `defaultCollapsed` 非受控分支。
  - `collapsed` 与 `modelValue` 双 model 并存，Fieldset 只有 collapsed，组内不一致 ｜ `Panel/types.ts:8-11` vs `Fieldset/types.ts:1-9`。
- 样式：
  - 同样引用未定义 `--wi-space-5` ｜ `Panel/styles.css:57-58`。
  - 折叠用 v-show 直切，无过渡 ｜ `Panel.vue:57`。

#### Fieldset
- 状态摘要：原生 fieldset/legend 语义好，有测试。
- 功能：
  - 与 Panel 相同纯受控问题 ｜ `Fieldset.vue:7-9,16-19` ｜ 加 `defaultCollapsed`。
  - toggler 无 `aria-controls` 指向内容区（Panel 有 aria-label 而 Fieldset 没有，应统一）｜ `Fieldset.vue:27-31,43`。
  - 无 `size` prop，与 Card/Panel 不一致 ｜ `Fieldset/types.ts:1-5`。
- 样式：边框裸写 `1px` ｜ `Fieldset/styles.css:4`；折叠无过渡（`Fieldset.vue:43` v-show）。

#### Accordion
- 状态摘要：数组驱动单文件，multiple/独占逻辑正确，有测试。
- 功能：
  - 纯受控 `modelValue` 无 `defaultValue`，不传 v-model 点击无效 ｜ `Accordion.vue:8-13,33-42`。
  - 无展开状态图标（chevron），active 仅靠文字变色 ｜ `Accordion.vue:59-61`、`styles.css:30-32`。
  - 无方向键/Home/End 在 header 间导航（Tabs 已实现可复用）｜ `Accordion.vue:49-62` vs `Tabs.vue:41-58`。
- 样式：
  - `.wi-accordion__header` 规则拆两处重复书写 ｜ `Accordion/styles.css:11-23,50-56`。
  - 展开/收起 v-show 直切无过渡 ｜ `Accordion.vue:64`。

#### Tabs
- 状态摘要：addable/closable/溢出滚动/键盘导航齐备，有测试。
- 功能：
  - 面板是单一 scoped slot，无逐 tab pane，无懒加载/keep-alive ｜ `Tabs.vue:157-159` ｜ 引入 WiTabPane 或 per-tab 插槽 + `lazy`。
  - tab 的 DOM id 直接拼接 `value`，特殊字符非法且多实例冲突 ｜ `Tabs.vue:110,57` ｜ 用内部 uid。
  - tab 与 tabpanel 缺 `aria-controls`/`aria-labelledby` 互相关联 ｜ `Tabs.vue:110-116,157`。
- 样式：
  - 滚动按钮步长硬编码 `±160` ｜ `Tabs.vue:97,141`。
  - 边框/下划线裸写 `1px`/`2px` ｜ `Tabs/styles.css:23,42,61`。

#### Toolbar
- 状态摘要：16 行纯 slot 组件，props 为空类型，有测试。
- 功能：`role="toolbar"` 但无 `aria-label`/`aria-orientation` 入口 ｜ `Toolbar.vue:4`、`Toolbar/types.ts:2`。
- 样式：边框裸写 `1px` ｜ `Toolbar/styles.css:5`。

#### Divider
- 状态摘要：horizontal/vertical + solid/dashed/dotted + label 对齐，有测试。
- 功能：**`role="separator"` 逻辑反置**：有 label 时才加 role，纯分隔线反而没有 ｜ `Divider.vue:29` ｜ 恒为 separator。
- 样式：全线裸写 `1px`（6 处）｜ `Divider/styles.css:14,30,35,56,67,73` ｜ 用 `var(--wi-border-width)`。

**E 组共性**：① 边框普遍裸写 1px 未用 `--wi-border-width`；② 折叠状态管理不统一（Panel/Fieldset/Accordion 纯受控单独使用无效）；③ `--wi-space-5` 失效引用 + 魔法值（99999px/160/触发器 rem）；④ 折叠/展开普遍无过渡，Scrollbar 裸时长绕过 motion 机制；⑤ a11y 关联属性参差（Divider 逻辑反置、Tabs 无关联、Fieldset/Toolbar 缺 label）。

---

### F. 浮层与反馈类（14 个：Dialog / Drawer / Sidebar / ConfirmDialog / ConfirmPopup / Popover / Tooltip / Toast / Message / BlockUI / ProgressBar / ProgressSpinner / Skeleton / ScrollTop）

#### Dialog
- 状态摘要：焦点陷阱/滚动锁定/Esc 复用 `useModalOverlay`，9 个测试用例，**测试覆盖最好**。
- 功能：
  - 内联 z-index 绕过 token 且与 Drawer 不一致 ｜ `Dialog.vue:66-70`（`zIndex: String(...?? 1000)`）vs `Dialog/styles.css:18`（`var(--wi-z-overlay)`）｜ 改组件级 CSS 变量。
  - 无标题时无无障碍名称 ｜ `Dialog.vue:180` ｜ 支持 `ariaLabel`/`ariaLabelledby` 兜底。
  - 无 expose 方法 ｜ `Dialog.vue:1-152` ｜ 暴露 `close()`/`maximize()`。
- 样式：禁用透明度硬编码 `0.5` ｜ `Dialog/styles.css:186-188` ｜ 用 `var(--wi-opacity-disabled)`。

#### Drawer
- 状态摘要：复用 useModalOverlay，4 个测试，样式纯 token。
- 功能：
  - 与 Dialog prop 命名不对齐（`dismissable`/`showCloseIcon` vs `closable`/`closeOnEsc`/`closeOnOutsideClick`/`beforeClose`）｜ `Drawer/types.ts:6-24` vs `Dialog/types.ts:27-33`。
  - Esc 关闭不可配置（useModalOverlay 缺省回退 true）｜ `Drawer.vue:60-67`、`shared/useModalOverlay.ts:23-27`。
  - 事件命名不一致（无 `close`）｜ `Drawer/types.ts:27-32` vs `Dialog/types.ts:67-74`。
- 样式：关闭按钮尺寸/字号硬编码且无 hover，与 Dialog 不对齐 ｜ `Drawer/styles.css:106-116` vs `Dialog/styles.css:156-170`。

#### Sidebar
- 状态摘要：静态导航菜单（非浮层），实现最简单，2 个测试。
- 功能：
  - 图标纯文本渲染，与 WiIcon 体系脱节 ｜ `Sidebar.vue:34`。
  - 无当前项语义：SidebarItem 无 `active`/`key`，无 `aria-current` ｜ `Sidebar/types.ts:1-7`、`Sidebar.vue:26-35`。
  - `collapsed` 为单向 prop ｜ `Sidebar/types.ts:8-12` ｜ 支持 `v-model:collapsed`。
- 样式：缺 focus-visible 焦点框 ｜ `Sidebar/styles.css:28-46`；禁用态无样式（全文无 `:disabled`）。

#### ConfirmDialog
- 状态摘要：复用 `wi-dialog-*` 类，`role="alertdialog"` 正确，4 个测试。
- 功能：
  - **无 `useConfirm` 命令式 API**（useToast/useMessage 已有先例）｜ 全库检索无匹配；仅支持 v-model（`ConfirmDialog/types.ts:6-25`）。
  - `blockScroll: true` 写死不可配置 ｜ `ConfirmDialog.vue:100`。
  - 不接受 `config.zIndex` ｜ `ConfirmDialog.vue:56-60` vs `Dialog.vue:67`。
  - 遮罩点击拒绝不可关闭（无 `closeOnOutsideClick` 开关）｜ `ConfirmDialog.vue:101-104,114`。
- 样式：无明显问题。

#### ConfirmPopup
- 状态摘要：自行实现 Esc/外部点击/定位（未复用 useModalOverlay），4 个测试。
- 功能：
  - **`aria-modal="true"` 与非模态行为矛盾**（无遮罩/焦点陷阱却声明 modal）｜ `ConfirmPopup.vue:141-143` ｜ 移除或改非模态语义。
  - 关闭后焦点不还原 ｜ `ConfirmPopup.vue:93-112` ｜ 焦点还给 target。
  - 无 `acceptSeverity`，删除场景无法标 danger ｜ `ConfirmPopup/types.ts:7-25` vs `ConfirmDialog/types.ts:12-14`。
- 样式：`.wi-confirmpopup__message` 规则重复定义 ｜ `ConfirmPopup/styles.css:18-22,30-34`。

#### Popover
- 状态摘要：manual/click/hover/focus + 延迟齐备，aria-haspopup/expanded/controls 完整，4 个测试。
- 功能：
  - 定位无视口碰撞翻转（P0-14）｜ `shared/overlayPlacement.ts:43-117`、`Popover.vue:115-121`。
  - 无 `disabled` prop ｜ `Popover/types.ts:15-28` ｜ 与 Tooltip 对齐。
  - 无 expose（manual 模式只能 v-model）｜ `Popover.vue` ｜ 暴露 show/hide/toggle。
- 样式：**teleport 后 z-index 误用 toast 层级，会压住 Toast** ｜ `Popover/styles.css:69-78`（`--wi-z-toast`）｜ 统一 `--wi-z-dropdown`。

#### Tooltip
- 状态摘要：hover/focus + 延迟 + maxWidth，默认 teleport，4 个测试。
- 功能：
  - 触发元素与提示无 aria 关联（无 id/`aria-describedby`）｜ `Tooltip.vue:103-124`。
  - 无视口翻转 ｜ `Tooltip.vue:37-43`。
  - 无 `trigger` prop（恒 hover+focus）｜ `Tooltip/types.ts:3-15`。
- 样式：
  - **`white-space: nowrap` 使 `maxWidth` 失效**，长文本溢出 ｜ `Tooltip/styles.css:19` vs `Tooltip.vue:41` ｜ teleported 模式改 normal。
  - z-index 误用 toast 层级（同 Popover）｜ `Tooltip/styles.css:43-50`。

#### Toast
- 状态摘要：toast.ts service + toastState.ts，6 个测试；useToast 齐备（add/success/info/warn/error/remove/clear/setDefaults），受控 messages/max 堆叠/aria-live。**组内标杆**。
- 功能：
  - 无去重 ｜ `toast.ts:57-65` ｜ dedupe 策略或同内容刷新 life。
  - 悬停不暂停倒计时 ｜ `toastState.ts:52-63`、`Toast.vue:75-99`。
  - position 仅 4 角，Message 有 top/bottom 居中 ｜ `Toast/types.ts:10` vs `Message/types.ts:10-16`。
- 样式：无明显问题。

#### Message
- 状态摘要：message.ts service + messageState.ts，8 个测试。
- 功能：
  - 不支持受控消息列表（Toast 有 `messages` prop）｜ `Message/types.ts:35-50`、`Message.vue:82` vs `Toast/types.ts:31-48`。
  - 配置 API 命名与 Toast 不一致（`config()` vs `setDefaults()`）｜ `message.ts:69-72` vs `toast.ts:80-83`。
  - 无去重/悬停暂停（同 Toast）。
- 样式：无明显问题。

#### BlockUI
- 状态摘要：文件最简（props 仅 blocked），有测试。
- 功能：
  - **遮罩只挡指针不挡键盘**：仅 `pointer-events: none`，键盘仍可 Tab 进被遮罩内容 ｜ `BlockUI/styles.css:10-13`、`BlockUI.vue:16-19` ｜ blocked 时内容加 `inert`。
  - 无默认加载指示（overlay 为纯透明层）｜ `BlockUI.vue:20-25` ｜ 可选内嵌 WiProgressSpinner。
- 样式：z-index 硬编码 `10` ｜ `BlockUI/styles.css:19`；遮罩出现/消失无过渡（v-if 直切）。

#### ProgressBar
- 状态摘要：line/circle 双形态、determinate/indeterminate、status 色板，有测试；aria-valuemin/max/now 正确。
- 功能：
  - 无可访问名称（无 aria-label prop，ProgressSpinner 已有先例）｜ `ProgressBar.vue:52-59` vs `ProgressSpinner/types.ts:9`。
  - status 词汇 `danger`/`error` 并存，手动映射 ｜ `ProgressBar/types.ts:4`、`ProgressBar.vue:17-20` ｜ 收敛 normalizeSeverity。
- 样式：
  - **跨组件 keyframes 依赖断裂（P0-4）**：引用 `wi-progress-spinner-rotate` 但 style.ts 未导入 ProgressSpinner/styles.css，单独引入时 indeterminate 圆环不转 ｜ `ProgressBar/styles.css:92-95`、`ProgressBar/style.ts:1-4`、`ProgressSpinner/styles.css:20-24`。
  - 动画时长 `1.2s` 硬编码 ｜ `ProgressBar/styles.css:37`。

#### ProgressSpinner
- 状态摘要：独立/包裹双模式、delay 防闪烁、尺寸档位；`role="status"`+locale 标签正确。
- 功能：
  - 包裹模式无 `aria-busy` ｜ `ProgressSpinner.vue:63-68`。
  - 包裹模式只挡指针（同 BlockUI 键盘问题）｜ `ProgressSpinner/styles.css:52-55`。
- 样式：
  - 遮罩透明度硬编码 `0.45` ｜ `ProgressSpinner/styles.css:53`。
  - **无限动画不尊重减动效**：`1s`/`1.5s` 硬编码，keyframes 不受 motion token 管 ｜ `ProgressSpinner/styles.css:4,13` ｜ 加 `prefers-reduced-motion` 降速/停转。

#### Skeleton
- 状态摘要：shape/text/repeat/wave，`aria-hidden` 正确，颜色 color-mix 随暗色自适应。
- 功能：无明显问题。
- 样式：
  - wave 动画 `1.4s` 硬编码，不尊重减动效 ｜ `Skeleton/styles.css:14`。
  - `borderRadius` 走内联样式 ｜ `Skeleton.vue:24-28` ｜ 文档注明覆盖默认 radius。

#### ScrollTop
- 状态摘要：window/parent 双目标、threshold、被动监听，4 个测试。
- 功能：
  - 出现/消失无过渡（display 直切）｜ `ScrollTop.vue:103`、`ScrollTop/styles.css:16,29-31` ｜ Transition + `--wi-motion-*` 上浮淡入。
  - 无 expose ｜ `ScrollTop.vue` ｜ 暴露 `scrollToTop()`。
- 样式：无 hover 态（仅 focus-visible）｜ `ScrollTop/styles.css:6-42` ｜ hover 用 `--wi-color-primary-hover`。

**F 组共性**：① severity 词汇分裂（error/danger 并存，ProgressBar 手动映射）；② 浮层定位无视口翻转（shared 层一次修复全组受益）；③ 三浮层 prop 命名不对齐 + z-index 处理不统一；④ 无限动画与透明度绕过 token 体系（0.5/0.45/0.55 三值并存）；⑤ 遮罩只挡鼠标不挡键盘（BlockUI/ProgressSpinner/ConfirmPopup）。

---

### G. 导航与菜单类（9 个：Menu / Menubar / MegaMenu / TieredMenu / ContextMenu / Breadcrumb / Stepper / Dock / CommandMenu）

#### Menu
- 状态摘要：文件最全（MenuNodes 递归 + context.ts + 495 行样式），双测试，424 行中文档为全组最详。
- 功能：
  - **完全无键盘导航**：叶子项是无 tabindex 的 div + @click，全文无 keydown ｜ `MenuNodes.vue:166-181`、`Menu.vue:230-248` ｜ roving tabindex + ↑↓←→/Enter/Esc/Home/End。
  - **popup 模式不能 Esc 关闭** ｜ `Menu.vue:230-248`（仅 document click）。
  - 菜单模型无路由集成（MenuItem 无 `to`）｜ `Menu/types.ts:3-11` ｜ 加 `to` 或 item 作用域插槽支持 RouterLink。
  - ARIA 不完整：submenu 触发项缺 `aria-haspopup="menu"`，选中项无 `aria-current` ｜ `MenuNodes.vue:100-104,128-135,56-64`。
- 样式：
  - 过渡动效硬编码 `0.2s ease`；`wi-menu-expand` 用 max-height 过渡，长列表卡顿 ｜ `Menu/styles.css:263-267,281-282,383-385` ｜ 接 motion token，展开改 grid-template-rows 方案。
  - 禁用透明度硬编码 `0.45`（其余组件用 token 0.55）｜ `Menu/styles.css:315-319`。
  - 尺寸/缩进不随密度（`--wi-menu-item-height: 2.625rem` 定值 + 内联 px paddingLeft）｜ `Menu/styles.css:3`、`Menu.vue:184-189`。
  - 5 处 `!important`；`zIndex ?? 1000` 硬编码回退 ｜ `Menu/styles.css:147,239,298,313,483`、`Menu.vue:92` ｜ 对齐 `var(--wi-z-base)`。

#### Menubar
- 状态摘要：触发器用原生 button、aria-haspopup/expanded 正确、aria-label 走 locale，有测试。
- 功能：
  - 类型递归但渲染仅两级（child.items 不再展开）｜ `Menubar/types.ts:3-10` vs `Menubar.vue:144-159` ｜ 递归或收窄类型。
  - 无键盘导航与 Esc ｜ `Menubar.vue:77-104` ｜ menubar 惯例 ←→ 切顶级、↓ 打开、Esc 关闭。
  - 图标渲染双轨：resolveMenuIcon 失败回退裸文本 ｜ `Menubar.vue:124-127` ｜ WiIcon-only + 非法名称告警。
- 样式：
  - **选中态样式寄生全局 base.css**（组件 styles.css 无对应规则）｜ `base.css:380-385` vs `Menubar/styles.css:1-103` ｜ 收回组件样式文件。
  - 子菜单偏移硬编码（`top: calc(100% + 0.25rem)`、`{ gap: 4 }`）｜ `Menubar/styles.css:70`、`Menubar.vue:39`。
  - 子菜单项缺 focus-visible ｜ `Menubar/styles.css:80-103`。

#### MegaMenu
- 状态摘要：二维列模型，有测试。
- 功能：
  - **无任何 emits、无选中态**（直接 command()）｜ `MegaMenu.vue:33-48`、`types.ts:12-17` ｜ 补 `select` emit 与可选 selectedKey。
  - 图标裸文本渲染 ｜ `MegaMenu.vue:96`。
  - ARIA/locale 与 Menubar 不一致（`aria-haspopup="'true'"` vs `'menu'`；aria-label 硬编码英文）｜ `MegaMenu.vue:93,81` vs `Menubar.vue:122,108`。
  - 无 Esc/键盘导航 ｜ `MegaMenu.vue:50-77`。
- 样式：
  - **禁用态完全无样式**（绑定了 :disabled 但无规则）｜ `MegaMenu.vue:91,120`、`styles.css:1-77`。
  - 无 focus-visible 规则 ｜ `MegaMenu/styles.css:1-77`。
  - hover 底色配方与兄弟组件不一致（primary 10%+transparent vs Menubar 的 +surface）｜ `MegaMenu/styles.css:30-33,74-77`。

#### TieredMenu
- 状态摘要：popup/非 popup 双分支模板，aria-haspopup/expanded 正确，有测试。
- 功能：
  - **popup 模式完全无定位逻辑（P0-8 同类）**：无 placement/锚点引用，文档示例的浮层实际落在视口原点 ｜ `TieredMenu.vue:1-67`、`styles.css:16-25`、`docs/index.md:42-58` ｜ 复用 shared/overlayPlacement。
  - 无 Esc 关闭（ContextMenu 有）｜ `TieredMenu.vue:49-66` vs `ContextMenu.vue:58-60`。
  - 类型递归但只渲染两级，深层 items 被静默丢弃 ｜ `TieredMenu/types.ts:3-8` vs `TieredMenu.vue:34-39,101-114`。
  - 模型缺 icon/key/selected；模板双分支重复约 50 行 ｜ `TieredMenu.vue:69-118` vs `119-171` ｜ 抽 TieredMenuNodes 子组件。
- 样式：子菜单偏移硬编码 `left: calc(100% + 0.25rem)` ｜ `TieredMenu/styles.css:78`；其余 token 化良好。

#### ContextMenu
- 状态摘要：ContextMenuNodes 正确递归 + useContextMenu 组合式 API + expose 类型，双测试；**Esc/外部点击/再次右键三重全局关闭齐备——组内浮层标杆**。
- 功能：
  - 定位无视口碰撞（menuStyle 直接 = clientX/Y，右/下缘溢出）｜ `ContextMenu.vue:25-30` ｜ 接入 shared/overlayPlacement clamp/flip。
  - 子菜单仅 hover 可开、父项无 aria-haspopup/expanded ｜ `ContextMenuNodes.vue:26-29,31-45`。
  - 模型无 `shortcut` 字段（CommandMenu 有）｜ `ContextMenu/types.ts:3-11`。
- 样式：
  - **子菜单/图标/箭头样式整体寄生 base.css**（与 Dropdown 混写，含 `z-index: 1` 裸值）｜ `base.css:95-129` vs `ContextMenu/styles.css:1-55` ｜ 收回组件样式并用 z token。

#### Breadcrumb
- 状态摘要：52 行精简实现，末项纯文本 + `aria-current="page"`、分隔符 prop+slot、aria-label 走 locale 均正确，有测试。
- 功能：
  - 路由集成弱：`to` 渲染原生 `<a :href>`（SPA 下整页刷新）；无 item 作用域插槽 ｜ `Breadcrumb.vue:29-33,45-47` ｜ 加 item 插槽或 `as` prop。
  - disabled 项缺 `aria-disabled` ｜ `Breadcrumb.vue:36-44`。
  - home 默认文案 'Home' 硬编码英文 ｜ `Breadcrumb.vue:14` ｜ 接 locale。
- 样式：链接无 focus-visible ｜ `Breadcrumb/styles.css:28-30`；分隔符透明度裸值 `0.7` ｜ `Breadcrumb/styles.css:42-44`。

#### Stepper
- 状态摘要：wait/process/finish/error 四态 + linear + vertical，有测试。
- 功能：
  - tablist ARIA 与行为不匹配（role=tab 但无方向键/aria-controls/tabpanel）｜ `Stepper.vue:43-57` ｜ 改 ol/li 语义或补全 tabs 键盘模式。
  - **显式状态类无样式落地（P0-10 同类）**：输出 `--finish/--process/--wait` 但仅 `--error` 有规则 ｜ `Stepper.vue:53` vs `Stepper/styles.css:84-87`。
  - 完成/错误态 marker 仍显示序号 ｜ `Stepper.vue:60` ｜ finish 渲染对勾、error 渲染警示图标。
- 样式：
  - 模板双根节点，内容区脱离 BEM 根，vertical 模式内容不参与纵向流 ｜ `Stepper.vue:43-65` vs `66-69`。
  - 无步骤间连接线；marker 尺寸定值不随密度 ｜ `Stepper/styles.css:3,74`。

#### Dock
- 状态摘要：34 行最小实现，图标按钮有 aria-label；中文档仅 47 行（全组最薄）。
- 功能：
  - 图标纯文本渲染（emoji/首字母回退，不接 WiIcon）｜ `Dock.vue:30`。
  - **`position` prop 无实现（P0-9）**：有类无样式，也无 fixed 定位 ｜ `Dock/types.ts:10`、`docs/index.md:41` vs `Dock/styles.css:1-46`。
  - 文档声明 default 插槽但模板无 slot ｜ `Dock/docs/index.md:47-50` vs `Dock.vue:19-33`。
- 样式：
  - 禁用态无样式 ｜ `Dock.vue:27` vs `Dock/styles.css:1-46`。
  - 无 focus-visible，键盘焦点不可见 ｜ `Dock/styles.css:20-31`。
  - 动效半 token 化（ease/位移/font-size 硬编码）｜ `Dock/styles.css:26,30,41`。

#### CommandMenu
- 状态摘要：Esc 经 useModalOverlay、backdrop 点击关闭、打开自动聚焦清空 query、空态 locale，有测试。
- 功能：
  - 无分组能力（扁平 filter，无 group 字段）｜ `CommandMenu/types.ts:3-9`、`CommandMenu.vue:29-32` ｜ 加 group 渲染分组标题。
  - combobox 语义未接线：input 无 role=combobox/aria-controls/aria-activedescendant；仅 ↑↓/Enter 无 Home/End ｜ `CommandMenu.vue:101-120,44-60`。
  - 图标裸文本渲染；shortcut 仅展示不绑定（可在文档说明由调用方接管热键）｜ `CommandMenu.vue:121,123`。
- 样式：
  - **z-index 层级错误**：模态 backdrop 用 `--wi-z-popper`(40)，会被打开的菜单/下拉压住 ｜ `CommandMenu/styles.css:11` vs `Dialog/styles.css:18`（`--wi-z-overlay`）｜ 模态遮罩 ≥ overlay。
  - `__icon` 无样式规则，有/无图标行不对齐 ｜ `CommandMenu.vue:121` vs `CommandMenu/styles.css:1-75`。

**G 组共性**：① 键盘导航与 Esc 全组不一致（仅 ContextMenu 有 Esc、仅 CommandMenu 有方向键）；② 菜单模型与图标渲染三条路线并存；③ 样式寄生 base.css 且夹带死代码（死选择器 `.wi-menu__item--selected`、悬空 `--wi-menu-min-width`）；④ hover/禁用配方不统一（三种 hover 底色、0.45/token/无样式三种禁用）；⑤ 浮层定位基建未被复用（ContextMenu 手写坐标、TieredMenu 无定位）。

---

### H. 展示与杂项类（10 个：Avatar / Badge / Chip / Tag / Icon / MeterGroup / Terminal / Gallery / Carousel / ConfigProvider）

#### Avatar
- 状态摘要：Avatar + AvatarGroup，双测试，文档齐全。
- 功能：
  - 尺寸档位与全库不一致：`normal/large/xlarge`，且 `sm` 映射为 normal（没有真正小尺寸档）｜ `Avatar/types.ts:5`、`Avatar.vue:21-27` ｜ 对齐 small/medium/large。
  - AvatarGroup 溢出 `+N` 为纯展示 span，无 tooltip/查看隐藏成员能力 ｜ `AvatarGroup.vue:56-65` ｜ 加 overflow 插槽或 title。
- 样式：组重叠用 `margin-left` 负值，RTL 不翻转 ｜ `Avatar/styles.css:84` ｜ 改 `margin-inline-start`。

#### Badge
- 状态摘要：有测试，文档齐全；severity 八档全 token 化且暗色可用。
- 功能：
  - 无 `showZero`（value=0 直接显示 "0"）｜ `Badge.vue:16-23`。
  - 角标位置固定右上，无 position 选项 ｜ `Badge/styles.css:119-129`。
- 样式：`processing` 脉冲 `1.2s` 硬编码，无减动效兜底 ｜ `Badge/styles.css:131-133`。

#### Chip
- 状态摘要：remove 按钮有 aria-label（locale）与 focus-visible，有测试。
- 功能：无可点击/选中语义（仅 remove 事件），无法做可选过滤器 chip ｜ `Chip/types.ts:25-27` ｜ 补 `click`/`selected`。
- 样式：
  - **severity 类型与样式脱节（P0-11）**：类型含 secondary/help/contrast，样式只实现五档 ｜ `Chip/types.ts:4` vs `Chip/styles.css:98-121`。
  - small 档垂直 padding 硬编码 `0.15rem` ｜ `Chip/styles.css:4,88-90`。

#### Tag
- 状态摘要：size 已接全局配置 `useConfiguredSize`，severity 八档样式齐全，有测试。**组内质量较高**。
- 功能：自定义 `color` 直接作前景+12% 底色，无对比度保护，传浅色不可读 ｜ `Tag.vue:36-38`、`Tag/styles.css:94-97` ｜ 文档警示或提供 `textColor`。
- 样式：small 档裸值 `0.65rem`/`0.15rem`（不在 font-size 刻度内）；close 按钮无 hover（Chip 有）｜ `Tag/styles.css:80-82,114,126-129`。

#### Icon
- 状态摘要：内置 16×16 stroke 图标注册表（icons.ts），有测试。
- 功能：
  - **注册表封闭无扩展 API**：`as const` + `IconName = keyof typeof`，外部图标只能走默认插槽 ｜ `Icon/icons.ts:288-296`、`Icon.vue:34` ｜ 导出 `registerIcon(name, def)` 或放宽 name 类型。
  - `size` 只接受 sm/md/lg 词表，不支持数字/任意 CSS 尺寸 ｜ `Icon/types.ts:11`、`Icon/styles.css:12-27`。
- 样式：spin 动画 `0.8s` 硬编码，减动效下依旧旋转 ｜ `Icon/styles.css:30-37`。

#### MeterGroup
- 状态摘要：堆叠条+图例，实现精简，有测试。
- 功能：
  - **`role="meter"` 缺 `aria-valuenow`**，读屏无法读出占比 ｜ `MeterGroup.vue:26`。
  - 能力面窄：无阈值变色/垂直方向/标签插槽 ｜ `MeterGroup/types.ts:7-10`。
  - 段颜色完全依赖逐项 color 字符串，无默认调色板 ｜ `MeterGroup/types.ts:4` ｜ 内置基于 `--wi-color-*` 的调色板序列。
- 样式：段色经内联注入绕过 token（未传色时兜底 primary 合理）｜ `MeterGroup.vue:30`、`MeterGroup/styles.css:21-22`。

#### Terminal
- 状态摘要：有暗色覆写块，有测试。
- 功能：
  - **只能发命令无法回显响应**：历史只记录用户输入，无 `lines`/`output` 通道，作为终端不完整 ｜ `Terminal.vue:16-27` ｜ 加受控 `lines`。
  - 无命令历史导航（↑/↓）与内置 clear；`role="application"` 语义过重劫持读屏浏览模式 ｜ `Terminal.vue:32` ｜ 改 `role="log"`。
- 样式：边框 `1px` 硬编码 ｜ `Terminal/styles.css:9,32`；输入框 `outline: none` 后无替代焦点样式 ｜ `Terminal/styles.css:56`。

#### Gallery
- 状态摘要：主图+缩略图+前后按钮+`update:activeIndex` 受控，有测试。
- 功能：
  - **声明了 listbox/option/aria-selected 却无任何键盘支持**，ARIA 形同虚设 ｜ `Gallery.vue:56-67` ｜ 补 roving tabindex 或降级按钮组。
  - `images: string[]` 不携带 alt/标题，全部 `alt=""`；无放大/全屏 ｜ `Gallery/types.ts:2`、`Gallery.vue:44,65` ｜ 支持 `{ src, alt, caption }` 对象项。
- 样式：缩略图无 `:focus-visible`；切换主图无过渡 ｜ `Gallery/styles.css:47-49`。

#### Carousel
- 状态摘要：numVisible/circular/autoplay/箭头/指示器，有测试。
- 功能：
  - **`v-model:page` 断裂（P0-5）**：emits 有 `update:page` 但 props 无 `page`，仅内部 ref ｜ `Carousel/types.ts:12-14` vs `1-10`、`Carousel.vue:20,44`。
  - 无触摸滑动、无键盘导航、无悬停暂停自动播放（裸 setInterval）｜ `Carousel.vue:62-73`。
  - 指示器 aria-label 只是序号字符串，无语义 ｜ `Carousel.vue:115`。
- 样式：翻页无过渡；指示器 `0.45rem` 远小于可点击目标下限；nav/indicator 全无 hover/focus-visible ｜ `Carousel/styles.css:3,37-49` ｜ 伪元素扩热区 + 补焦点样式。

#### ConfigProvider
- 状态摘要：provide/inject 基于 WI_CONFIG_KEY，支持嵌套合并与响应式 MaybeRefOrGetter，双测试。
- 功能：
  - **无主题（亮/暗）能力**：WiGlobalConfig 无 theme 字段，尽管 theme 模块已有 `applyTheme`/`useTheme`，暗色只能手动设 data-theme ｜ `shared/config.ts:40-60`、`theme/index.ts:31` ｜ 加 `theme?: 'light'|'dark'|'system'`。
  - **全局副作用无清理**：卸载后 `--wi-z-base` 内联值与 `data-wi-density` 残留 documentElement ｜ `ConfigProvider.vue:66-72` ｜ onBeforeUnmount 还原。
- 样式：scoped style 与 styles.css 双轨重复定义 `.wi-config-provider { height: 100% }` ｜ `ConfigProvider.vue:80-86` vs `ConfigProvider/styles.css:2-4` ｜ 合并一处。

**H 组共性**：① 动效体系未接入（全组无一处用 `--wi-motion-*`，无减动效感知）；② 键盘/焦点短板集中（Gallery 假 listbox、Carousel/Gallery 无 focus-visible、Terminal 无焦点样式、MeterGroup 缺 aria-valuenow）；③ "半受控"模式重复出现（Carousel page、Terminal 回显）；④ API 命名漂移（Avatar 尺寸词表、Chip severity）；⑤ 零散裸值集中在尺寸/线宽。

---

## 四、建议的推进顺序

1. **第一波（P0 快修，1-2 天）**：P0-1 Checkbox 白勾、P0-2 ToggleButton padding、P0-3 `--wi-space-5`、P0-4 keyframes 导入、P0-5 Carousel page prop、P0-9 Dock position、P0-10 Stepper 状态类、P0-11 Chip severity、P0-12 PickList/OrderList 样式。均为小改动高收益。
2. **第二波（共享基建）**：P0-14 overlayPlacement 加 flip/clamp（一处修复 ~10 组件受益）、P0-13 共享 `useMenuKeyboard`、P0-7/P0-15 Table/InputNumber 正确性、P0-6/P0-8 Table 死代码与 TieredMenu 定位。
3. **第三波（规范对齐）**：P1-1 severity 正典、P1-3 折叠双轨、P1-4 字段族基线、P1-5 菜单模型统一、P1-8 z-index 语义、P1-9 浮层 prop 对齐，并配 P1-2 文档对账脚本防回归。
4. **持续打磨（P2）**：裸值 token 化、动效接入、hover/focus 补齐、ARIA 补强、测试加固。

> 本报告为只读审计产物，未修改任何产品源码。每条结论的证据均可按 `文件:行号` 直接复核。
