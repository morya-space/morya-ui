# Optional companions

This skill is **standalone**. Distilled craft lives in [visual-craft.md](visual-craft.md). Companions are optional soft upgrades installed by `@morya-ui/setup` (or already present in the repo).

## Conflict rule

`morya-ui-pages` + project `DESIGN.md` + MCP APIs **override** companion advice whenever they disagree (component choice, tokens, Ops layout, feedback API).

## Install via setup

```bash
# Interactive (TTY): toggle optional skills
npx @morya-ui/setup ai

# Non-interactive
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design,fixing-accessibility
npx @morya-ui/setup ai --skills=all
```

| Companion | Safe use | Unsafe use |
| --- | --- | --- |
| `frontend-design` | Express / brand panel taste after surface + contract are fixed | Replacing Ops golden shell or introducing a second UI kit |
| `fixing-accessibility` | Names, keyboard, focus, form errors on top of `M*` | Replacing library dialogs/menus with custom ARIA widgets |
| `impeccable` (if present locally) | Named polish passes aligned with [visual-craft.md](visual-craft.md) | New token schema or swapping `M*` for raw HTML controls |

## Load budget

- Default: **morya-ui-pages only**
- Max: pages + **one** optional companion for a given task
- Broad redesign review: pages + accessibility pass, or pages + one visual companion — still prefer one companion at a time

## If companions are absent

Do **not** tell the user to install them mid-task. Use [visual-craft.md](visual-craft.md) and continue.
