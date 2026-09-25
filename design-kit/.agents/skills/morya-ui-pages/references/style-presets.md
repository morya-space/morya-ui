# Style direction & presets

Golden pages lock **block order and APIs**. They are **not** the only allowed look. Pick a visual direction **before** coding so generated pages stop looking identical and stiff.

## Resolution order (required)

1. **Reference first** — user supplied a screenshot, mock, existing page, URL, or “像 XX / like X”.
   - Extract: density, hierarchy, surfaces (flat vs filled), accent placement, copy tone.
   - Remap onto `--m-*` + `M*` only. Do **not** switch UI kits or copy hex themes.
2. **Named preset** — user asked for `soft` / 柔和留白 / `dense` / …
3. **Prompt cues** — industry or mood words in the brief → infer the closest preset and **name it** in the reply.
4. **Offer a choice** — still unclear → ask **one** short question with 3–4 options (ids below). If the user says “直接写 / just ship”, pick by domain heuristic — **do not always use `quiet`**.

MCP: `list_style_presets` / `get_style_preset` / `recommend_page({ style })` → `styleDirection`.

## Presets (user-selectable)

| Id | 中文 | Best for | Distinct craft | List golden |
| --- | --- | --- | --- | --- |
| `quiet` | 克制经典 | Serious enterprise admin | Flat chrome, golden-like Ops polish | `list-page` |
| `soft` | 柔和留白 | Ops / content admin | `density="spacious"`, filled filters, short descriptions | `list-page` |
| `dense` | 高密度工具台 | Monitoring / power users | `density="compact"`, `size="small"` table, tight filters | `list-page-dense` |
| `rail` | 侧栏强调 | Branded B2B shells | Token `color-mix` wash on sider/header only | `list-page-rail` |
| `studio` | 工作室呼吸感 | Design / collab / knowledge | Stronger header hierarchy; optional one radial wash | `list-page` |
| `ink` | 线框极简 | Tool / docs feel | Plain filters, bordered table, little fill | `list-page` |

Full apply/avoid lists: MCP `get_style_preset` or `@morya-ui/mcp` `style-presets`. `recommend_page({ style })` routes list scaffolds to the matching golden when a craft variant exists.

### Domain heuristics (when user says “直接写”)

| Cue in brief | Prefer |
| --- | --- |
| 金融 / 合规 / 政务 | `quiet` or `ink` |
| 运营 / 内容 / 教育 | `soft` |
| 监控 / 运维 / 交易 | `dense` |
| 强调品牌色 / LOGO | `rail` |
| 设计 / 协作 / 知识库 | `studio` |
| 登录 / 落地 / 品牌营销 | Account/Express atmosphere — not an Ops preset |

## How to apply on Ops pages

1. Mirror golden **structure** via `recommend_page` / `get_golden_page` (list: `list-page` / `list-page-dense` / `list-page-rail` by style).
2. Apply the chosen preset’s density / filter surface / header copy / chrome wash (or follow the craft golden when one exists).
3. Still run [visual-craft.md](visual-craft.md) § Ops polish (one primary, menu icons, `MStatus`, designed empty).
4. Fill height remains **conditional** — see [page-layouts.md](page-layouts.md) § List height.

## Reference style checklist

When following a reference:

- [ ] Hierarchy (what is loud vs quiet) matched with type/space, not random cards
- [ ] Density matched (`compact` / default / `spacious`)
- [ ] Surfaces matched (plain vs filled filters; bordered table or not)
- [ ] Accent placement matched (chrome only vs content) using `--m-*` / `color-mix`
- [ ] Interaction patterns stay morya-ui (`MTable` `rows`, `message`, etc.)

## Anti-patterns

- Treating the golden page as the only allowed aesthetic
- Asking nothing and always emitting `quiet`
- Inventing a second component library to “match the reference”
- Turning Ops into a marketing landing to “look less stiff”
- Letting Frontend Design / Impeccable / UI-UX-Pro-Max swap stacks or ignore `M*` / `--m-*` (see [optional-companions.md](optional-companions.md))

## Companion pairing

| Preset | Pairs well with |
| --- | --- |
| `quiet` / `ink` | Impeccable Operate + `quieter` / `polish` |
| `soft` / `studio` | Frontend Design hierarchy cues; Impeccable `bolder` (one signature only) |
| `dense` | Impeccable Operate — scanability over decoration |
| `rail` | Frontend Design brand panel taste on **chrome only** |
| Express (no Ops preset) | Frontend Design design plan → Impeccable `polish` |
