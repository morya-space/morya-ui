---
title: 样式与 attrs
order: 5
description: class、style、事件与 pt 在各组件上的落点约定。
---

# 样式与 attrs

给组件传 `class`、`style` 或 `@keydown` 时，先搞清楚它们会绑到哪一层 DOM。Morya UI 的复合组件（尤其表单字段）不是「根元素就是 input」，外层还有 label、help、前后缀等结构。

完整规则见下文；各组件 Props 里的 `pt` 字段用来改内部某一块 DOM，细节查对应组件文档。

## 三类落点

| 类型 | 例子 | 透传 attrs（除控件事件外） | 事件 `@xxx` | 常见原生属性 |
| --- | --- | --- | --- | --- |
| **字段** | Input、Select、DatePicker | 外层 field 根（`.m-input-field` 等） | 原生 input / textarea / 控件 | 用 props：`placeholder`、`name`… |
| **Label 控件** | Checkbox、Radio、Switch | 可见的 `<label>` 根 | hidden 的 `<input>` | `name`、`value` 用 props |
| **容器** | Card、Dialog、Tabs、Table | 组件对外那一层根 DOM | 同一层根 DOM | 内部节点用 `pt` |
| **叶子** | Button、Icon、Tag | 就是交互元素本身 | 同一元素 | 与原生 Vue 组件一致 |

**字段 / Label 控件的规则**：除了明确绑在子控件上的**事件监听**（`@keydown`、`@paste` 等），其余 fallthrough attrs（`class`、`style`、`data-*`、`title`、`tabindex`、未声明的 `aria-*` 等）一律落到**根节点**。常见语义仍优先走 props；要精确改内层 DOM 用 `pt`。

叶子组件没有额外包裹层，写起来最省心；字段类只需记住「事件绑控件，其它 attrs 绑外层根」。

## 字段组件

以 Input 为例，结构大致是：

```text
div.m-input-field          ← class / style / data-* / title / tabindex … 落在这里
  label
  div.m-input-field__control
    input                    ← @keydown、@focus 等事件落在这里
  span.m-input-field__help
```

因此：

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
function onEnter() {
  // submit
}
</script>

<template>
  <!-- 布局类、测试 id 等加在外层；键盘事件绑控件 -->
  <MInput
    v-model="name"
    class="signup-field"
    data-testid="user-name"
    title="Display name"
    placeholder="Your name"
    @keydown.enter="onEnter"
  />
</template>
```

`placeholder`、`name`、`autocomplete`、`autofocus` 等请走 **props**（有类型与文档）；若作为未声明 attrs 传入，会落到 field 根而非 input——需要绑到 input 时用 `pt.input`。

Select、DatePicker、InputNumber 等同理：`class` 撑满栅格时加在 field 根上，别指望它直接写到内层 input。

## Label 控件

Checkbox / Radio / Switch 的可点击区域是 `<label>`，`class` 加在 label 上；`@change` 等由内部 input 接收。

```vue preview
<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
import { ref } from 'vue'

const ok = ref(false)
</script>

<template>
  <MCheckbox v-model="ok" class="terms-row" label="I agree" />
</template>
```

## 容器组件

Card、Panel、Tabs、Table 等：`class` 加在整个组件根节点，和直觉一致。

Dialog、Drawer 会 Teleport，`class` / `style` 加在**遮罩层**（backdrop）上，不是内层 `.m-dialog` 面板——这样你才能控制蒙层全屏布局或 z-index 相关样式。

```vue preview
<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MButton label="Open" @click="open = true" />
  <MDialog v-model="open" class="onboarding-dialog" header="Welcome">
    Content
  </MDialog>
</template>
```

## pt 透传

需要精确改内部某块 DOM（class、style、`data-*`、原生属性）时用 `pt`，键名对应组件 DOM 分段。Input 示例：

```vue
<MInput
  label="API Key"
  pt={{
    root: { class: 'col-span-2' },
    input: { class: 'font-mono', autocomplete: 'off' },
    prefix: { class: 'text-muted' },
  }}
/>
```

常见键名：

| 组件形态 | `pt` 键 |
| --- | --- |
| 字段（Input、Textarea、Select…） | `root`、`input` 或 `control`、`label`，部分还有 `prefix` / `suffix` / `help` |
| Checkbox / Radio / Switch | `root`、`input` |
| 单根容器 | `root` |

`pt` 里同名的 `class`、`style` 会与对应 DOM 上已有绑定合并，不是整段覆盖。

`FieldPassThrough`、`RootPassThrough` 等在 Props 表里的具体结构，见 [API 类型](/docs/types)。

## 与 PrimeVue / 其它库的差异

若你习惯 PrimeVue 的 `pt` 或把 `class` 直接写到 input 上：Morya 字段组件故意把布局类留在外层，避免 label/help 和输入框宽度对不齐。迁移时把布局 `class` 留在组件标签上即可，一般不用改模板结构。

## 相关文档

- [Input](/components/Input)：字段类完整示例
- [Checkbox](/components/Checkbox)：Label 控件
- [Card](/components/Card)、[Dialog](/components/Dialog)：容器
- [指南 · 写文档](/docs/guide)：贡献者如何描述 `pt`
