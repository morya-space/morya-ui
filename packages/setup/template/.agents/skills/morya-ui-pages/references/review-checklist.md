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

- [ ] Lane craft from [visual-craft.md](visual-craft.md) applied (Ops polish and/or atmosphere)
- [ ] At most one primary filled button in the main viewport
- [ ] Copy is domain-real; empty / error states say what to do next
- [ ] No AI-default look clusters unless the brief asked for them
- [ ] Motion (if any) is 1–3 intentional moments and follows `useMotion` / `data-m-motion` (not OS `prefers-reduced-motion`)

## Ops

- [ ] Matches golden / [page-layouts.md](page-layouts.md) block order
- [ ] `MPage*` used instead of ad-hoc page chrome where applicable
- [ ] List height: if this is a full-viewport main data list, consider `MPageContent fill` + `MTable fill`; if embedded/short/document-scroll, skip `fill`
- [ ] Tables not wrapped in decorative `MCard` solely for borders
- [ ] Filters / toolbar / form actions follow documented patterns
- [ ] Sider `MMenu` items have icons; status cells use `MStatus` (not decorative `MTag`)
- [ ] Empty table uses `MEmpty` (or equivalent next-action empty)
- [ ] No marketing hero bolted onto a CRUD shell

## Account / Flow / System

- [ ] Primary CTA obvious; escape paths present (back / home / support)
- [ ] Auth errors stay on the form via field `errorMessage` or a token `role="alert"` (`<MMessage>` is the message host, not an inline alert)
- [ ] Empty uses `MEmpty` (or table `#empty` with `MEmpty`); success / HTTP errors use `MResult`
- [ ] Empty / success states tell the user the next action
- [ ] Inline status prefers `MStatus`; chip-like labels use `MTag`
- [ ] Wizard steps: one job each; actions labeled clearly
- [ ] Brand / empty atmosphere uses token-only CSS (see visual-craft recipes)

## Express

- [ ] Short design plan existed (subject, palette roles, signature)
- [ ] First viewport has one job (not a dashboard of promos)
- [ ] Controls still `M*`; colors/spacing map to `--m-*` / theme
- [ ] Avoided AI-default looks unless brief requested them ([visual-craft.md](visual-craft.md))
- [ ] Motion limited and respectful of reduced-motion

## Tokens, a11y, responsive

- [ ] No raw hex/rgb theme colors in new CSS (control widths OK inline; `color-mix` from `--m-*` OK)
- [ ] Labels visible; icon buttons have `aria-label`
- [ ] Usable on a narrow viewport
- [ ] Focus visible on interactive elements

When MCP is available, contract checks above (**`validate_usage`** / **`validate_page`**) are required — not optional.

If the project has `pnpm check:colors`, suggest running it after edits.
