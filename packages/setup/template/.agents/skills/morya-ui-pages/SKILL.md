---
name: morya-ui-pages
description: >
  Build, redesign, critique, or polish any Vue 3 UI surface that should use the
  morya-ui component library — admin CRUD (list, form, dashboard, detail,
  settings), auth and onboarding, empty and error states, wizards, overlays,
  marketing/landing and pricing pages, docs chrome, and hybrid product UI.
  Trigger on: morya-ui, M* components, --m-* tokens, golden pages, page snippets,
  后台页, 列表页, 表单页, 仪表盘, 登录页, 注册, 空状态, 向导, 落地页, 官网,
  landing, login, dashboard, settings, onboarding, or “用组件库做页面”. Prefer
  this skill over generic frontend-design, impeccable, or ui-ux-pro-max when the
  implementation stack is morya-ui; those companions may deepen taste and polish
  after structure/contract are fixed (see references/optional-companions.md).
  Do not use for backend-only work or for authoring new components inside the
  morya-ui library source itself.
---

# Morya UI Pages

Guide agents that **consume morya-ui** across the full product surface — not only admin CRUD.

## Must follow (restrained)

1. **Contract first** — only `M*` + `--m-*` + real MCP/docs APIs. No second UI kit, no invented props.
2. **Default quieter** — no reference / vague ask → quiet flat on-token face. Do not invent glass, neon, aurora, or marketing heroes.
3. **Reference wins atmosphere** — if the user gives a screenshot/mock/description, follow traits that appear there (map via [reference-visual-map.md](references/reference-visual-map.md)); do **not** strip them to “look safer,” and do **not** add decorations the reference lacks.
4. **Say the direction** — in the reply, one line `style:` + optional `signature:` (e.g. `style: quiet flat`, or `style: follow reference — soft frosted cards + round primary`).
5. **Gate** — `validate_usage` + `validate_page({ brief })`. With a visual reference, also run the fidelity check in [review-checklist.md](references/review-checklist.md).

**Default build path:** pin surface → **`map_reference` / `recommend_page({ brief, density })`** → decisions + snippets → shell only if needed → craft → **`validate_usage` + `validate_page`**. Golden pages are an **optional** block-order check.

When companions conflict with this skill or project `DESIGN.md`, **this skill wins**.

## Surface map (pick one first)

| Lane | Surfaces | Primary references |
| --- | --- | --- |
| **Ops** | list, form, dashboard, detail, settings, filter drawer, CRUD dialog | [page-layouts.md](references/page-layouts.md) block order + snippets |
| **Account** | login, register, invite, forgot/reset password, profile | [surfaces.md](references/surfaces.md) § Account + `auth-split-shell` |
| **Flow** | onboarding, empty state, wizard/stepper, success/result | [surfaces.md](references/surfaces.md) § Flow + empty/result/wizard snippets |
| **System** | 404 / error, permission denied, maintenance | [surfaces.md](references/surfaces.md) § System |
| **Express** | marketing landing, pricing, feature showcase, docs marketing chrome | [surfaces.md](references/surfaces.md) § Express + [visual-craft.md](references/visual-craft.md) |
| **Overlay** | dialog, drawer, popover, command menu as the main UI | [surfaces.md](references/surfaces.md) § Overlay + form-in-dialog/drawer snippets |

Unclear brief → ask **one** short question, or default: Ops → closest page-layout checklist + snippets; public marketing → Express.

Full taxonomy: [references/surfaces.md](references/surfaces.md).

## Prerequisites

1. `morya-ui` installed; `morya-ui/styles.css` imported.
2. Prefer `@morya-ui/mcp` — never invent prop / event / slot names.
3. Component APIs, decision recipes, page snippets, and feedback rules come from `@morya-ui/mcp`. Golden pages are optional assembly demos. Without MCP, use this skill's `references/`. Project `DESIGN.md` overrides generic taste when the AI pack is merged.

## Workflow

### 1. Pin subject, audience, surface, job, **style**

State explicitly (even briefly in thinking):

- **Subject** — product / domain vernacular (not generic “SaaS”)
- **Audience** — who uses this screen
- **Surface** — from the map above
- **Single job** — what the first viewport must accomplish
- **Style direction** — resolve in this order (see [style-presets.md](references/style-presets.md); **no preset catalog**):
  1. User **reference** or **explicit description** → **must follow** (map to `--m-*` + `M*`; never substitute another face)
  2. No description, but **clear prompt cues** → infer and **state your reading** in one sentence
  3. **Uncertain** → **ask once** for a description or reference; do not invent the full look first
  4. User says “直接写 / 你看着办” with still no cues → quiet flat on-token admin face, **say so**; never default glass/neon/aurora

Golden pages (when used) lock **block order**, not aesthetics. Blindly cloning golden visuals makes pages feel stiff — prefer composing snippets.

For Express / branded Account moments, also draft a tiny **design plan** (see [visual-craft.md](references/visual-craft.md)): palette roles mapped to `--m-*` (extend only if the project already customizes theme), type roles, layout concept, one signature element. For Ops, Ops polish + the resolved direction is enough unless the user asks for a redesign.

### 2. Load the smallest useful references

| Need | Prefer (MCP) | Else read |
| --- | --- | --- |
| Reference fidelity | **`map_reference`** (description / requiredBlocks / density) → follow `mapping` | Describe blocks in chat; compose matching snippets |
| Ops pattern + snippets | `recommend_page({ density, brief })` → **`suggestedSnippets`** / **`referenceMapping`** / **`get_page_snippet`** + **`recommend_component`** | [page-layouts.md](references/page-layouts.md) + [decision-recipes.md](references/decision-recipes.md) |
| Style direction | `recommend_page({ style })` / **`get_style_direction`** | [style-presets.md](references/style-presets.md) |
| Screenshot / mock → library moves | — | [reference-visual-map.md](references/reference-visual-map.md) |
| Signature shells (Account / Express / Flow) | **`get_style_shells`** (`account-split`, `express-hero`, …) | [visual-craft.md](references/visual-craft.md) |
| Account / Express / empty / result | snippets (`auth-split-shell`, `empty-block`, `result-block`, …) + `recommend_page` | [surfaces.md](references/surfaces.md) |
| Optional whole-page block order | `get_golden_page` only when unsure of section order or user asks to mirror a golden sample | [page-layouts.md](references/page-layouts.md) |
| Visual direction | — | [visual-craft.md](references/visual-craft.md) + [style-presets.md](references/style-presets.md) |
| Components / **API truth** | `search` / **`get_component`** / `get_example` / **`recommend_component`** (L2 recipes + `relatedSnippets`) | [decision-recipes.md](references/decision-recipes.md) + [component-index.md](references/component-index.md) |
| Tokens / rules / theme override | `get_design_rules` | [design-system.md](references/design-system.md) + project `DESIGN.md` § 主题覆盖 |
| Feedback API | — | [feedback.md](references/feedback.md) |
| **Required checks** | **`validate_usage`** + **`validate_page({ brief })`** (contract must pass; craft may be waived) | [review-checklist.md](references/review-checklist.md) |

### 3. Compose

**Ops:** follow [page-layouts.md](references/page-layouts.md) **block-order checklist**; fill each block with **`get_page_snippet`** / `suggestedSnippets` (filters, table, header actions, form-in-dialog, confirm-delete, …). Apply the resolved **style direction** for density/chrome/copy; prefer `MPage*` over custom chrome. Do not freeze every Ops page into identical chrome. List density/sider cues (`dense` / `rail`) inform craft — do not invent new golden-page variants.

**Account / Flow / System:** centered or split shells with `MCard` / `MForm` / `MEmpty` / `MResult` (see surfaces + snippets); keep controls as `M*`. Persistent form errors use field `errorMessage` or a token-styled `role="alert"` — `<MMessage>` is the `message` host, not an inline alert.

**Express:** hero + sections with intentional hierarchy; interactive bits still `MButton` / `MTag` / etc.; atmosphere via layout, motion, and tokens — not a second component library.

**Overlay:** build the host page lightly; put the real job inside `MDialog` / `MDrawer` / `MCommandMenu` (use `form-in-dialog` / `form-in-drawer` snippets).

### 4. Wire real API usage

- Import from `morya-ui` (or documented subpath + style).
- **Selection + key props:** call MCP **`recommend_component`** (by query or `decision` id) and apply the returned **recipe** (`props` / `slots` / `events`), **antiPatterns**, and **`relatedSnippets`**. Without MCP, read [decision-recipes.md](references/decision-recipes.md). Then confirm full API with `get_component` / `get_example`.
- Forms: `MForm` + fields; `@submit` + `type="submit"` (or documented footer button pattern on `form-in-dialog` snippet).
- Tables: `columns` + `rows` + `row-key`; `#cell-{key}`. There is no `data` prop. For full-viewport admin lists whose main job is one table, consider `MPageContent fill` + `MTable fill paginator`; skip `fill` for embedded/short/whole-page-scroll cases (see [page-layouts.md](references/page-layouts.md)).
- Enums → `MSelect` / `MTreeSelect`; action menus → `MDropdown`.
- Destructive → `MConfirmDialog` / `MConfirmPopup` (`confirm-choice` + `confirm-delete` snippet).
- Feedback → default **`message`**; `toast` only for summary+detail / async; persistent form errors → `errorMessage` / `role="alert"` (`feedback-choice`). See [feedback.md](references/feedback.md).
- Motion → intensity with `useMotion` (`full` / `reduced` / `none`); overlay enter/exit with `transition` prop or `createMoryaUI({ motion: { transitions } })` — do not invent a second animation stack. Prefer MCP / docs `motion` guide.
- **Before craft:** for each unfamiliar or newly written `M*` usage, call MCP **`get_component` / `get_example`**, then **`validate_usage`**. Fix every `unknown-prop` / `unknown-event` before delivery.
- `recommend_page(includeScaffold: true)` may return golden source as a **structure reference** — remap copy/data only; default path does **not** require cloning the whole page. Never treat generated fallback as the visual target.

### 5. Craft pass (always — lane-aware + companions)

Run **before** delivery. Do not stop at a structurally correct shell.

1. Resolve **style direction** ([style-presets.md](references/style-presets.md)) — reference first; else cues; else **ask**; else quieter flat. **No preset catalog.**
2. If a screenshot/mock is present, translate visible traits with [reference-visual-map.md](references/reference-visual-map.md) — approximate with `M*` + tokens; state what cannot be 1:1.
3. Apply lane craft from [visual-craft.md](references/visual-craft.md):
   - **Ops / Operate:** resolved direction + § Ops polish (one primary, menu icons, `MStatus`, designed empty, no decorative cards). Stay restrained unless the reference shows more.
   - **Account / Flow:** calm shell; form errors via `errorMessage` / token `role="alert"`.
   - **Express / Persuade:** short design plan + one signature **only when** the brief/reference calls for it; optional 1–2 token-only motions via `useMotion`.
4. **If companions are already installed** (see [optional-companions.md](references/optional-companions.md)):
   - Express / brand → may load **`frontend-design`** after contract **and style direction** are fixed
   - User asks 更大胆/更克制/polish/audit → may load **`impeccable`** **inside** the resolved direction
   - Mood keywords only → optional **`ui-ux-pro-max`** search → map to `--m-*`
   - a11y → optional **`fixing-accessibility`**
   - Max **one** visual companion; remediate with `M*` + `--m-*`; strip companion atmosphere the user/reference did not ask for
5. Companions absent → do **not** block or ask to install mid-task.
6. **All lanes:** responsive, focus visible, domain-real copy. State `style:` (+ `signature:` when useful) before delivery.

Named polish modes (`quieter` | `bolder` | `clarify` | `audit` | …): extra pass when the user asks to improve an existing screen.

### 6. Review

Use [review-checklist.md](references/review-checklist.md) (contract + craft sections).

**Required when MCP is available:**

1. `validate_usage` on the page (or per component) — API accuracy gate  
2. `validate_page` with the **same `brief`** used in `map_reference` / `recommend_page` — **`ok` must be true** (contract); craft suggestions addressed or consciously waived  
3. **Required** fidelity check when the user gave a visual reference (see [review-checklist.md](references/review-checklist.md) § Reference fidelity)

Do not deliver with unresolved `unknown-prop` / `unknown-event` or `validate_page` contract failures (`brief-missing-*`, wrong table props, …).

## Hard boundaries

- No second UI kit on the same surface.
- No hand-rolled table/modal when `MTable` / `MDialog` / `MDrawer` fit.
- No invented props / events / slots.
- No defaulting every success to `toast`.
- No substituting a generated scaffold for a real golden sample when the user asked to mirror one — but default path composes snippets, not full-page clones.
- Ops surfaces follow page-layout **block order** — do not replace them with marketing heroes.
- Express surfaces still use `M*` for controls and `--m-*` for color/space; do not introduce shadcn/Element/etc. stacks suggested by generic design skills.
- Soft-load companions only; never require Impeccable / UI-UX-Pro-Max / Frontend Design to be installed.
- **Restrained by default:** do **not** invent decorative glass / neon / aurora / neumorph / full-page gradients when there is no reference/description asking for them.
- **With a reference:** follow atmosphere that is **visible in the reference**; do not “sanitize” it away; do not add extra decoration beyond it. Approximate with tokens — pixel-perfect art is out of scope.
- Do **not** add new golden-page craft variants (`list-page-*`); express density/sider via style direction + polish.

## Soft companions

If already installed in the consumer project, **combine** them after structure + contract (do not replace this skill):

| Companion | Load when | Role |
| --- | --- | --- |
| `frontend-design` | Express / branded Account moments | Distinctive design plan + signature (taste) |
| `impeccable` | Polish / bolder / quieter / audit / delight asks | Named Operate/Persuade craft passes |
| `ui-ux-pro-max` | Mood / industry keyword search for Express | Keywords → map to `--m-*` (no preset ids) |
| `fixing-accessibility` | a11y audit after visual | Names, keyboard, focus on top of `M*` |

Routing, conflict rules, and load budget: [optional-companions.md](references/optional-companions.md). Distilled craft in [visual-craft.md](references/visual-craft.md) + [style-presets.md](references/style-presets.md) keeps this skill **standalone**.

## Output expectations

- Vue 3 `<script setup lang="ts">`.
- PascalCase `M*` in templates.
- Domain-real copy and data shapes (not placeholder “示例 / Name / No data” when the brief names a product).
- Scoped CSS minimal; tokens only (`color-mix` OK). Prefer **flat** surfaces by default; gradients / glass / glow only from user/reference (control widths may be inline).
- Reply includes `style:` (and `signature:` when following a richer reference).
- Craft pass completed for the lane (see step 5).
- For multi-file asks: sensible `views/` / `components/` split; otherwise one SFC is fine.

## Bundled references

| File | Read when |
| --- | --- |
| [surfaces.md](references/surfaces.md) | Choosing / composing non-Ops (and hybrid) surfaces |
| [page-layouts.md](references/page-layouts.md) | Ops block-order checklists (fill with snippets) |
| [style-presets.md](references/style-presets.md) | Style resolution (no preset catalog); reference vs restrained default |
| [reference-visual-map.md](references/reference-visual-map.md) | Screenshot/mock traits → `M*` / token / shell moves |
| [visual-craft.md](references/visual-craft.md) | Ops polish, shell recipes, anti-defaults, polish modes |
| [design-system.md](references/design-system.md) | Principles, tokens, bans |
| [component-index.md](references/component-index.md) | Catalog + decision-id index |
| [decision-recipes.md](references/decision-recipes.md) | Scenario → component → key props (generated; offline MCP mirror) |
| [feedback.md](references/feedback.md) | message / toast / MMessage |
| [review-checklist.md](references/review-checklist.md) | Pre-delivery checks + reference fidelity |
| [optional-companions.md](references/optional-companions.md) | Combining with external design skills |
