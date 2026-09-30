---
title: Confirm flow
order: 22
description: Declarative MConfirmDialog and imperative useConfirm for destructive actions.
---

# Confirm flow

For deletes, disables, and other hard-to-undo actions, ask once before running them. Morya covers both a template-driven dialog and `useConfirm().require()`.

## Goal

- Control `MConfirmDialog` with `v-model` in the template
- Call `useConfirm().require(...)` from script and await a `Promise<boolean>`
- Mark destructive accepts with `accept-severity="danger"` (optional `type="warning"`)

## When to use

| Approach | Best for |
| --- | --- |
| Declarative `MConfirmDialog` | Fixed copy/slots, state bound to the page, custom footer |
| Imperative `useConfirm` | Helpers, per-row table actions, avoiding one Dialog per entry |
| Dialog `modal.confirm` | Full Dialog features (async `onOk`, custom content). See [Dialog](/components/Dialog) |

## Steps

1. **Declarative**: drive visibility with `v-model`; open from a button; handle `@accept` / `@reject`.
2. **Imperative**: `const confirm = useConfirm()`, then `await confirm.require({ header, message, ... })`. `true` means accepted; `false` means cancelled or dismissed.
3. Set `acceptSeverity: 'danger'` for destructive confirms; add `type: 'warning'` when you want a status icon.
4. Run the real side effect after confirm. For async deletes, use `beforeAccept` on the declarative path, or `await` your API after `require()` resolves `true`.

## Preview

```vue preview src="./demos/recipes/ConfirmFlow.en.vue"
```

## Checklist

- [ ] Copy spells out the irreversible consequence
- [ ] Declarative path wires `@accept` / `@reject` (or equivalent handlers)
- [ ] Imperative path handles `false` (cancel / Esc / outside click)
- [ ] Do not misuse confirms as toasts (short feedback belongs to `message` / `toast`)
- [ ] `morya-ui` and styles are imported

## Related

- [ConfirmDialog](/components/ConfirmDialog): `MConfirmDialog`, `useConfirm`
- [Dialog](/components/Dialog): `useModal` / `modal.confirm`
- [Conventions](/docs/conventions): feedback selection
- [Quick start](/docs/quick-start)
