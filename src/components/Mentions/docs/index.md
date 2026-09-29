---
title: Mentions
category: 02 / FORM
description: 输入 @ 等前缀时弹出建议并插入提及文本。
---

# Mentions

多行输入中通过 **前缀**（默认 `@`）触发建议列表，选中后在光标处插入 `prefix + value + split` 纯文本 token。适合评论、协作输入等场景。


## 何时使用

- 输入 @ 等前缀时弹出建议并插入提及文本。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MMentions } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 多前缀

`prefix` 可为字符串或数组；`split` 默认为空格，表示 mention 结束符。

```vue preview src="./demos/Prefix.vue"
```

## Props

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 文本 |
| `options` | `string[] \| { value, label? }[]` | `[]` | 建议项 |
| `prefix` | `string \| string[]` | `'@'` | 触发字符 |
| `split` | `string` | `' '` | 选中后追加的分隔符 |
| `rows` | `number` | `3` | 行数 |
| `placeholder` | `string` | — | 占位 |
| `disabled` / `readonly` | `boolean` | `false` | 禁用 / 只读 |
| `status` | `'error' \| 'warning'` | — | 校验态（同 Input） |
| `invalid` / `errorMessage` / `helpText` | — | — | 字段反馈 |
| `size` / `variant` / `fluid` | — | — | 与 Textarea 一致 |
| `emptyMessage` | `string` | locale 空态 | 无匹配文案 |
| `clearable` | `boolean` | `false` | 显示清除按钮 |
| `allowClear` | `boolean` | — | `clearable` 的别名 |
| `loading` | `boolean` | `false` | 建议面板内显示加载中 |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) | — | 字段透传 |

## 异步建议

无内置请求 API：在 `@input` / 自定义 debounce 后更新 `options`，并设 `loading` 为 `true` 直至数据返回。面板会在有活跃 mention 时保持打开。

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 文本变化 |
| `select` | `MentionsOption` | 选中建议 |
| `focus` / `blur` / `change` | — | 原生语义 |
