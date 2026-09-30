---
title: Label
category: 01 / BASIC
description: 可访问的表单标签。
---

# Label

简单 label，支持 `htmlFor` / `for` 与默认插槽。

## 引入

```ts
import { MLabel } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — | 关联控件 id。 |
| `for` | `string` | — | `htmlFor` 别名。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 标签文案。 |

## Events

无自定义事件。
