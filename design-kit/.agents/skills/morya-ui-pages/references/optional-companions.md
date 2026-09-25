# Optional companions (craft bridge)

`morya-ui-pages` is **standalone**: contract + page snippets / decision recipes + block-order checklists + [visual-craft.md](visual-craft.md) + [style-presets.md](style-presets.md) are enough. Golden pages are optional structure demos. **No named style-preset catalog.**

Installed market skills are **soft upgrades** — never replace `M*` / `--m-*` / page-layout block order / MCP / the **user’s** style direction.

## Conflict rule (hard)

**morya-ui-pages + DESIGN.md + MCP win.**

Forbidden from any companion:

- Second UI kit  
- Invented `M*` props or hex soup  
- Replacing Ops block-order shell with a marketing hero  
- Custom ARIA widgets replacing library overlays  
- **Unearned AI atmosphere** the user did not ask for (aurora, cream-serif-terracotta, dual neon, frosted glass, neumorph on dense tables)  
- Overriding an explicit user reference or description  

## When to load

| Need | Prefer companion | Else |
| --- | --- | --- |
| Express / brand POV | `frontend-design` | visual-craft design plan |
| Named polish / audit / bolder / quieter | `impeccable` | visual-craft polish modes |
| Mood keywords | `ui-ux-pro-max` (search only) | infer from prompt → `--m-*` |
| a11y | `fixing-accessibility` | review-checklist |
| Routine Ops | **none** | Ops polish + resolved direction |

Load budget: max one visual companion; a11y may follow. If absent, do not ask to install mid-task.

## Frontend Design bridge

1. Ground subject / audience / job.  
2. Resolve style direction first ([style-presets.md](style-presets.md)).  
3. Short design plan; signature fits the **user’s** words.  
4. Strip AI-default faces unless the user asked.  
5. Remediate with `M*` + `--m-*`; flat shells by default.

## Impeccable bridge

| User intent | Pass | Constraint |
| --- | --- | --- |
| 太平 / 大胆一点 | `bolder` | One signature inside current direction; ask before changing the whole face |
| 太花 / 太像 AI | `quieter` | Strip unearned gradients / glow / glass |
| 提交前 | `polish` | Ops polish + direction + a11y basics |
| 文案 | `clarify` | Domain verbs |
| 微交互 | `delight` | 1–2 moments; `useMotion` |

**Brief wins.**

## Combined workflow

```text
1. Style direction   → user reference/description → cues → ask if uncertain
2. Compose           → recommend_page.suggestedSnippets / get_page_snippet + recommend_component
3. Optional structure → get_golden_page only for whole-page block-order check
4. Contract          → get_component / validate_usage
5. Craft             → visual-craft (flat shells by default)
6. Companion (opt.)  → deepen inside the resolved direction
7. Gate              → validate_usage + validate_page
```
