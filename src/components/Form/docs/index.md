---
title: Form
category: 02 / FORM
description: 表单布局与字段校验反馈。支持 blur/change/submit 时机，不内置规则引擎。
---

# Form

`WdForm` / `WdFormItem` 负责布局与错误展示。校验函数由业务传入，`validateOn` 控制触发时机。

## Basic + submit 校验

```vue preview
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { WdForm, WdFormItem, WdInput, WdButton } from '@well-insight/ui'

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const form = reactive({ name: '', email: '' })

function required(value: string, message: string) {
  return () => (value.trim() ? undefined : message)
}
</script>

<template>
  <WdForm
    ref="formRef"
    label-position="top"
    validate-on="submit"
    style="max-width: 22rem"
    @submit="({ valid }) => valid && undefined"
  >
    <WdFormItem
      label="名称"
      name="name"
      required
      :validate="required(form.name, '请输入名称')"
    >
      <template #default="{ id, invalid }">
        <WdInput :id="id" v-model="form.name" fluid :invalid="invalid" />
      </template>
    </WdFormItem>
    <WdFormItem
      label="邮箱"
      name="email"
      required
      help="用于接收通知"
      :validate="() => (/.+@.+\..+/.test(form.email) ? undefined : '请输入有效邮箱')"
    >
      <template #default="{ id, invalid }">
        <WdInput :id="id" v-model="form.email" type="email" fluid :invalid="invalid" />
      </template>
    </WdFormItem>
    <WdButton native-type="submit" label="提交" />
  </WdForm>
</template>
```

## blur 校验

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdForm, WdFormItem, WdInput } from '@well-insight/ui'

const title = ref('')
</script>

<template>
  <WdForm validate-on="blur" style="max-width: 22rem">
    <WdFormItem
      label="标题"
      name="title"
      :validate="() => (title.trim() ? undefined : '标题不能为空')"
    >
      <template #default="{ id, invalid }">
        <WdInput :id="id" v-model="title" fluid :invalid="invalid" placeholder="失焦后校验" />
      </template>
    </WdFormItem>
  </WdForm>
</template>
```

## Props — Form

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `labelPosition` | `'top' \| 'left'` | `'top'` | 标签位置 |
| `labelWidth` | `string` | — | 左侧标签宽度 |
| `requireMark` | `boolean` | `true` | 必填星号 |
| `disabled` | `boolean` | `false` | 禁用态 |
| `validateOn` | `'submit' \| 'blur' \| 'change' \| 数组` | `['submit']` | 校验时机 |

## Props — FormItem

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 字段名（注册到 Form） |
| `validate` | `() => string \| void \| Promise<…>` | — | 返回错误文案 |
| `error` | `string` | — | 受控错误（优先于内部结果） |
| `invalid` / `help` / `required` / `label` | — | — | 同前 |

## Events / Expose — Form

| 名称 | 说明 |
| --- | --- |
| `submit` | `{ valid }` |
| `validate` | `{ valid, errors }` |
| `validate()` / `clearValidate()` | 实例方法 |
