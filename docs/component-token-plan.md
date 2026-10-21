# Morya UI 组件 CSS 变量改进计划

> 对 Morya UI 全部组件做"根级组件 token 声明 + 状态轴映射"审查，即在每个组件根 class 下集中声明 `--m-<component>-*` 系列 CSS 变量（几何、颜色、状态轴），并给出按组件落地的改造清单。

## 一、现状结论

对 `src/components/*/styles.css` 共 **105 个样式文件**（另有 `src/shared/styles/` 4 个共享样式文件）做了全量扫描，结论如下：

| 维度 | 现状 | 说明 |
|---|---|---|
| 全局 token 复用 | 较好 | 绝大多数组件直接消费 `--m-color-*`、`--m-space-*`、`--m-control-height-*`、`--m-motion-*`、`--m-focus-shadow` 等全局 token |
| 组件根级 token 声明 | 覆盖不足 | 仅约 **30%** 组件在根 class 下声明 `--m-<component>-*`；多数组件把颜色/尺寸/状态值直接写在属性上，消费者无法通过覆盖变量定制 |
| 状态轴完整性 | 偏弱 | `hover` / `active` / `disabled` / `selected` / `focus-visible` 大多直接引用全局 token，缺少 `--m-x-hover-bg`、`--m-x-disabled-color` 这类可单独覆盖的组件级变量 |
| 硬编码 `color-mix` 比例 | 较分散 | 约 **40+** 个组件直接写死 `6% / 8% / 10% / 12% / 14% / 28% / 35% / 45% / 55% / 70% / 80% / 82% / 85% / 88%` 等混合比例，主题适配与统一调优困难 |
| 硬编码 opacity / ms | 少量 | `opacity: 0.45/0.55/0.75/0.85`、`300ms / 150ms / 250ms / 560ms` 等直接出现，未全部走 `--m-opacity-*` / `--m-motion-*` |
| 文档覆盖 | 严重不足 | 106 个组件目录均有 docs，但仅 **4 个** 组件文档提及 CSS 变量；其中仅 **Segmented** 有完整"样式定制"章节，且其文档示例引用了**不存在**的全局 token（`--m-color-primary-subtle` / `--m-color-text-on-primary`），文档与 token 体系已脱节 |
| 共享样式硬编码 | 未纳入单组件扫描 | `control-suffix.css` / `control-affix-icon.css` / `form-tags.css` 中 `--m-affix-icon-size: 1rem / 0.875rem / 1.125rem`、`--m-select-tag-remove-size: 0.875rem` 等硬编码尺寸需一并治理 |
| 悬空 token 引用 | 3 处真悬空 | 全库共声明 502 个 `--m-*` 变量，交叉核对后发现 3 个 token 被 `var()` 引用但从未在任何地方声明：`--m-color-surface-secondary`（ColorPicker）、`--m-color-primary-light`（ColorPicker）、`--m-control-height-sm`（DatePicker）。它们都带 fallback 值所以运行时不报错，但消费者无法通过主题真正定制，属于 token 体系漏洞 |
| `!important` 滥用 | 6 处集中在 Menu | `Menu/styles.css` 中 6 处 `background: ... !important`（另有 Carousel 2、Splitter 1、Table 2、Watermark 1），`!important` 会击穿消费者的变量覆盖，改造时需通过提高选择器特异性或调整结构消除 |
| 演示文档引用不存在 token | Carousel demos | `Carousel/docs/demos/` 中 3 个示例使用 `var(--m-color-surface-muted, #f3f4f6)`，该 token 未声明，与 Segmented 文档问题同类 |
| **覆盖度分层（关键属性扫描）** | 仅 3 组件达标 | 对每个组件的"颜色/尺寸/阴影/z-index/行高是否走变量"逐一扫描：**A 档（基本达标）仅 Button、Segmented、Avatar 3 个**；B 档（有几何变量、缺颜色状态轴）约 25 个；C 档（近零组件变量）约 70 个，含 Input/Select/Dialog/Table/Checkbox/Card 等主力；D 档（功能性硬编码，补变量也覆盖不到）见下 |
| **功能性硬编码** | D 档，4 类 | ① ColorPicker 23 处写死：`border: 2px solid #fff` 手柄、预设色板 `rgb(0 0 0/10%)`、面板 `260px/160px` 等，**暗色主题下手柄白边与分割线全是错的**；② `z-index` 写死数字散落 24 个文件（Table 6、Button 3、SelectButton 2…），未走 `--m-z-*`；③ 行高 `1.4/1.5/1.5715/1.65` 写死散落 60+ 组件，未走 `--m-line-height-*`；④ Menu `min-width:10rem`、Page `max-width:42rem`、Loading `3.75rem` 等局部尺寸写死。注：ColorPicker 色相渐变 `#f00→#ff0→…` 属功能性色轮，可豁免 |

**总体判断：** 组件库已经有不错的全局 token 基础，但距离"每个组件根类自带完整变量面板"的成熟度还有明显差距。核心问题不是"没有 token"，而是 **组件级 token 层不完整**，导致：

1. 单个组件难以独立定制（必须改全局 token 或写深层选择器）；
2. 状态色（hover/active/disabled）无法按组件微调；
3. `color-mix` 比例散落各处，无法统一收敛。

---

## 二、目标模式

> **本库现成样板**：`Segmented` 组件（`src/components/Segmented/styles.css` + `docs/index.md`）已基本符合该模式 —— 根 class 下声明完整的 `--m-segmented-*` 变量（track/thumb/text/radius/motion），且文档带"样式定制"章节列出变量名/默认值/用途。改造其他组件时可直接参照它的结构与文档格式。注意其文档示例引用了不存在的 `--m-color-primary-subtle` / `--m-color-text-on-primary`，需顺手修正为现有 token。


每个组件根 class 下集中声明该组件的 **几何、颜色、状态** 变量，属性一律消费变量：

```css
.m-button {
  /* 几何 */
  --m-button-height: var(--m-control-height-medium);
  --m-button-padding-x: var(--m-control-padding-x-medium);
  --m-button-radius: var(--m-radius-control);

  /* 基础色 */
  --m-button-bg: var(--m-color-surface);
  --m-button-color: var(--m-color-text);
  --m-button-border-color: var(--m-color-border);

  /* 状态轴 */
  --m-button-hover-bg: var(--m-button-color-light);
  --m-button-hover-color: var(--m-color-primary-hover);
  --m-button-hover-border-color: var(--m-color-primary-hover);
  --m-button-active-bg: var(--m-button-color-light-active);
  --m-button-disabled-bg: var(--m-color-bg-disabled);
  --m-button-disabled-color: var(--m-color-text-disabled);
  --m-button-disabled-border-color: var(--m-color-border);

  background: var(--m-button-bg);
  color: var(--m-button-color);
  border-color: var(--m-button-border-color);
}

.m-button:hover:not(:disabled) {
  background: var(--m-button-hover-bg);
  color: var(--m-button-hover-color);
  border-color: var(--m-button-hover-border-color);
}
```

改造后收益：

- 消费者只需覆盖 `--m-button-hover-bg` 即可定制 hover 背景，无需关心内部选择器；
- 变体（`--color-primary` / `--color-danger`）只需覆盖 `--m-button-color-base` 等少数变量，状态轴自动派生；
- `color-mix` 比例收敛为 `--m-button-fill-opacity` 等语义变量。

---

## 三、分层改造优先级

| 优先级 | 范围 | 原因 |
|---|---|---|
| **P0** | Button、Input、Select、Tag、Alert、Message、Tabs、Table、Checkbox、Radio、Switch | 最高频使用、状态最丰富、对外定制需求最强 |
| **P1** | Dialog、Drawer、Menu、Dropdown、Pagination、Tooltip、Badge、Card、Slider、ProgressBar、**ColorPicker**（功能性硬编码 23 处，暗色主题下手柄/分割线失效，属 bug 级） | 中频或有明显状态/主题痛点 |
| **P2** | 其余组件 | 结构简单或已部分 token 化，可随用随改 |

---

## 四、按组件落地清单

> 每个组件给出：**现状诊断 → 建议新增的根级变量 → 需收敛的硬编码**。

### P0 - 核心表单与按钮

#### 1. Button（`src/components/Button/styles.css`）
- **现状**：已有 57 个 `--m-button-*`，是全库最完善的组件之一。`--m-button-press-duration: 160ms` / `--m-button-ripple-duration: 560ms` 已声明为组件变量（默认值硬编码，属于可接受做法，消费者可覆盖）。
- **建议补充**：
  - `--m-button-disabled-bg` / `--m-button-disabled-color` / `--m-button-disabled-border-color`（当前 disabled 直接引用全局 `--m-color-bg-disabled` 等，无法单独定制按钮禁用态）。
  - `--m-button-focus-shadow`（当前直接用全局 `--m-focus-shadow`）。
- **结论**：Button 接近目标模式，仅需补 disabled/focus 状态轴，可作为改造参照之一。

#### 2. Input（`src/components/Input/styles.css`）
- **现状**：未声明任何 `--m-input-*`，全部直接使用全局 token。
- **建议新增**：
  - 几何：`--m-input-height` / `--m-input-padding-x` / `--m-input-radius`
  - 颜色：`--m-input-bg` / `--m-input-color` / `--m-input-border-color` / `--m-input-placeholder-color`
  - 状态：`--m-input-hover-border-color` / `--m-input-focus-border-color` / `--m-input-focus-shadow` / `--m-input-disabled-bg` / `--m-input-disabled-color` / `--m-input-invalid-border-color` / `--m-input-warning-border-color`
  - 填充变体：`--m-input-filled-bg`（当前硬编码 `color-mix(... 12% ...)`）
- **收敛**：`12%` 填充比例 → `--m-input-fill-opacity`。

#### 3. Select（`src/components/Select/styles.css`）
- **现状**：仅 3 个局部变量；trigger、panel、option 颜色直接引用全局 token，`color-mix` 比例 `35%` 硬编码。
- **建议新增**：`--m-select-bg`、`--m-select-border-color`、`--m-select-hover-border-color`、`--m-select-focus-border-color`、`--m-select-disabled-bg`、`--m-select-option-hover-bg`、`--m-select-option-selected-bg`、`--m-select-option-selected-color`、`--m-select-panel-shadow`。
- **收敛**：`35%` → `--m-select-fill-opacity`。

#### 4. Checkbox / Radio / Switch
- **现状**：
  - Checkbox/Radio 样式分散在 `base.css` 与各自 `styles.css`，无组件级变量；
  - Switch 有几何变量，但颜色状态轴直接引用全局 token，`color-mix` 比例 `40% / 55%` 硬编码。
- **建议新增**（以 Switch 为例，Checkbox/Radio 类似）：
  - `--m-switch-track-bg` / `--m-switch-track-checked-bg` / `--m-switch-track-hover-bg` / `--m-switch-thumb-bg` / `--m-switch-thumb-shadow` / `--m-switch-disabled-opacity`
  - Checkbox：`--m-checkbox-control-bg` / `--m-checkbox-control-border-color` / `--m-checkbox-control-checked-bg` / `--m-checkbox-control-hover-border-color`
- **收敛**：`40% / 55%` → `--m-switch-fill-opacity` / `--m-switch-hover-fill-opacity`。

#### 5. Tag（`src/components/Tag/styles.css`）
- **现状**：有几何变量，但 9 处 `color-mix` 比例 `6%/12%/14%/16%` 硬编码。
- **建议新增**：
  - `--m-tag-fill-opacity`（默认 12%）
  - `--m-tag-fill-opacity-hover` / `--m-tag-fill-opacity-active`
  - `--m-tag-secondary-fill-opacity`（当前 16%）
  - `--m-tag-checkable-hover-bg`
  - `--m-tag-close-opacity`（当前 0.75）
- **收敛**：所有 `%` 比例 → 语义变量。

#### 6. Alert（`src/components/Alert/styles.css`）
- **现状**：已有 `--m-alert-tone` / `--m-alert-bg` / `--m-alert-border`，是较好范例。
- **建议补充**：`--m-alert-close-color` / `--m-alert-close-hover-color` / `--m-alert-icon-margin-top`（当前 0.125rem）。

#### 7. Message（`src/components/Message/styles.css`）
- **现状**：各变体直接写 `color-mix(... 10% / 28% ...)`，未提取变量。
- **建议新增**：`--m-message-fill-opacity`（10%）、`--m-message-border-opacity`（28%）、`--m-message-close-hover-bg`。

#### 8. Tabs（`src/components/Tabs/styles.css`）
- **现状**：有尺寸变量，颜色直接引用全局；`35%` 卡片背景比例硬编码。
- **建议新增**：`--m-tabs-tab-color` / `--m-tabs-tab-hover-color` / `--m-tabs-tab-active-color` / `--m-tabs-tab-active-border-color` / `--m-tabs-card-bg` / `--m-tabs-card-active-bg` / `--m-tabs-indicator-color`。

#### 9. Table（`src/components/Table/styles.css`）
- **现状**：815 行仅 4 个组件变量；大量 `color-mix` 比例（`4%/6%/8%/10%/14%/16%/18%/35%/55%/70%/80%`）硬编码；另有 **6 处 `z-index` 写死数字**（sticky 表头/列）。
- **建议新增**：
  - `--m-table-header-bg` / `--m-table-header-color`
  - `--m-table-row-hover-bg` / `--m-table-row-selected-bg` / `--m-table-row-striped-bg`
  - `--m-table-border-color` / `--m-table-split-color`
  - `--m-table-fill-opacity-*` 收敛各比例
  - `--m-table-scrollbar-opacity`（当前 0.45）
  - `--m-table-sticky-z` / `--m-table-sticky-column-z` 收敛 6 处写死 z-index
- **收敛**：这是全库 `color-mix` 重灾区，应优先治理。

#### 10+. ColorPicker（`src/components/ColorPicker/styles.css`，建议从 P2 提升）
- **现状**：**全库功能性硬编码最严重的组件（23 处）**。手柄 `border: 2px solid #fff`、激活态 `box-shadow: 0 0 0 2px var(--m-color-primary), 0 2px 4px rgb(0 0 0/20%)`、预设色板 `border: 1px solid rgb(0 0 0/10%)`、删除按钮 hover `rgb(0 0 0/8%)`、面板 `width:260px`、色相条 `height:160px`、stops 列表 `max-height:120px`、options 里 `90px/70px` 全部写死；且引用了 2 个未声明 token（`--m-color-surface-secondary` / `--m-color-primary-light`）。
- **风险**：暗色主题下手柄白边、分割线、hover 底色全部失效，**属于功能 bug 级而不仅是定制能力缺失**，建议从 P2 提升到 P1 甚至 P0 末尾。
- **建议新增**：`--m-color-picker-handle-border` / `--m-color-picker-handle-shadow` / `--m-color-picker-swatch-border` / `--m-color-picker-panel-width` / `--m-color-picker-item-hover-bg` / `--m-color-picker-item-active-bg`，并正式声明两个悬空 token。

### P1 - 覆盖层与导航

#### 10. Dialog / Drawer / Popover / Tooltip
- **现状**：变量极少；宽度、阴影、遮罩色直接引用全局。
- **建议新增**：
  - Dialog：`--m-dialog-bg` / `--m-dialog-shadow` / `--m-dialog-border-radius` / `--m-dialog-header-padding` / `--m-dialog-mask-bg`（当前用 `--m-overlay-scrim`）
  - Drawer：`--m-drawer-bg` / `--m-drawer-shadow` / `--m-drawer-mask-bg`
  - Popover/Tooltip：`--m-popover-bg` / `--m-popover-shadow` / `--m-popover-arrow-size` / `--m-tooltip-bg` / `--m-tooltip-color`

#### 11. Menu / Dropdown / ContextMenu / TieredMenu
- **现状**：Menu 已有 21 个变量，但仍有 `45%/85%/88%` 硬编码；其余菜单组件变量很少。
- **建议新增/补充**：
  - `--m-menu-item-hover-bg` / `--m-menu-item-active-bg` / `--m-menu-item-disabled-color`
  - `--m-menu-border-color` / `--m-menu-shadow`
  - 收敛 `85%/88%` 边框透明比例 → `--m-menu-border-opacity`

#### 12. Pagination
- **现状**：5 个变量，button 状态色直接引用全局。
- **建议新增**：`--m-pagination-button-bg` / `--m-pagination-button-hover-bg` / `--m-pagination-button-active-bg` / `--m-pagination-button-disabled-color`。

#### 13. Badge / Card / Slider / ProgressBar
- **Badge**：`opacity: 0.35` 硬编码 → `--m-badge-processing-opacity`。
- **Card**：仅 1 个变量，建议补 `--m-card-bg` / `--m-card-shadow` / `--m-card-border-color` / `--m-card-header-border-color`。
- **Slider**：`40%` 比例硬编码 → `--m-slider-track-fill-opacity`；补 `--m-slider-thumb-border-color` / `--m-slider-thumb-hover-shadow`。
- **ProgressBar**：`16%/55%` + `opacity: 0.45` 硬编码 → 对应变量。

### P2 - 其余组件

以下组件结构简单或已有少量变量，可按需补充根级状态变量，优先级较低：

- **Accordion / Breadcrumb / Divider / Fieldset / Panel / Toolbar**：补充 `--m-x-border-color`、`--m-x-header-hover-bg` 等。
- **Avatar / Chip / Empty / Result / Statistic / Typography**：补充尺寸与颜色变量，收敛 `color-mix`。
- **Calendar / DatePicker / ColorPicker**：几何变量较多，重点收敛 `color-mix` 与 opacity。
- **Carousel / Gallery / Image / FileUpload**：补充遮罩/导航/进度颜色变量。
- **CommandMenu / MegaMenu / Menubar**：参考 Menu 的变量模式补齐。
- **ConfirmDialog / ConfirmPopup / Toast**：补充宽度、阴影、状态色变量。
- **Dock / SpeedDial / SplitButton / Splitter / ScrollTop**：补充触发器/分隔线颜色变量。
- **Form / Label / FloatLabel / IconField / InputNumber / InputPassword / InputTags / InputOtp / Mentions / Textarea / AutoComplete / CascadeSelect / TreeSelect / Listbox / SelectButton / ToggleButton / Rating**：参考 Input 模式，补齐字段壳与状态轴。
- **Grid / Flex / Space / Layout / Page / Fluid**：布局组件，主要是尺寸/间距变量。
- **Icon / Loading / Skeleton / ProgressSpinner / QRCode / Scrollbar / Terminal / Timeline / Tour / Tree / VirtualScroller / Watermark / Status / Stepper / Inplace / BlockUI / Affix / Anchor / ConfigProvider**：按实际样式复杂度补齐或保持现状。

---

## 五、统一治理项（跨组件）

除了单组件变量，建议同步做以下全局收敛：

1. **统一 `color-mix` 比例语义层**
   - 在 `src/theme/styles.css` 增加：
     ```css
     :root {
       --m-fill-opacity-light: 6%;
       --m-fill-opacity: 10%;
       --m-fill-opacity-strong: 14%;
       --m-border-opacity-soft: 28%;
       --m-border-opacity: 35%;
       --m-border-opacity-strong: 45%;
     }
     ```
   - 组件内不再写死 `%`，改为 `color-mix(in srgb, var(--m-color-primary) var(--m-fill-opacity), ...)`。

2. **统一 opacity / motion 硬编码**
   - `opacity: 0.45/0.55/0.75/0.85` → `--m-opacity-muted` / `--m-opacity-disabled` / `--m-opacity-loading` 等。
   - `150ms/250ms/300ms/560ms` → `--m-motion-fast` / `--m-motion-normal` / `--m-motion-slow` 或组件级 `--m-x-duration`。

3. **共享样式文件一并治理**
   - `src/shared/styles/control-suffix.css`、`control-affix-icon.css` 中 `--m-affix-icon-size: 1rem / 0.875rem / 1.125rem` 等硬编码尺寸应映射到尺寸档位 token；
   - `form-tags.css` 中 `--m-select-tag-remove-size: 0.875rem`、`--m-select-tag-padding-y: 0.15rem` 同理。

4. **建立组件变量命名规范**
   - 几何：`--m-<comp>-height|padding-x|radius|gap|icon-size`
   - 颜色：`--m-<comp>-bg|color|border-color`
   - 状态：`--m-<comp>-hover-*|active-*|focus-*|disabled-*|selected-*`
   - 变体/比例：`--m-<comp>-fill-opacity|border-opacity|shadow`
   - 参照 `Segmented` 现有命名（`track-background` / `thumb-shadow` / `active-text-color` / `motion-duration`），保持全库一致。

5. **补齐/统一悬空 token**
   - 在全局语义层正式声明：`--m-color-surface-secondary`、`--m-color-primary-light`（或更名后并入 `--m-fill-opacity-*` 体系）、`--m-control-height-sm`（与现有 `--m-control-height-small` 对齐——全库同时使用 `small` 与 `sm` 两种缩写，建议统一为 `small` 并保留别名过渡）；
   - 修正 `Carousel/docs/demos/` 中 `--m-color-surface-muted` 的悬空引用（补声明或改用现有 token）。

6. **消除 D 档功能性硬编码**
   - **ColorPicker 优先**：`#fff` 手柄边 → `--m-color-on-emphasis` 或新增 `--m-color-picker-handle-border`；`rgb(0 0 0/x%)` 系列 → 语义化 overlay/border token；`260px/160px/120px/90px/70px` 面板尺寸 → `--m-color-picker-panel-width` 等变量。色相渐变 hex 属功能色轮，保留但加注释豁免。
   - **z-index 收敛**：24 个文件中的 `z-index: 1/2/3` 数字，层内层级统一为 `0/1/2` 语义注释或局部变量（如 `--m-table-sticky-z`），浮层一律走 `--m-z-*` 全局体系。
   - **行高收敛**：`1.4/1.5/1.5715/1.65` 等写死行高映射到 `--m-line-height-sm/md/lg`，组件特殊行高声明为组件变量。

7. **消除 `!important`**
   - `Menu/styles.css` 6 处 `!important` 全部服务于"selected 背景覆盖 hover 伪元素"这一目的，可通过调整选择器特异性（如 `.m-menu__item-content--selected.m-menu__item-content::before`）消除；
   - Carousel/Splitter/Table/Watermark 各 1–2 处逐一核查，能用特异性解决的不用 `!important`——`!important` 会击穿消费者覆盖组件变量的能力，与本次改造目标直接冲突。

7. **文档同步与修正**
   - 每个组件文档增加“样式定制 / Style customization”章节，列出公开变量名、默认值、用途；格式参照 `src/components/Segmented/docs/index.md` 的现有表格。
   - **修正 Segmented 文档**：其示例引用的 `--m-color-primary-subtle` / `--m-color-text-on-primary` 在全库不存在，需替换为实际 token（如 `--m-color-primary` 系 color-mix / `--m-color-on-emphasis`），或在全局补齐这两个语义 token（更推荐后者，可作为品牌淡色/品牌上文色的正式语义层）。
   - 修改文档后运行 `pnpm mcp:generate` 更新 MCP catalog。

---

## 六、落地顺序建议

| 批次 | 内容 | 预估影响 |
|---|---|---|
| 第 0 批 | 全局语义层补齐：`color-mix` 比例 token、共享样式硬编码、补齐 3 个悬空 token（`--m-color-surface-secondary` / `--m-color-primary-light` / `--m-control-height-sm`）、（可选）`--m-color-primary-subtle` / `--m-color-text-on-primary`、修正 Segmented 文档与 Carousel demos 的悬空引用 | 为后续批次打底，避免组件变量映射到不存在的 token |
| 第 1 批 | P0 10 个核心组件（Input 与 Table 优先，Button 补 disabled 轴） | 覆盖 80% 日常定制场景 |
| 第 2 批 | P1 覆盖层与导航组件 | 解决主题切换时的阴影/遮罩/菜单不一致 |
| 第 3 批 | P2 剩余组件 + 文档/MCP 同步 | 形成完整设计系统 API |

---

## 七、验收标准

- [ ] 每个 P0/P1 组件根 class 下声明完整的状态轴变量（结构参照 `Segmented`/`Button`）；
- [ ] **覆盖度达标**：按"颜色/尺寸/阴影/z-index/行高"五维扫描，P0/P1 组件关键属性变量覆盖率达到 A 档（Button/Segmented/Avatar 水平），无 C 档残留；
- [ ] ColorPicker 暗色主题下手柄、预设色板、分割线、面板尺寸显示正确（视觉回归验证）；
- [ ] 组件内不再出现未语义化的 `color-mix` 百分比、`opacity` 小数、`ms` 时长（作为变量默认值的硬编码除外）；
- [ ] 共享样式文件（`control-suffix` / `control-affix-icon` / `form-tags`）硬编码尺寸已收敛；
- [ ] 组件文档示例中引用的 token 全部真实存在（无 `--m-color-primary-subtle` / `--m-color-surface-muted` 这类悬空引用）；
- [ ] 运行"声明×引用"交叉核对脚本，悬空 `var(--m-*)` 引用为 0（带 fallback 的允许保留但需在文档标注）；
- [ ] 组件样式中不再新增 `!important`，Menu/Carousel/Splitter/Table/Watermark 存量 `!important` 已消除或注明保留理由；
- [ ] 覆盖某个组件变量即可改变对应视觉表现，无需写深层选择器；
- [ ] 亮/暗主题切换后所有状态色仍符合对比度要求；
- [ ] 组件文档包含“样式定制”章节，MCP catalog 已更新。
