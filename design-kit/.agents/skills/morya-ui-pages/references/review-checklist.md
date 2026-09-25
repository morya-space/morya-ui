# Review checklist

## Contract (all lanes)

- [ ] Only `morya-ui` UI primitives (no second kit)
- [ ] `morya-ui/styles.css` imported at app/demo entry
- [ ] `MConfigProvider` at a sensible root when building a full screen
- [ ] No invented props / events / slots (MCP `get_component` / docs checked)
- [ ] MCP **`validate_usage`** run; no unresolved `unknown-prop` / `unknown-event`
- [ ] Select vs Dropdown roles correct
- [ ] `MTable` uses `rows` (not `data`)
- [ ] One-line results use `message`; summary+detail / async use `toast`
- [ ] Destructive flows use confirm dialogs
- [ ] MCP **`validate_page`** run when generating a full page (advisory suggestions addressed or consciously waived)

## Craft (all lanes — default pass)

- [ ] Style direction resolved: followed user reference/description, or inferred from clear cues, or **asked** when uncertain — never silent invent; **no preset catalog**
- [ ] Lane craft from [visual-craft.md](visual-craft.md) applied
- [ ] If companions ran: still only `M*` + `--m-*`; no second kit ([optional-companions.md](optional-companions.md))
- [ ] At most one primary filled button in the main viewport
- [ ] Copy is domain-real; empty / error states say what to do next
- [ ] No AI-default look clusters unless the user/reference asked for them
- [ ] No unearned atmosphere: stacked radial+linear washes, purple mesh, frosted glass, neon glow stacks
- [ ] Motion (if any) is 1–3 intentional moments and follows `useMotion` / `data-m-motion`

## Ops

- [ ] Matches [page-layouts.md](page-layouts.md) block order (snippets composed; golden page optional check only)
- [ ] `MPage*` used instead of ad-hoc page chrome where applicable
- [ ] List height: if this is a full-viewport main data list, consider `MPageContent fill` + `MTable fill`; if embedded/short/document-scroll, skip `fill`
- [ ] Tables not wrapped in decorative `MCard` solely for borders
- [ ] Filters / toolbar / form actions follow documented patterns
- [ ] Sider `MMenu` items have icons; status cells use `MStatus` (not decorative `MTag`)
- [ ] Empty table uses `MEmpty` (or equivalent next-action empty)
- [ ] No marketing hero bolted onto a CRUD shell

## Account / Flow / System

- [ ] Primary CTA obvious; escape paths present (back / home / support)
- [ ] Auth errors stay on the form via field `errorMessage` or a token `role="alert"`
- [ ] Empty uses `MEmpty`; success / HTTP errors use `MResult`
- [ ] Brand / empty atmosphere follows the **resolved direction** (defaults are flat token shells)
- [ ] Wizard steps: one job each; actions labeled clearly

## Express

- [ ] Short design plan existed (subject, palette roles, signature)
- [ ] First viewport has one job
- [ ] Controls still `M*`; colors/spacing map to `--m-*`
- [ ] Avoided AI-default looks unless user/reference requested them
- [ ] Motion limited and gated by `useMotion` / `data-m-motion`

## Tokens, a11y, responsive

- [ ] No raw hex/rgb theme colors in new CSS (control widths OK inline; `color-mix` from `--m-*` OK)
- [ ] Labels visible; icon buttons have `aria-label`
- [ ] Usable on a narrow viewport
- [ ] Focus visible on interactive elements

When MCP is available, contract checks (**`validate_usage`** / **`validate_page`**) are required.

If the project has `pnpm check:colors`, suggest running it after edits.
