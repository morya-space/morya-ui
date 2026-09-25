# Surface taxonomy

Pick a lane, then a surface. Prefer project golden pages for **Ops**; use the recipes below for everything else. Always implement interactive controls with `morya-ui`.

## Ops (admin / console)

| Surface | Job | Compose from |
| --- | --- | --- |
| List | Scan, filter, act on many rows | Golden list + [page-layouts.md](page-layouts.md); **create/edit with ≤~8 fields → `MDialog` on the list** |
| Form | Create / edit one entity as a **dedicated page** | Golden form — only when multi-section, many fields, or user asked for an independent form route |
| Dashboard | Orient + jump to work | Golden dashboard |
| Detail | Read-heavy record + secondary actions | `MPageHeader` + sections via `MCard`/`MPageSection`; edit via `MDialog` / `MDrawer` (prefer over a second form route) |
| Settings | Grouped preferences | Narrow `MPageContent` + stacked `MPageSection` / `MTabs` + `MForm` |
| Hybrid list | List + drawer/dialog | **Default Ops CRUD pattern**: list golden + `MDialog`/`MDrawer` form |

## Account

| Surface | Job | Recipe |
| --- | --- | --- |
| Login / register | Authenticate with trust | Golden: MCP `get_golden_page` `login-page` — split brand + `MForm` (`MInput`, `MInputPassword`); form-level errors via token `role="alert"` (not Toast). Brand wash: [visual-craft.md](visual-craft.md) § Atmosphere |
| Invite / accept | Join org | Same shell; show org name clearly |
| Forgot / reset | Recover access | Short form + success state with next step |
| Profile / account | Edit self | Settings-like sections; avatar via `MAvatar` |

Keep credential forms quiet: one primary CTA, clear labels, no decorative noise beside the brand panel.

## Flow

| Surface | Job | Recipe |
| --- | --- | --- |
| Empty state | Invite first action | Golden: MCP `get_golden_page` `empty-state` — `MEmpty` + primary/secondary `MButton` in `#extra`; dashed shell + radial wash from visual-craft |
| Onboarding | Teach the product path | `MStepper` or paced cards; one decision per step; finish → Ops home |
| Wizard | Multi-step create | `MStepper` + `MForm` per step + sticky actions (`上一步` / `下一步` / `提交`) |
| Success / result | Confirm completion | `MResult status="success"` / `error` + `#footer` next actions (`查看详情` / `返回列表`); same shell idea as `result-page` |

Copy must tell the user **what to do next**, not celebrate the system.

## System

| Surface | Job | Recipe |
| --- | --- | --- |
| Permission denied | Explain + escape | Golden: MCP `get_golden_page` `result-page` — `MResult status="403"` + `#footer` (not `#extra`) |
| 404 / not found | Reorient | `MResult status="404"` + `返回首页` / `返回上一页` (mirror `result-page` shell) |
| Maintenance / error | Honest status | `MResult status="500"`; what happened + retry + support. Persistent form errors: field `errorMessage` or a token `role="alert"`, not `<MMessage>` as an alert |

Avoid witty 404 essays that hide the exit paths.

## Express (marketing / public)

Use when the brief is landing, pricing, launch, or docs marketing — **not** for Ops CRUD shells.

| Surface | Job | Recipe |
| --- | --- | --- |
| Landing | Convert / explain product | Golden: MCP `get_golden_page` `landing-page` — one-job hero; CTAs → `MButton`; chips → `MTag`; FAQ → `MAccordion` |
| Pricing | Choose a plan | Clear plan cards (`MCard`) + primary CTA; highlight recommended plan without clutter |
| Feature showcase | Prove capability | Alternating media/copy; live `M*` demo only if lightweight |
| Docs marketing chrome | Frame documentation | Header + nav using `M*` where suitable; content area stays readable |

Before coding Express: short design plan in [visual-craft.md](visual-craft.md). Map colors to `--m-*` / theme overrides; do not paste a second kit.

**Anti-patterns for Express:** inset hero cards instead of a full-bleed thesis; pill-stat strips in the first viewport; purple-on-white / cream-terracotta / broadsheet defaults when the brief did not ask for them.

## Overlay

When the dialog/drawer **is** the task:

| Surface | Recipe |
| --- | --- |
| Edit / create dialog | `MDialog` + compact `MForm` + footer actions |
| Detail drawer | `MDrawer` + header + sections + optional edit |
| Confirm | `MConfirmDialog` / `MConfirmPopup` — do not reinvent |
| Command menu | `MCommandMenu` for keyboard-first jump / actions |

Host page stays stable; focus management comes from the overlay component.

## Lane mixing

| Ask | Treat as |
| --- | --- |
| “后台列表 + 好看一点” | Ops + pick a non-quiet preset (`soft`/`studio`) or ask once |
| “像附件截图一样” | Reference-first style resolution; still M* + `--m-*` |
| “登录页有品牌感” | Account + Express craft on brand panel only |
| “产品官网” | Express; Ops patterns do not apply |
| “空状态设计精致一点” | Flow empty + visual-craft signature (one risk) |

## MCP hints

- Ops whole page: `recommend_page({ style? })` → `get_golden_page` → apply `styleDirection` / reference
- Styles: `list_style_presets` / `get_style_preset`
- Section: `get_page_snippet`
- Any lane: `search` / `get_component` before unfamiliar APIs
