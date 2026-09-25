# Visual craft (distilled)

Portable craft for morya-ui consumers. Inspired by **Frontend Design**, **Impeccable**, and **UI-UX-Pro-Max** — without requiring those skills to be installed. Implementation must still honor the morya-ui contract.

## When to lean on craft

| Lane | Craft intensity | Default pass |
| --- | --- | --- |
| Ops CRUD | Low — clarity, density, golden structure | **Always** run § Ops polish |
| Account / Flow / System | Medium — trust, hierarchy, one calm brand cue | **Always** run § Atmosphere recipes when relevant |
| Express | High — design plan + one signature risk | **Always** run design plan + anti-defaults |

Do **not** skip craft because the page is “just admin”. Polished Ops is quiet, aligned, and specific — not decorative.

**Style is not fixed to the golden look.** Resolve direction first ([style-presets.md](style-presets.md)): reference → named preset → prompt cues → offer a choice. Golden pages define structure; presets / references define craft variety so pages do not all look stiff and identical.

Market skills (**Frontend Design**, **Impeccable**, **UI-UX-Pro-Max**) deepen taste when installed — see [optional-companions.md](optional-companions.md). This file keeps a **distilled** subset so the skill stays standalone.

## Companion bridge (distilled)

Use these even when companions are **not** installed. If they **are** installed, run the matching companion pass **after** structure + contract, then remediate with `M*` + `--m-*`.

### Subject first (Frontend Design)

- Name a concrete **subject**, **audience**, and **single job** before visual choices.
- Pull personality from the subject’s world (materials, artifacts, vernacular) — not from a generic “SaaS admin” mood board.
- **One signature risk** per surface; everything else quieter (Chanel: remove one accessory).

### Mode (Impeccable)

| Mode | Use when | Craft budget |
| --- | --- | --- |
| **Operate** | Ops lists, forms, settings, tools | Clarity, density, style preset; no marketing hero |
| **Persuade** | Landing, pricing, campaign | Design plan + signature; controls still `M*` |
| **Read** | Docs / long detail | Typeset + measure; calm chrome |
| **Experience** | Gallery / showcase | Artifact leads; UI recedes |

### Design plan (Express & branded Account — Frontend Design)

Before code, decide:

1. **Color** — 4–6 roles (bg, surface, text, muted, accent, danger). Prefer existing `--m-*`. If the project already customizes theme, extend that system; do not invent a parallel hex soup in scoped CSS. (Companions may suggest hex — **map** them onto tokens.)
2. **Type** — display vs body vs utility. For Ops / Operate, stick to theme fonts. For Express / Persuade, a distinctive pairing is OK if fonts are loadable and fallbacks exist.
3. **Layout concept** — one sentence + rough hierarchy (ASCII wireframe optional). Structure encodes meaning; numbered `01/02/03` only when order is real information.
4. **Signature** — the single memorable element (motion, crop, editorial type, product artifact). Everything else quieter.

Critique the plan: if it looks like the plan you would write for *any* SaaS, revise until it fits **this** subject. Brief / reference / named style preset **wins** over companion defaults.

## Ops polish (baseline — every Operate / Ops page)

Apply after the golden block order is correct **and** a style direction is resolved. These are **required** baseline rules; presets may change density/chrome on top:

1. **One primary** — exactly one filled `severity="primary"` in the main viewport (usually toolbar create / form save). Query can be primary; reset stays secondary.
2. **Sider icons** — every top-level `MMenu` item has an `icon`; icons come from one set (built-in Tabler names). No random emoji.
3. **Status cells** — row business state → `MStatus` (dot + label). `MTag` only for categories, filters, or closable chips.
4. **Row actions** — secondary `text` / `outlined` / `size="small"`; danger only on destructive. Prefer `MSpace` with a consistent gap; avoid a wall of filled buttons.
5. **Filter rhythm** — search ~`14rem`, compact selects ~`10–12rem`; wrap with `MSpace wrap`. Do not stretch filters full-bleed. Secondary fields → `MPageFilters collapsible` + `#advanced`; active criteria → `MPageFilterChips` + closable `MTag`.
6. **Empty is designed** — `MEmpty` (or table `#empty` with `MEmpty`) with a next action; never a silent blank table or a lone muted sentence.
7. **No extra cards** — do not wrap `MPageFilters` / `MTable` in decorative `MCard` “for polish”. Dashboard chart/detail modules may use `MCard`.
8. **Domain copy** — column labels, placeholders, and empty titles use product vernacular, not “Name / Status / No data”.
9. **Density** — prefer theme default; use `size="small"` on dense tables inside cards. Do not invent a second spacing scale.
10. **Quiet chrome** — breadcrumb + toolbar title are enough hierarchy; skip marketing heroes, pill-stat strips, and glow on Ops shells.

Ops beauty = **alignment + semantics + restraint**, not gradients.

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
- **Motion**: orchestrate 2–3 intentional moments max; gate custom CSS motion with `[data-m-motion="full"]` (library intensity from `useMotion`). Prefer transform/opacity over layout thrash.
- **Density**: Ops may be compact; Express needs breathing room — match the lane.

## Atmosphere recipes (token-only)

Copy patterns, remap brand copy. **No hex.** Prefer `color-mix` / gradients from `--m-*`. See golden pages `login-page`, `landing-page`, `empty-state`.

### Account — split brand panel

```css
.login-brand {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--m-space-4);
  padding: clamp(2rem, 6vw, 4.5rem);
  background:
    radial-gradient(
      80% 60% at 10% 20%,
      color-mix(in srgb, var(--m-color-primary) 22%, transparent),
      transparent 55%
    ),
    linear-gradient(
      165deg,
      color-mix(in srgb, var(--m-color-primary) 16%, var(--m-color-surface)) 0%,
      var(--m-color-surface) 55%,
      color-mix(in srgb, var(--m-color-border) 35%, var(--m-color-surface)) 100%
    );
  border-right: 1px solid var(--m-color-border);
}
.login-brand__title {
  margin: 0;
  max-width: 12em;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 650;
  line-height: 1.15;
  letter-spacing: -0.03em;
}
```

Form side stays calm: one panel ~`22rem`, token `role="alert"` for form-level errors (not Toast, not `<MMessage severity>`).

### Express — hero plane

Full-bleed thesis: brand mark (small) → one headline → one lead → CTA group → **one** dominant visual (timeline, product artifact, or edge-to-edge wash). Atmosphere:

```css
.landing-hero__visual {
  margin-top: var(--m-space-5);
  padding: var(--m-space-5);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--m-color-primary) 12%, var(--m-color-surface)),
      var(--m-color-surface) 60%
    );
}
```

Optional micro-motion (one signature only):

```css
[data-m-motion="full"] .landing-hero__track span {
  animation: m-craft-fade-up 480ms ease both;
}
[data-m-motion="full"] .landing-hero__track span:nth-child(2) { animation-delay: 60ms; }
[data-m-motion="full"] .landing-hero__track span:nth-child(3) { animation-delay: 120ms; }
[data-m-motion="full"] .landing-hero__track span:nth-child(4) { animation-delay: 180ms; }
@keyframes m-craft-fade-up {
  from { opacity: 0; transform: translateY(0.4rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Flow — empty state shell

```css
.empty-state-shell {
  border: 1px dashed color-mix(in srgb, var(--m-color-border) 80%, var(--m-color-primary));
  border-radius: var(--m-radius-md);
  background:
    radial-gradient(
      120% 80% at 50% 0%,
      color-mix(in srgb, var(--m-color-primary) 10%, transparent),
      transparent 55%
    ),
    var(--m-color-surface);
}
```

Pair with `MEmpty` + primary next step + optional secondary text button. One memory cue (icon / wash) — no emoji collage.

## UX writing

- Name controls by user intent (`保存更改`), not system guts (`提交表单实体`).
- Active voice; same verb through the flow (Publish → Published).
- Errors: what failed + how to fix; no vague apology.
- Empty states: invitation to act, not a dead end.
- Ops copy stays plain; Express may have voice, still specific to the product.

## Polish modes (Impeccable-inspired)

**Default:** after compose, run a lane-appropriate light pass (§ Ops polish and/or atmosphere / design plan).

When the user asks to improve an existing surface — or when `impeccable` is installed — pick a named mode:

| Mode | Intent | Companion command (if installed) |
| --- | --- | --- |
| `audit` | Hierarchy, contrast, a11y, spacing, anti-patterns — report then fix | `impeccable audit` / `critique` |
| `clarify` | Labels, errors, empty copy, button verbs | `impeccable clarify` |
| `quieter` | Remove competing accents, chips, shadows; keep one focus | `impeccable quieter` |
| `bolder` | Strengthen the signature / style preset only; do not shout everywhere | `impeccable bolder` |
| `typeset` | Scale, weight, line-length, truncation | `impeccable typeset` |
| `adapt` | Responsive breakpoints; touch targets | `impeccable adapt` |
| `delight` | One tasteful micro-interaction — never clutter | `impeccable delight` / `animate` |
| `polish` | Final ship pass: Ops polish + style cues + a11y basics | `impeccable polish` |

Always remediate with `M*` + tokens, not raw replacement controls. Full routing: [optional-companions.md](optional-companions.md).

## Industry / mood (UI-UX-Pro-Max-inspired)

For Express briefs that only say “modern / professional / playful”:

1. Infer industry from the product (fintech ≠ kids education).
2. Pick mood keywords (e.g. “editorial + precise”, “warm workshop”, “clinical calm”).
3. Map mood → [style preset](style-presets.md) and/or token roles and signature — **then** implement with morya-ui.
4. If `ui-ux-pro-max` is installed, use it for **keyword / palette search only**; discard any suggestion to switch stacks (shadcn, generic Tailwind kit, etc.).

## Quality floor (all lanes)

- Responsive to a usable mobile layout
- Visible `:focus-visible`
- Keyboard reaches primary actions
- No raw theme colors that break dark mode when the app supports it
- Icons decorative vs informative handled correctly (`aria-hidden` vs `aria-label`)
- Craft pass completed for the lane (Ops polish and/or atmosphere / design plan) before delivery
- If a companion ran: still pass MCP `validate_usage` / `validate_page`
