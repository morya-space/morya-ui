---
title: Login form
order: 20
description: Build an email/password login form with MForm and FormRules.
---

# Login form

A copy-paste login form with declarative `rules`: email + password, validate on submit.

## Goal

- Required email with format check
- Required password with a minimum length
- Call `validate()` on submit; show field errors first, then run your business logic

## When to use

- Sign-in / sign-up pages and short account dialogs
- Field-level error copy instead of a single global toast

## Steps

1. Install and load styles: `pnpm add morya-ui`, then `import 'morya-ui/styles.css'` at the app entry (skip full CSS when using subpath imports).
2. Keep values in a `reactive` `model` and declare `FormRules` keyed by field name.
3. Bind `model` / `rules` on `MForm` with `validate-on="submit"`. Wrap fields in `MFormItem` and pass `id` / `invalid` from the default slot.
4. Use `MInputPassword` for the password and `MInput type="email"` for the email.
5. In `@submit`, `await formRef.validate()` and check `valid` before calling your API.

`validate()` **always resolves** — it does not reject. On failure, inspect `{ valid, errors }`.

## Preview

```vue preview src="./demos/recipes/FormLogin.en.vue"
```

## Checklist

- [ ] `name` matches the `rules` keys (`email` / `password`)
- [ ] Controls receive `id` and `invalid` so errors link to labels
- [ ] Password uses `MInputPassword` (avoid a plain `type="password"` unless you intentionally simplify)
- [ ] Submit button uses `html-type="submit"` so native form submit is not skipped
- [ ] `morya-ui` and styles are imported

## Related

- [Form](/components/Form): declarative rules, `useForm`
- [Input](/components/Input) / [InputPassword](/components/InputPassword)
- [Button](/components/Button)
- [Quick start](/docs/quick-start)
