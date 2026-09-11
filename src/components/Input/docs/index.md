---
title: Input
category: 02 / FORM
description: 文本输入框。
---

# Input

单行文本输入。

## 引入

```ts
import { MInput } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
```

## Invalid

`invalid` 表示校验失败；也可只传 `error-message`。

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput invalid label="Email" model-value="not-an-email" help-text="Enter a valid email" />
</template>
```

## Clearable

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <MInput v-model="value" clearable label="Note" />
</template>
```

## Prefix / Suffix

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MInput v-model="amount" label="金额" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </MInput>
    <MInput v-model="host" label="域名" fluid>
      <template #suffix>
        .well.design
      </template>
    </MInput>
  </div>
</template>
```

## Password-like type

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <MInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
```

## Sizes

支持 `small` / `large`，并兼容 `sm` / `md` / `lg`。

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MInput size="small" label="Small" placeholder="Small" />
    <MInput label="Normal" placeholder="Normal" />
    <MInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
```

## Count

`showCount` 显示字数；配合 `maxlength` 展示上限。

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <MInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <MInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <MInput variant="filled" label="Filled" placeholder="Filled" />
    <MInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput model-value="Read only value" label="Disabled" disabled />
</template>
```

## 外层 attrs 与布局

除 `@keydown`、`@focus` 等**控件事件**外，其余 fallthrough attrs（`class`、`style`、`data-*`、`title`、`tabindex` 等）均落在 field 外层（`.m-input-field`），不会直接写到 `<input>`。栅格、间距、测试 id 这样写即可：

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const q = ref('')
</script>

<template>
  <MInput
    v-model="q"
    label="搜索"
    class="toolbar-search"
    data-testid="search"
    style="max-width: 16rem"
  />
</template>
```

更多约定见 [样式与 attrs](/docs/attrs)。

## 键盘与焦点事件

`@keydown`、`@focus`、`@blur` 等绑在底层 input 上，用法与原生 input 相同：

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <MInput
    v-model="code"
    label="验证码"
    maxlength="6"
    @keydown.enter="$event.target instanceof HTMLInputElement && $event.target.blur()"
  />
</template>
```

## pt

按 DOM 分段透传。常用键：`root`、`input`、`label`、`prefix`、`suffix`、`help`、`count`。

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput
    label="Token"
    placeholder="sk-…"
    :pt="{
      root: { class: 'token-field' },
      input: { class: 'font-mono', autocomplete: 'off' },
    }"
  />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `id` | `string` | — | 原生 id；未传时自动生成。 |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'url' \| 'tel'` | `'text'` | 原生 type。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；默认中等。 |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | 样式变体。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `clearable` | `boolean` | `false` | 显示清除按钮。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `showCount` | `boolean` | `false` | 显示字数统计。 |
| `errorMessage` | `string` | — | 错误文案；有值时视为 invalid。 |
| `placeholder` | `string` | — | 占位符。 |
| `name` | `string` | — | 原生 name。 |
| `autocomplete` | `string` | — | 原生 autocomplete。 |
| `autofocus` | `boolean` | `false` | 挂载后聚焦。 |
| `pt` | [InputPassThrough](/docs/types#InputPassThrough) | — | DOM 分段透传，见上文 `pt`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 输入框左侧装饰（如单位、图标）。 |
| `suffix` | 输入框右侧装饰；与清除按钮可并存。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `clear` | — | 点击清除时触发。 |
| `blur` | — | — |
| `change` | — | — |
| `focus` | — | — |

## Instance

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦底层 input。 |

## 类型

<h4 id="InputPassThrough">InputPassThrough</h4>

`pt` 的类型。在 [FieldPassThrough](/docs/types#FieldPassThrough) 基础上多了前后缀等键：

```ts
type InputPassThrough = FieldPassThrough & {
  prefix?: PassThroughPart
  suffix?: PassThroughPart
  help?: PassThroughPart
  count?: PassThroughPart
}
```

`PassThroughPart` 见 [API 类型 · PassThroughPart](/docs/types#PassThroughPart)。
