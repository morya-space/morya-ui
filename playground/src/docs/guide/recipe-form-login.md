---
title: 登录表单
order: 20
description: 用 MForm + FormRules 做邮箱/密码登录校验。
---

# 登录表单

把邮箱、密码和提交按钮组合成可直接复制的登录表单：声明式 `rules` 校验，提交时统一跑一遍。

## 目标

- 邮箱必填 + 格式校验
- 密码必填 + 最短长度
- 提交时 `validate()`，失败只展示字段错误，成功再继续业务逻辑

## 何时使用

- 登录 / 注册页、账号切换弹窗等短表单
- 需要字段级错误文案，而不是一次弹全局 Toast

## 步骤

1. 安装并引入样式：`pnpm add morya-ui`，入口加 `import 'morya-ui/styles.css'`（按需导入可跳过全量样式）。
2. 用 `reactive` 建 `model`，用 `FormRules` 按字段名写规则。
3. `MForm` 绑定 `model` / `rules`，`validate-on="submit"`；字段放在 `MFormItem` 里，并通过默认插槽拿到 `id` / `invalid`。
4. 密码用 `MInputPassword`；邮箱用 `MInput type="email"`。
5. 在 `@submit` 里 `await formRef.validate()`，检查 `valid` 后再请求接口。

`validate()` **始终 resolve**，不会 reject；失败时看 `{ valid, errors }`。

## 预览

```vue preview src="./demos/recipes/FormLogin.zh.vue"
```

## 检查清单

- [ ] `name` 与 `rules` 键一致（`email` / `password`）
- [ ] 控件收到 `id` 与 `invalid`，错误能关联到 label
- [ ] 密码使用 `MInputPassword`（不要用明文 `type="password"` 凑合，除非刻意简化）
- [ ] 提交按钮 `native-type="submit"`，避免只绑 `@click` 漏掉原生提交
- [ ] 已引入 `morya-ui` 与样式

## 相关

- [Form](/components/Form)：声明式 rules、`useForm`
- [Input](/components/Input) / [InputPassword](/components/InputPassword)
- [Button](/components/Button)
- [快速上手](/docs/quick-start)
