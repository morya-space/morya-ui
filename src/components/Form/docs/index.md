---
title: Form
category: 02 / FORM
description: 表单布局与字段校验。声明式 rules、label 对齐/行内布局；validate() 始终 resolve，不 reject。
---

# Form

`WiForm` / `WiFormItem` 负责布局、必填标记与错误展示。校验有两条路，可同时使用：

1. **声明式 `rules`（推荐）**：按字段名配置 `required` / `min` / `max` / `pattern` / `validator`。
2. **回调 `validate`**：FormItem 上传入函数，返回错误文案。仍可用于复杂跨字段逻辑。

未指定 `trigger` 的规则继承 Form 的 `validateOn`。程序化 `validate()` 与 `validateOn` 含 `submit` 的原生提交会跑完该字段全部规则。

**与 Naive UI 的差异：** 不引入 `async-validator`；`validate()` **始终 resolve** `{ valid, errors }`，校验失败不会 `reject`。Nested path（如 `user.name`）暂不支持，请用扁平字段名。

## 引入

```ts
import type { FormInstance, FormRules } from '@well-insight/ui'
import { WiForm, WiFormItem } from '@well-insight/ui'
```

## 声明式 rules

```vue preview
<script setup lang="ts">
import type { FormInstance, FormRules } from '@well-insight/ui'
import { WiButton, WiForm, WiFormItem, WiInput } from '@well-insight/ui'
import { reactive, ref } from 'vue'

const formRef = ref<FormInstance | null>(null)
const model = reactive({ name: '', email: '' })
const rules: FormRules = {
  name: { required: true, message: '请输入名称', trigger: ['blur', 'input'] },
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /.[^\n\r@\u2028\u2029]*@.+\..+/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

async function onSubmit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
}
</script>

<template>
  <WiForm
    ref="formRef"
    :model="model"
    :rules="rules"
    label-position="top"
    validate-on="submit"
    style="max-width: 22rem"
    @submit="onSubmit"
  >
    <WiFormItem label="名称" name="name">
      <template #default="{ id, invalid }">
        <WiInput :id="id" v-model="model.name" fluid :invalid="invalid" />
      </template>
    </WiFormItem>
    <WiFormItem label="邮箱" name="email" help="用于接收通知">
      <template #default="{ id, invalid }">
        <WiInput :id="id" v-model="model.email" type="email" fluid :invalid="invalid" />
      </template>
    </WiFormItem>
    <WiButton native-type="submit" label="提交" />
  </WiForm>
</template>
```

## 回调校验（兼容）

```vue preview
<script setup lang="ts">
import { WiButton, WiForm, WiFormItem, WiInput } from '@well-insight/ui'
import { reactive } from 'vue'

const form = reactive({ name: '' })
</script>

<template>
  <WiForm validate-on="submit" style="max-width: 22rem">
    <WiFormItem
      label="名称"
      name="name"
      required
      :validate="() => (form.name.trim() ? undefined : '请输入名称')"
    >
      <template #default="{ id, invalid }">
        <WiInput :id="id" v-model="form.name" fluid :invalid="invalid" />
      </template>
    </WiFormItem>
    <WiButton native-type="submit" label="提交" />
  </WiForm>
</template>
```

## inline 与 label 对齐

```vue preview
<script setup lang="ts">
import { WiForm, WiFormItem, WiInput } from '@well-insight/ui'
import { reactive } from 'vue'

const model = reactive({ city: '', zip: '' })
</script>

<template>
  <WiForm
    :model="model"
    inline
    label-placement="left"
    label-align="right"
    :label-width="72"
    :rules="{ city: { required: true, message: '必填' } }"
  >
    <WiFormItem label="城市" name="city">
      <template #default="{ id }">
        <WiInput :id="id" v-model="model.city" />
      </template>
    </WiFormItem>
    <WiFormItem label="邮编" name="zip">
      <template #default="{ id }">
        <WiInput :id="id" v-model="model.zip" />
      </template>
    </WiFormItem>
  </WiForm>
</template>
```

## Props — Form

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | 供 `rules` 读取的字段值 |
| `rules` | `FormRules` | — | 按 `name` 声明的规则 |
| `labelPosition` | `'top' \| 'left'` | `'top'` | 标签位置 |
| `labelPlacement` | `'top' \| 'left'` | — | `labelPosition` 别名（Naive） |
| `labelAlign` | `'left' \| 'center' \| 'right'` | `'left'` | 标签文本对齐 |
| `labelWidth` | `string \| number` | — | 左侧标签宽度；数字视为 px |
| `inline` | `boolean` | `false` | 表单项横向排列 |
| `requireMark` | `boolean` | `true` | 必填星号（`required` 或 `rules.required`） |
| `disabled` | `boolean` | `false` | 禁用态 |
| `validateOn` | `'submit' \| 'blur' \| 'change' \| 'input' \| 数组` | `['submit']` | 默认触发时机；无 `trigger` 的规则继承此项 |

## Props — FormItem

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 字段名（注册到 Form，对应 `model` / `rules`） |
| `rules` | `FormItemRule \| FormItemRule[]` | — | 字段级规则，排在 Form `rules[name]` 之后 |
| `validate` | `(trigger?) => string \| boolean \| void \| Promise<…>` | — | 回调校验；返回错误文案或 `false` |
| `error` | `string` | — | 受控错误（优先于内部结果） |
| `invalid` / `help` / `required` / `label` | — | — | 布局与展示 |

## FormItemRule

| 字段 | 说明 |
| --- | --- |
| `required` | 空值（`null` / 空白字符串 / 空数组）时报错 |
| `min` / `max` | 字符串/数组长度，或有限数字本身 |
| `pattern` | 非空字符串才检测 |
| `message` | 错误文案；缺省回退到 locale `required` |
| `trigger` | `'blur' \| 'change' \| 'input' \| 'submit'`；省略则继承 Form `validateOn` |
| `validator` | `(value) => string \| false \| Promise<…>`；`true` / `undefined` 视为通过 |

## Events / Expose — Form

| 名称 | 说明 |
| --- | --- |
| `submit` | `{ valid }`。仅当 `validateOn` 含 `submit` 时自动跑校验 |
| `validate` | `{ valid, errors }` |
| `validate(name?)` | **始终 resolve** `{ valid, errors }`，不会因失败 reject |
| `clearValidate(name?)` | 清除内部错误 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 表单项。 |
