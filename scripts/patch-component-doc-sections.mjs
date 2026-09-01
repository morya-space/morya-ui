import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(root, 'src/components')

const DOC_SECTIONS = {
  AutoComplete: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `item` | 选项项 `{ option }`。 |\n| `empty` | 无匹配结果。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `item` | Option row `{ option }`. |\n| `empty` | No matches. |',
  },
  Avatar: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 无 `src` 时的占位内容。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Fallback when `src` is omitted. |',
  },
  Badge: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  BlockUI: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Breadcrumb: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Card: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  CascadeSelect: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `value` | 触发器展示内容。 |\n| `option` | 选项 `{ option }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `value` | Trigger display. |\n| `option` | Option `{ option }`. |',
  },
  Chip: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 标签内容。 |\n| `icon` | 前置图标。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Label content. |\n| `icon` | Leading icon. |',
  },
  CommandMenu: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  ConfigProvider: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 子组件树。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Child tree. |',
  },
  ConfirmDialog: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 对话框正文。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Dialog body. |',
  },
  ConfirmPopup: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 弹出层正文。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Popup body. |',
  },
  ContextMenu: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 触发元素（非 popup 模式）。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Trigger element (inline mode). |',
  },
  DatePicker: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `trigger` | 自定义触发器 `{ value, open }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `trigger` | Custom trigger `{ value, open }`. |',
  },
  Divider: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Dock: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 停靠项。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Dock items. |',
  },
  Flex: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 布局子节点。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Layout children. |',
  },
  FloatLabel: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Fluid: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 撑满宽度的子内容。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Full-width child content. |',
  },
  Form: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 表单项。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Form items. |',
  },
  Gallery: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `item` | 媒体项 `{ item, index }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `item` | Media item `{ item, index }`. |',
  },
  Grid: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 栅格子项。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Grid children. |',
  },
  Icon: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  IconField: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  InputColor: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `trigger` | 自定义颜色触发器。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `trigger` | Custom color trigger. |',
  },
  InputGroup: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  InputNumber: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `prefix` | 前缀。 |\n| `suffix` | 后缀。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `prefix` | Prefix. |\n| `suffix` | Suffix. |',
  },
  InputOtp: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  InputTags: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `tag` | 标签 `{ tag, index }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `tag` | Tag `{ tag, index }`. |',
  },
  Knob: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Label: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Layout: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 布局区域。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Layout regions. |',
  },
  Listbox: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `option` | 选项 `{ option }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `option` | Option `{ option }`. |',
  },
  MegaMenu: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Menu: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `item` | 菜单项 `{ item }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `item` | Menu item `{ item }`. |',
  },
  Menubar: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `start` | 菜单栏起始区域。 |\n| `end` | 菜单栏末尾区域。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `start` | Start of menubar. |\n| `end` | End of menubar. |',
  },
  Message: {
    slots: '无插槽；通过 `message.*` API 注入内容。',
    slotsEn: 'No slots; content is injected through the `message.*` API.',
  },
  MeterGroup: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `label` | 自定义标签 `{ meter }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `label` | Custom label `{ meter }`. |',
  },
  Pagination: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  ProgressBar: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  ProgressSpinner: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Rating: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `icon` | 自定义星级 `{ active }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `icon` | Custom star `{ active }`. |',
  },
  Scrollbar: {
    events: '| 事件名 | 参数 | 说明 |\n| --- | --- | --- |\n| `scroll` | `{ scrollTop, scrollLeft }` | 滚动位置变化。 |\n| `end-reached` | `\'top\' \\| \'bottom\' \\| \'left\' \\| \'right\'` | 滚动到边缘。 |',
    eventsEn: '| Event | Payload | Description |\n| --- | --- | --- |\n| `scroll` | `{ scrollTop, scrollLeft }` | Scroll position change. |\n| `end-reached` | `\'top\' \\| \'bottom\' \\| \'left\' \\| \'right\'` | Scroll boundary reached. |',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 可滚动内容。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Scrollable content. |',
  },
  ScrollTop: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Select: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `value` | 自定义触发器展示（单选）。 |\n| `option` | 选项 `{ option }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `value` | Custom single-select trigger display. |\n| `option` | Option `{ option }`. |',
  },
  SelectButton: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Sidebar: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 侧栏内容。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Sidebar content. |',
  },
  Skeleton: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Slider: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Space: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 间距子项。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Spaced children. |',
  },
  SpeedDial: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `button` | 自定义主按钮。 |\n| `item` | 动作项 `{ item }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `button` | Custom main button. |\n| `item` | Action `{ item }`. |',
  },
  SplitButton: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 主按钮内容。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Main button content. |',
  },
  Stepper: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `icon` | 步骤图标 `{ step, index }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `icon` | Step icon `{ step, index }`. |',
  },
  Terminal: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Textarea: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  TieredMenu: {
    slots: '无插槽。',
    slotsEn: 'No slots.',
  },
  Timeline: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Toast: {
    slots: '无插槽；通过 `messages` prop 或 toast API 驱动。',
    slotsEn: 'No slots; driven by the `messages` prop or toast API.',
  },
  ToggleButton: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `default` | 按钮内容。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `default` | Button content. |',
  },
  Toolbar: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Tooltip: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
  Tree: {
    events: '| 事件名 | 参数 | 说明 |\n| --- | --- | --- |\n| `node-select` | `TreeNode` | 节点选中。 |\n| `node-expand` | `TreeNode` | 节点展开。 |\n| `node-collapse` | `TreeNode` | 节点收起。 |',
    eventsEn: '| Event | Payload | Description |\n| --- | --- | --- |\n| `node-select` | `TreeNode` | Node selected. |\n| `node-expand` | `TreeNode` | Node expanded. |\n| `node-collapse` | `TreeNode` | Node collapsed. |',
  },
  TreeSelect: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `value` | 触发器展示。 |\n| `option` | 树节点 `{ node }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `value` | Trigger display. |\n| `option` | Tree node `{ node }`. |',
  },
  TreeTable: {
    slots: '| 插槽名 | 说明 |\n| --- | --- |\n| `expansion` | 展开行 `{ row }`。 |',
    slotsEn: '| Slot | Description |\n| --- | --- |\n| `expansion` | Expanded row `{ row }`. |',
  },
  VirtualScroller: {
    events: '无自定义事件。',
    eventsEn: 'No custom events.',
  },
}

function hasSection(content, heading) {
  return new RegExp(`^## ${heading}$`, 'm').test(content)
}

function appendSection(content, heading, body) {
  const trimmed = content.replace(/\s+$/, '')
  return `${trimmed}\n\n## ${heading}\n\n${body}\n`
}

function patchFile(filePath, component, lang) {
  let content = fs.readFileSync(filePath, 'utf8')
  const config = DOC_SECTIONS[component]
  if (!config) return false

  let changed = false
  const eventsKey = lang === 'en' ? 'eventsEn' : 'events'
  const slotsKey = lang === 'en' ? 'slotsEn' : 'slots'
  const eventsHeading = lang === 'en' ? 'Events' : 'Events'
  const slotsHeading = lang === 'en' ? 'Slots' : 'Slots'

  if (config[eventsKey] && !hasSection(content, eventsHeading)) {
    content = appendSection(content, eventsHeading, config[eventsKey])
    changed = true
  }
  if (config[slotsKey] && !hasSection(content, slotsHeading)) {
    content = appendSection(content, slotsHeading, config[slotsKey])
    changed = true
  }

  if (changed) fs.writeFileSync(filePath, content, 'utf8')
  return changed
}

let patched = 0
for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const component = entry.name
  const docsDir = path.join(componentsDir, component, 'docs')
  if (!fs.existsSync(docsDir)) continue

  for (const file of ['index.md', 'index.en.md']) {
    const filePath = path.join(docsDir, file)
    if (!fs.existsSync(filePath)) continue
    const lang = file.includes('.en.') ? 'en' : 'zh'
    if (patchFile(filePath, component, lang)) patched += 1
  }
}

console.log(`Patched ${patched} doc files`)
