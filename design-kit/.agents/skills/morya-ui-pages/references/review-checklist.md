# Review checklist

## Contract (all lanes)

- [ ] Only `morya-ui` UI primitives (no second kit)
- [ ] `morya-ui/styles.css` imported at app/demo entry
- [ ] `MConfigProvider` at a sensible root when building a full screen
- [ ] No invented props / events / slots (MCP or docs checked)
- [ ] Select vs Dropdown roles correct
- [ ] One-line results use `message`; summary+detail / async use `toast`
- [ ] Destructive flows use confirm dialogs

## Ops

- [ ] Matches golden / [page-layouts.md](page-layouts.md) block order
- [ ] `MPage*` used instead of ad-hoc page chrome where applicable
- [ ] Tables not wrapped in decorative `MCard` solely for borders
- [ ] Filters / toolbar / form actions follow documented patterns
- [ ] No marketing hero bolted onto a CRUD shell

## Account / Flow / System

- [ ] Primary CTA obvious; escape paths present (back / home / support)
- [ ] Auth errors persistent via `<MMessage>` or field errors where appropriate
- [ ] Empty uses `MEmpty` (or table `#empty` with `MEmpty`); success / HTTP errors use `MResult`
- [ ] Empty / success states tell the user the next action
- [ ] Inline status prefers `MStatus`; chip-like labels use `MTag`
- [ ] Wizard steps: one job each; actions labeled clearly

## Express

- [ ] Short design plan existed (subject, palette roles, signature)
- [ ] First viewport has one job (not a dashboard of promos)
- [ ] Controls still `M*`; colors/spacing map to `--m-*` / theme
- [ ] Avoided AI-default looks unless brief requested them ([visual-craft.md](visual-craft.md))
- [ ] Motion limited and respectful of reduced-motion

## Tokens, a11y, responsive

- [ ] No raw hex/rgb theme colors in new CSS (control widths OK inline)
- [ ] Labels visible; icon buttons have `aria-label`
- [ ] Usable on a narrow viewport
- [ ] Focus visible on interactive elements

## Optional MCP

- [ ] `validate_page` / `validate_usage` reviewed when available

If the project has `pnpm check:colors`, suggest running it after edits.
