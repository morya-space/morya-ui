# Visual craft (distilled)

Portable craft for morya-ui consumers. Inspired by **Frontend Design**, **Impeccable**, and **UI-UX-Pro-Max** — without requiring those skills to be installed. Implementation must still honor the morya-ui contract.

## When to lean on craft

| Lane | Craft intensity |
| --- | --- |
| Ops CRUD | Low — clarity, density, golden structure |
| Account / Flow / System | Medium — trust, hierarchy, one calm brand cue |
| Express | High — design plan + one signature risk |

## Design plan (Express & branded moments)

Before code, decide:

1. **Color** — 4–6 roles (bg, surface, text, muted, accent, danger). Prefer existing `--m-*`. If the project already customizes theme, extend that system; do not invent a parallel hex soup in scoped CSS.
2. **Type** — display vs body vs utility. For Ops, stick to theme fonts. For Express, a distinctive pairing is OK if fonts are loadable and fallbacks exist.
3. **Layout concept** — one sentence + rough hierarchy (ASCII wireframe optional).
4. **Signature** — the single memorable element (motion, crop, editorial type, product artifact). Everything else quieter.

Critique the plan: if it looks like the plan you would write for *any* SaaS, revise until it fits **this** subject.

## Anti-default looks (AI clusters)

Avoid spending free axes on these unless the brief asks:

1. Warm cream (~`#F4F1EA`) + high-contrast serif + terracotta
2. Near-black + single acid-green / vermilion accent
3. Broadsheet: hairline rules, zero radius, dense newspaper columns
4. Purple-on-white / purple-to-indigo gradient SaaS cliché
5. Glow stacks, pill chip clouds, emoji as decoration, multi-layer shadows as personality

Also avoid: Inter/Roboto/Arial as the *expressive* display choice on Express surfaces when the brief allows character (utility UI may keep system/theme fonts).

## Hierarchy & composition

- **Hero is a thesis** (Express): one job in the first viewport — not stats + schedule + promos together.
- **Structure encodes meaning**: numbered steps only when order is real information.
- **Cards**: default off for Express heroes; use `MCard` when it groups an interaction or plan choice.
- **Motion**: orchestrate 2–3 intentional moments max; respect `prefers-reduced-motion`. Prefer transform/opacity over layout thrash.
- **Density**: Ops may be compact; Express needs breathing room — match the lane.

## UX writing

- Name controls by user intent (`保存更改`), not system guts (`提交表单实体`).
- Active voice; same verb through the flow (Publish → Published).
- Errors: what failed + how to fix; no vague apology.
- Empty states: invitation to act, not a dead end.
- Ops copy stays plain; Express may have voice, still specific to the product.

## Polish modes (Impeccable-inspired)

When the user asks to improve an existing surface, pick a mode:

| Mode | Intent |
| --- | --- |
| `audit` | Hierarchy, contrast, a11y, spacing, anti-patterns — report then fix |
| `clarify` | Labels, errors, empty copy, button verbs |
| `quieter` | Remove competing accents, chips, shadows; keep one focus |
| `bolder` | Strengthen the signature only; do not shout everywhere |
| `typeset` | Scale, weight, line-length, truncation |
| `adapt` | Responsive breakpoints; touch targets |
| `delight` | One tasteful micro-interaction — never clutter |

Always remediate with `M*` + tokens, not raw replacement controls.

## Industry / mood (UI-UX-Pro-Max-inspired)

For Express briefs that only say “modern / professional / playful”:

1. Infer industry from the product (fintech ≠ kids education).
2. Pick mood keywords (e.g. “editorial + precise”, “warm workshop”, “clinical calm”).
3. Map mood → token roles and signature — **then** implement with morya-ui.
4. Discard any suggestion to switch stacks (shadcn, generic Tailwind kit, etc.).

## Quality floor (all lanes)

- Responsive to a usable mobile layout
- Visible `:focus-visible`
- Keyboard reaches primary actions
- No raw theme colors that break dark mode when the app supports it
- Icons decorative vs informative handled correctly (`aria-hidden` vs `aria-label`)
