# Message / Toast / MMessage

**Default rule:** operation feedback uses the `message` API. Use `toast` only when you need a title plus detail, or an async / background notification feel.

## Three different things

| Name | Shape | API | Typical use |
| --- | --- | --- | --- |
| Message service | Top-centered one-liner | `message.success('已保存')` | Most CRUD results |
| Toast service | Corner notice with `summary` + optional `detail` | `toast.success({ summary, detail })` | Extra explanation, job results |
| `MMessage` | Optional host for the `message` service | `<MMessage />` | Custom `appendTo` / placement only. Not an inline alert |

## Decision tree

```
Need immediate feedback after a user action?
├─ No → maybe confirm dialog or field errorMessage only
└─ Yes → must the error stay in the form until fixed?
    ├─ Yes → field invalid / errorMessage; form-level token alert (see login-page)
    └─ No → only one short line (no separate detail)?
        ├─ Yes → message.*          ← default
        └─ No → summary + detail / async feel → toast.*
```

## Prefer `message`

```ts
import { message } from 'morya-ui'

message.success('已创建')
message.info('已移入回收站')
message.error('操作失败')
```

## Prefer `toast`

```ts
import { toast } from 'morya-ui'

toast.success({
  summary: '导入完成',
  detail: '成功 128 条，失败 2 条',
})
```

## Prefer `<MMessage>` / form-level errors

- Field validation: component `invalid` / `errorMessage` (preferred).
- Form-level persistent errors (login/auth): token-styled `role="alert"` bar as in MCP `get_golden_page` `login-page`.
- Note: `<MMessage>` today is primarily the **message service host** (`messages` / teleport). Do not invent a `severity` + default-slot Alert API unless docs add it.

```vue
<p v-if="formError" class="form-alert" role="alert">{{ formError }}</p>
```

```css
.form-alert {
  margin: 0 0 var(--m-space-4);
  padding: var(--m-space-3) var(--m-space-4);
  border: 1px solid color-mix(in srgb, var(--m-color-danger) 40%, var(--m-color-border));
  border-radius: var(--m-radius-md);
  background: color-mix(in srgb, var(--m-color-danger) 10%, var(--m-color-surface));
  color: var(--m-color-danger);
}
```

