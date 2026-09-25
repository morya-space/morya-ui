# Optional companions (craft bridge)

`morya-ui-pages` is **standalone**: contract + golden structure + [visual-craft.md](visual-craft.md) + [style-presets.md](style-presets.md) are enough to ship.

Installed market skills (**Frontend Design**, **Impeccable**, **UI-UX-Pro-Max**, **fixing-accessibility**, …) are **soft upgrades**. Use them to raise taste and polish — **never** to replace `M*` / `--m-*` / golden layouts / MCP APIs.

## Conflict rule (hard)

Whenever a companion conflicts with this skill, project `DESIGN.md`, or MCP (`get_component` / `validate_usage`):

**morya-ui-pages + DESIGN.md + MCP win.**

Forbidden outcomes from any companion:

- Second UI kit (shadcn / Element / Ant / raw HTML “design system”)
- Invented `M*` props or parallel token hex soup
- Replacing Ops golden shell with a marketing hero “to look less stiff”
- Replacing library overlays with custom ARIA widgets (unless fixing-accessibility is only auditing names/focus on top of `M*`)

## When to load which companion

| Need | Prefer companion | After / instead use distilled |
| --- | --- | --- |
| Express / landing / branded login panel — distinctive POV | `frontend-design` | [visual-craft.md](visual-craft.md) § Design plan + anti-defaults |
| Named polish / audit / bolder / quieter / typeset / delight | `impeccable` (`polish`, `bolder`, `quieter`, …) | [visual-craft.md](visual-craft.md) § Polish modes |
| Industry / mood / palette keywords for Express | `ui-ux-pro-max` (search only) | [style-presets.md](style-presets.md) heuristics + visual-craft mood |
| a11y names, keyboard, focus, forms | `fixing-accessibility` | review-checklist a11y + MCP validate |
| Routine Ops CRUD | **none** — style preset + Ops polish | [style-presets.md](style-presets.md) |

### Load budget

- Default: **morya-ui-pages only**
- Max one **visual** companion per task (`frontend-design` **or** `impeccable` **or** `ui-ux-pro-max`)
- a11y companion may stack **after** visual pass (pages → one visual → optional a11y)
- If absent: **do not** ask the user to install mid-task; use distilled craft and continue

## Mode bridge (Impeccable → morya lanes)

| Impeccable mode | morya lane | What companion may change | What stays locked |
| --- | --- | --- | --- |
| **Operate** | Ops / System / most Settings | Density, hierarchy, copy verbs, chrome polish, style preset | Golden block order, `MTable`/`MPage*`, feedback API |
| **Persuade** | Express / marketing CTA | Design plan, signature, type/atmosphere | Controls still `M*`; colors map to `--m-*` |
| **Read** | Docs chrome / long detail | Typeset, spacing, reading measure | No second kit |
| **Experience** | Gallery / showcase | Artifact-first layout | Interactive chrome still `M*` |

Pick the mode from the **surface**, not the company name (a tool’s landing page is still Persuade).

## Frontend Design bridge (Express & brand moments)

When `frontend-design` is available **or** you are on Express / branded Account:

1. **Ground the subject** — concrete product, audience, single job (same as this skill step 1).
2. **Short design plan** before code — color roles, type roles, layout concept, **one** signature risk.
3. **Critique the plan** — if it matches the plan you’d write for any SaaS, revise for **this** subject.
4. **Anti-defaults** — do not spend free axes on cream+serif+terracotta / acid-green dark / broadsheet / purple gradient (see visual-craft).
5. **Remediate with morya-ui** — implement the plan using `M*` + `--m-*` / `color-mix`; do not introduce Inter-as-display on Express when the brief allows character **unless** the project theme already fixes fonts.

Ops lists: Frontend Design may inform **copy tone and hierarchy**, not a new scaffold aesthetic.

## Impeccable bridge (polish commands)

Map user asks to Impeccable-style passes (run companion if installed; else visual-craft polish modes):

| User intent | Pass | morya constraint |
| --- | --- | --- |
| 太平 / 太呆板 / 大胆一点 | `bolder` | Amplify **one** signature or style preset (`studio`/`rail`); keep Ops golden |
| 太花 / 太吵 | `quieter` | Remove competing accents; keep one primary |
| 提交前收一遍 | `polish` | Ops polish + style preset cues + a11y basics |
| 文案/空态/错误看不懂 | `clarify` | Domain verbs; `MEmpty` / `errorMessage` |
| 字阶乱 | `typeset` | Theme font tokens; no random CDN font stacks on Ops |
| 加点微交互 | `delight` / `animate` | 1–2 moments; `useMotion` / `data-m-motion` |
| 无障碍 | `audit` + fixing-accessibility | Labels on `M*`; don’t replace Dialog/Menu |

**Brief wins** (Impeccable): if the user pinned a reference or named a [style preset](style-presets.md), do not redirect toward companion taste.

## UI-UX-Pro-Max bridge (mood only)

Safe: search mood / industry / palette **keywords**, then map onto `--m-*` roles and a style preset.

Unsafe: adopting suggested React/Tailwind/shadcn stacks, GSAP-heavy landing kits, or chart libraries that replace `M*` patterns.

## Combined workflow (pages + companions)

```text
1. Style direction   → reference → preset → cues → ask  ([style-presets.md](style-presets.md))
2. Structure         → recommend_page / get_golden_page  (MCP)
3. Contract          → recommend_component / get_component / validate_usage
4. Craft             → visual-craft Ops polish or Express design plan
5. Companion (opt.)  → frontend-design (Express) OR impeccable polish command
6. a11y (opt.)       → fixing-accessibility
7. Gate              → validate_usage + validate_page
```

## Install via setup

```bash
npx @morya-ui/setup ai
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design,impeccable,fixing-accessibility
npx @morya-ui/setup ai --skills=all
```

| Companion | Source | Safe use | Unsafe use |
| --- | --- | --- | --- |
| `frontend-design` | `anthropics/skills` | Express / brand panel POV after surface + contract fixed | Replacing Ops golden shell; second UI kit |
| `impeccable` | `pbakaus/impeccable` | Operate/Persuade polish passes aligned with visual-craft | New token schema; swap `M*` for raw controls |
| `ui-ux-pro-max` | local / marketplace | Mood & industry keywords for Express | Stack swap; ignoring morya tokens |
| `fixing-accessibility` | `ibelick/ui-skills` | Names, keyboard, focus on top of `M*` | Custom ARIA widgets replacing library overlays |
