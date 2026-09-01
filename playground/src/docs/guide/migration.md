---
title: API 迁移
order: 7
description: 已弃用 Props 的对照表与迁移建议。
---

# API 迁移

部分组件保留了早期命名，以便旧代码继续运行。新代码请优先使用右侧的推荐 API。

当前版本**不会**因使用旧 Props 而报错；后续大版本可能移除别名。

## 对照表

| 组件 | 旧 API | 推荐 API | 说明 |
| --- | --- | --- | --- |
| `WiInput` | `error` | `invalid` | 标记字段校验失败 |
| `WiTextarea` | `error` | `invalid` | 同上 |
| `WiSelect` | `error` | `invalid` | 同上 |
| `WiTextarea` | `autoResize` | `autosize` | 布尔 `true` 或 `{ minRows, maxRows }` |
| `WiButton` | `block` | `fluid` | 撑满容器宽度 |
| `WiDivider` | `orientation` | `layout` | `horizontal` / `vertical` |

`errorMessage` **未弃用**，仍用于展示错误文案；设置后会自动视为 invalid。

## 表单 invalid 状态

`Input`、`Textarea`、`Select` 的 invalid 逻辑一致：

```vue
<!-- 旧写法（仍可用） -->
<WiInput v-model="email" error error-message="格式不正确" />

<!-- 推荐写法 -->
<WiInput v-model="email" invalid error-message="格式不正确" />
```

也可只传 `error-message`，不必再写 `invalid` / `error`：

```vue
<WiInput v-model="email" error-message="必填" />
```

## Textarea 自动增高

```vue
<!-- 旧写法 -->
<WiTextarea v-model="note" auto-resize />

<!-- 推荐：无上限增高 -->
<WiTextarea v-model="note" :autosize="true" />

<!-- 推荐：限制行数 -->
<WiTextarea v-model="note" :autosize="{ minRows: 2, maxRows: 6 }" />
```

## Button 全宽

```vue
<!-- 旧写法 -->
<WiButton label="提交" block />

<!-- 推荐写法 -->
<WiButton label="提交" fluid />
```

## Divider 方向

```vue
<!-- 旧写法 -->
<WiDivider orientation="vertical" />

<!-- 推荐写法 -->
<WiDivider layout="vertical" />
```

## 自定义样式

Invalid 状态下，部分组件会同时带上 `--invalid` 与 `--error` 修饰类（过渡期兼容）。  
编写 CSS 时优先选择 `--invalid`：

```css
/* 推荐 */
.wi-input--invalid { /* … */ }

/* 仍有效，但请逐步迁移 */
.wi-input--error { /* … */ }
```

`WiSelect` 目前仅暴露 `wi-select--error`；后续版本会与 `--invalid` 对齐。

## 相关

- [全局配置](/docs/config)：尺寸、密度与文案
- [组件目录](/components)：各组件最新 Props 表
