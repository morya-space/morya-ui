---
name: morya-ui-pages
description: >
  Build, redesign, critique, or polish any Vue 3 UI surface that should use the
  morya-ui component library — admin CRUD (list, form, dashboard, detail,
  settings), auth and onboarding, empty and error states, wizards, overlays,
  marketing/landing and pricing pages, docs chrome, and hybrid product UI.
  Trigger on: morya-ui, M* components, --m-* tokens, golden pages, 后台页,
  列表页, 表单页, 仪表盘, 登录页, 注册, 空状态, 向导, 落地页, 官网, landing,
  login, dashboard, settings, onboarding, or “用组件库做页面”. Prefer this
  skill over generic frontend-design, impeccable, or ui-ux-pro-max when the
  implementation stack is morya-ui; those companions may inform taste only.
  Do not use for backend-only work or for authoring new components inside the
  morya-ui library source itself.
---

# Morya UI Pages

Guide agents that **consume morya-ui** across the full product surface — not only admin CRUD.

Two layers always apply:

1. **Contract** — only `M*` controls, `--m-*` tokens, real APIs (MCP/docs). Never invent props or mix UI kits.
2. **Craft** — pick the right surface pattern, then apply intentional visual direction (distilled from Frontend Design / Impeccable / UI-UX-Pro-Max ideas). Admin golden pages stay disciplined; expressive surfaces (landing, auth brand moments, empty states) may take a justified aesthetic risk — still on-token and on-component.

When companions conflict with this skill or project `DESIGN.md`, **this skill wins**.

## Surface map (pick one first)

| Lane | Surfaces | Primary references |
| --- | --- | --- |
| **Ops** | list, form, dashboard, detail, settings, filter drawer, CRUD dialog | [page-layouts.md](references/page-layouts.md), golden pages |
| **Account** | login, register, invite, forgot/reset password, profile | [surfaces.md](references/surfaces.md) § Account |
| **Flow** | onboarding, empty state, wizard/stepper, success/result | [surfaces.md](references/surfaces.md) § Flow |
| **System** | 404 / error, permission denied, maintenance | [surfaces.md](references/surfaces.md) § System |
| **Express** | marketing landing, pricing, feature showcase, docs marketing chrome | [surfaces.md](references/surfaces.md) § Express + [visual-craft.md](references/visual-craft.md) |
| **Overlay** | dialog, drawer, popover, command menu as the main UI | [surfaces.md](references/surfaces.md) § Overlay |

Unclear brief → ask **one** short question, or default: Ops → closest golden page; public marketing → Express.

Full taxonomy: [references/surfaces.md](references/surfaces.md).

## Prerequisites

1. `morya-ui` installed; `morya-ui/styles.css` imported.
2. Prefer `@morya-ui/mcp` — never invent prop / event / slot names.
3. Golden pages, component APIs, and feedback rules come from `@morya-ui/mcp`. Without MCP, use this skill's `references/`. Project `DESIGN.md` overrides generic taste when the AI pack is merged.

## Workflow

### 1. Pin subject, audience, surface, job

State explicitly (even briefly in thinking):

- **Subject** — product / domain vernacular (not generic “SaaS”)
- **Audience** — who uses this screen
- **Surface** — from the map above
- **Single job** — what the first viewport must accomplish

For Express / branded Account moments, also draft a tiny **design plan** (see [visual-craft.md](references/visual-craft.md)): palette roles mapped to `--m-*` (extend only if the project already customizes theme), type roles, layout concept, one signature element. Skip the full plan for routine Ops CRUD unless the user asks for a redesign.

### 2. Load the smallest useful references

| Need | Prefer (MCP) | Else read |
| --- | --- | --- |
| Ops pattern | `recommend_page` → **`get_golden_page`** (mirror; do not invent a parallel scaffold aesthetic) | [page-layouts.md](references/page-layouts.md) |
| Account / Express / empty / result | `recommend_page` → `get_golden_page` (`login-page` / `landing-page` / `empty-state` / `result-page`) | [surfaces.md](references/surfaces.md) |
| Visual direction | — | [visual-craft.md](references/visual-craft.md) (Ops polish / atmosphere / anti-defaults) |
| Components / **API truth** | `search` / **`get_component`** / `get_example` / `recommend_component` | [component-index.md](references/component-index.md) |
| Tokens / rules | `get_design_rules` | [design-system.md](references/design-system.md) |
| Snippet | `get_page_snippet` | golden / surface excerpt |
| Feedback API | — | [feedback.md](references/feedback.md) |
| **Required checks** | **`validate_usage`** (every `M*` you used) + `validate_page` | [review-checklist.md](references/review-checklist.md) |

### 3. Compose

**Ops:** mirror golden-page block order; prefer `MPage*` over custom chrome.

**Account / Flow / System:** centered or split shells with `MCard` / `MForm` / `MEmpty` / `MResult` (see surfaces); keep controls as `M*`. Persistent form errors use field `errorMessage` or a token-styled `role="alert"` — `<MMessage>` is the `message` host, not an inline alert.

**Express:** hero + sections with intentional hierarchy; interactive bits still `MButton` / `MTag` / etc.; atmosphere via layout, motion, and tokens — not a second component library.

**Overlay:** build the host page lightly; put the real job inside `MDialog` / `MDrawer` / `MCommandMenu`.

### 4. Wire real API usage

- Import from `morya-ui` (or documented subpath + style).
- Forms: `MForm` + fields; `@submit` + `type="submit"`.
- Tables: `columns` + `rows` + `row-key`; `#cell-{key}`. There is no `data` prop.
- Enums → `MSelect` / `MTreeSelect`; action menus → `MDropdown`.
- Destructive → `MConfirmDialog` / `MConfirmPopup`.
- Feedback → default **`message`**; `toast` only for summary+detail / async. See [feedback.md](references/feedback.md).
- Motion → intensity with `useMotion` (`full` / `reduced` / `none`); overlay enter/exit with `transition` prop or `createMoryaUI({ motion: { transitions } })` — do not invent a second animation stack. Prefer MCP / docs `motion` guide.
- **Before craft:** for each unfamiliar or newly written `M*` usage, call MCP **`get_component` / `get_example`**, then **`validate_usage`**. Fix every `unknown-prop` / `unknown-event` before delivery.
- `recommend_page(includeScaffold: true)` returns the **golden page source** when one exists — remap copy/data only; never treat generated fallback as the visual target.

### 5. Craft pass (always — lane-aware)

Run **before** delivery. Do not stop at a structurally correct shell.

- **Ops:** apply [visual-craft.md](references/visual-craft.md) § Ops polish (one primary, menu icons, `MStatus` in tables, designed empty, no decorative cards).
- **Account / Flow:** one calm brand or empty-state cue from § Atmosphere recipes; form errors via `errorMessage` / token `role="alert"`.
- **Express:** short design plan + one signature; avoid AI-default looks; optional 1–2 token-only motions; intensity via `useMotion` (`full` / `reduced` / `none`), not the OS `prefers-reduced-motion` setting.
- **All lanes:** responsive, focus visible, domain-real copy (active voice).

Named polish modes (`quieter` | `bolder` | `clarify` | `audit` | …): use as an **extra** pass when the user asks to improve an existing screen. See [visual-craft.md](references/visual-craft.md) § Polish modes.

### 6. Review

Use [review-checklist.md](references/review-checklist.md) (contract + craft sections).

**Required when MCP is available:**

1. `validate_usage` on the page (or per component) — API accuracy gate  
2. `validate_page` — layout / token / contract advisories  

Do not deliver with unresolved `unknown-prop` / `unknown-event`.

## Hard boundaries

- No second UI kit on the same surface.
- No hand-rolled table/modal when `MTable` / `MDialog` / `MDrawer` fit.
- No invented props / events / slots.
- No defaulting every success to `toast`.
- No substituting a generated scaffold for `get_golden_page` when a golden sample exists.
- Ops surfaces follow golden layouts first — do not replace them with marketing heroes.
- Express surfaces still use `M*` for controls and `--m-*` for color/space; do not introduce shadcn/Element/etc. stacks suggested by generic design skills.
- Soft-load companions only; never require Impeccable / UI-UX-Pro-Max / Frontend Design to be installed.

## Soft companions

If already installed in the consumer project:

| Companion | After contract is fixed, may help with |
| --- | --- |
| `frontend-design` | Distinctive Express / brand moments |
| `impeccable` | Named polish / audit passes |
| `ui-ux-pro-max` | Mood / industry keywords for Express only |

Details: [optional-companions.md](references/optional-companions.md). Distilled craft lives in [visual-craft.md](references/visual-craft.md) so this skill works **standalone**.

## Output expectations

- Vue 3 `<script setup lang="ts">`.
- PascalCase `M*` in templates.
- Domain-real copy and data shapes (not placeholder “示例 / Name / No data” when the brief names a product).
- Scoped CSS minimal; tokens only (`color-mix` / gradients from `--m-*` OK; control widths may be inline).
- Craft pass completed for the lane (see step 5).
- For multi-file asks: sensible `views/` / `components/` split; otherwise one SFC is fine.

## Bundled references

| File | Read when |
| --- | --- |
| [surfaces.md](references/surfaces.md) | Choosing / composing non-Ops (and hybrid) surfaces |
| [page-layouts.md](references/page-layouts.md) | Ops golden layouts |
| [visual-craft.md](references/visual-craft.md) | Ops polish, atmosphere recipes, anti-defaults, polish modes |
| [design-system.md](references/design-system.md) | Principles, tokens, bans |
| [component-index.md](references/component-index.md) | Scenario → component |
| [feedback.md](references/feedback.md) | message / toast / MMessage |
| [review-checklist.md](references/review-checklist.md) | Pre-delivery checks |
| [optional-companions.md](references/optional-companions.md) | Combining with external design skills |
