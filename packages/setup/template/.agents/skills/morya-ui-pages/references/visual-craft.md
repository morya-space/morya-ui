# Visual craft (distilled)

Portable craft for morya-ui consumers. Inspired by **Frontend Design**, **Impeccable**, and **UI-UX-Pro-Max** — without requiring those skills. Still honor the morya-ui contract. **No named style-preset catalog.**

## When to lean on craft

| Lane | Craft intensity | Default pass |
| --- | --- | --- |
| Ops CRUD | Low — clarity, density, golden structure | **Always** run § Ops polish |
| Account / Flow / System | Medium — trust, hierarchy, one calm brand cue | **Always** run § Shell recipes when relevant |
| Express | High — design plan + one signature risk | **Always** run design plan + anti-defaults |

**Style is not fixed to the golden look.** Resolve direction first ([style-presets.md](style-presets.md)): **user reference / description → prompt cues → ask when uncertain**.

## Companion bridge (distilled)

Run companions **after** structure + contract + **resolved style direction**, then remediate with `M*` + `--m-*`.

### Subject first (Frontend Design)

- Name **subject**, **audience**, **single job** before visual choices.
- Personality from the subject’s world — not a generic “SaaS aurora” board.
- **One signature** per surface; everything else quieter.
- Signature = type / layout / product artifact / motion — **not** a default gradient wash.

### Mode (Impeccable)

| Mode | Use when | Craft budget |
| --- | --- | --- |
| **Operate** | Ops lists, forms, settings | Clarity, density, resolved direction; no marketing hero |
| **Persuade** | Landing, pricing | Design plan + signature; controls still `M*` |
| **Read** | Docs / long detail | Typeset + measure |
| **Experience** | Gallery / showcase | Artifact leads |

### Design plan (Express & branded Account)

1. **Color** — roles mapped to `--m-*`. Companions may suggest hex — **map** to tokens.
2. **Type** — Ops stick to theme fonts.
3. **Layout** — one sentence + hierarchy.
4. **Signature** — one memorable element that fits the **user’s** direction.

If the plan looks like any-SaaS (purple wash, cream serif, neon glow) and the user did not ask for that, revise. **User reference / words win.**

## Ops polish (baseline)

1. **One primary** filled button in the main viewport.
2. **Sider icons** on every top-level `MMenu` item.
3. **Status** → `MStatus`; `MTag` for categories/filters only.
4. **Row actions** — text / outlined / small.
5. **Filter rhythm** — search ~`14rem`, selects ~`10–12rem`.
6. **Empty** — `MEmpty` with next action.
7. **No extra cards** around filters/table “for polish”.
8. **Domain copy**.
9. **Density** — follow user cues (`compact` / spacious); don’t invent a second scale.
10. **Quiet chrome** — no marketing heroes / glow unless the user asked.

Ops beauty = alignment + semantics + restraint, **not** gradients.

## Anti-default looks

Unless the user **asks** or a reference **shows** them, do not use:

1. Cream + serif + terracotta  
2. Acid-green / dual neon on black  
3. Broadsheet newspaper columns  
4. Purple aurora / mesh washes (even via `color-mix`)  
5. Glow stacks, pill clouds, emoji decoration  
6. Unsolicited glass, neumorph on dense tables, full-page gradients  
7. Stacked radial + linear “atmosphere” brand panels  

**Token gradients are not a free pass** — only when the user/reference asks.

## Shell recipes (token-only — defaults are flat)

### Account — split brand panel

```css
.login-brand {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--m-space-4);
  padding: clamp(2rem, 6vw, 4.5rem);
  background: color-mix(in srgb, var(--m-color-primary) 12%, var(--m-color-surface));
  border-right: 1px solid var(--m-color-border);
}
```

### Express — hero plane

```css
.landing-hero__visual {
  margin-top: var(--m-space-5);
  padding: var(--m-space-5);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  background: var(--m-color-surface);
}
```

### Flow — empty shell

Prefer stock `MEmpty`. Optional light frame:

```css
.empty-state-shell {
  border: 1px dashed var(--m-color-border);
  border-radius: var(--m-radius-md);
  background: var(--m-color-surface);
  padding: var(--m-space-6);
}
```

If the user asked for glass / gradient / dark-tech, implement **that** request with `--m-*` — do not escalate into AI mesh.

## Polish modes (Impeccable-inspired)

| Mode | Intent |
| --- | --- |
| `quieter` | Strip competing accents **and unearned gradients/glow/glass** |
| `bolder` | Strengthen one signature **inside** the user’s direction — do not invent a new face |
| `polish` / `clarify` / `typeset` / `adapt` / `delight` | As named |

## Quality floor

- Responsive, focus visible, keyboard to primary actions  
- No raw hex theme colors  
- Craft pass done; MCP `validate_usage` / `validate_page` when available  
- No unearned AI atmosphere  
