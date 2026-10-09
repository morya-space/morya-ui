# Reference visual map (emergency only)

Use this **only when the user provides a screenshot, mock, URL, or “像 XX”**.  
It is **not** a default style catalog. Without a reference, stay quieter ([style-presets.md](style-presets.md)).

Goal: translate visible traits into **`M*` + `--m-*`** moves. Prefer approximation over a second UI kit. Pixel-perfect art / custom illustrations are out of scope unless assets already exist in the project.

## Conflict rule

| Situation | Do |
| --- | --- |
| No reference | Quiet flat / restrained Ops polish. Do not invent glass, neon, aurora, wash, or marketing heroes. |
| Reference shows a trait | Follow that trait with tokens/`M*`. Do not strip it to “look safer.” |
| Reference does **not** show a trait | Do not add it. |
| Trait cannot be 1:1 | Approximate; say so in `signature:` / delivery notes. |

## Structure first (always)

Call MCP **`map_reference`** / `recommend_page({ brief })` for blocks (`filters`, `table`, `kpi`, `auth`, …).  
This file only covers **visual traits** after structure mapping exists.

## Trait → library move

| If you see… | Prefer… | Avoid… |
| --- | --- | --- |
| Soft tinted page background | Light `color-mix` wash on page shell from `--m-color-primary` / surface (small %) | Raw hex wash; stacked aurora meshes |
| Frosted / translucent cards | Semi-opaque `--m-color-surface` + border + soft `--m-shadow-*`; optional limited `backdrop-filter` only if clearly in the reference | Heavy multi-layer glass on every control |
| Soft elevated cards (no blur) | `MCard` / section surface + `--m-shadow-sm/md` + `--m-radius-md` | Extra nested cards for decoration only |
| Pill / capsule primary CTA | `MButton type="primary" shape="round"` — **one** in the main viewport | Multiple filled primaries |
| Quiet secondary actions | `MButton type="text"` / default outlined | Competing solid colors |
| Soft status / category chips | `MStatus` for state; `MTag` for labels; soft severity — not a row of solid blocks | Decorative `MTag` where `MStatus` belongs |
| Count on a control | Wrap host with `MBadge` | Invented `MButton badge` props |
| Left brand art + right form | `auth-split-shell` / Account split; art slot = project asset or simple token panel | Hand-rolled auth outside `MForm` |
| Empty state with illustration | `MEmpty` + `illustration` / `#illustration` when available; clear next action | Blank table with no empty |
| Dense admin table + filters | Ops block order + `list-filters-*` / `MTable`; keep chrome restrained even if reference is prettier | Marketing hero above CRUD |
| Dark chrome + bright chart accents | Dark theme tokens + restrained accent; charts are project/chart lib territory | Full-page neon glow stacks copied literally |
| Soft blue primary / lilac accents | Theme `--m-color-primary` (and related) overrides — not page-local hex soup | Second palette unrelated to tokens |

## Delivery lines (required with a reference)

```text
style: follow reference — <one short reading>
signature: <one visible cue you kept, e.g. round primary + light card elevation>
approx: <what you could not 1:1, if any>
```

## Fidelity bar

Match: block order, primary CTA role, density, status treatment, and **atmosphere that is clearly in the reference**.  
Do not require: identical illustration artwork, identical blur strength, or non-`M*` chrome.
