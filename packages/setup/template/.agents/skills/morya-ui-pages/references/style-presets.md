# Style direction (no preset catalog)

Golden pages lock **block order and APIs**. They are **not** the only allowed look. There is **no** named style-preset table (`simple` / `glass` / …). Resolve the look from the **user**, then map onto `M*` + `--m-*`.

**Stance:** this skill stays **restrained by default**. Rich atmosphere is allowed when the user brings a reference or clear description — not as everyday invention.

## Conflict rule (required)

| Case | Rule |
| --- | --- |
| **No reference** | Quieter flat / restrained Ops. Do not invent glass, neon, aurora, purple mesh, or marketing heroes. |
| **Has reference** | Follow traits **visible in the reference** (see [reference-visual-map.md](reference-visual-map.md)). Do not sanitize them away to “look safer.” Do not add decorations the reference lacks. |
| **Anti-defaults** | Apply only to **unearned** decoration (not present in user reference/description). |

## Resolution order (required)

1. **User reference or explicit description (highest)**  
   Screenshot / mock / existing page / URL / “像 XX”, or clear words (“毛玻璃一点”、“深蓝科技风”).  
   **Must follow.** Remap to `--m-*` + `M*` via [reference-visual-map.md](reference-visual-map.md). Do not switch kits, do not “improve” into another face.

2. **Clear prompt cues (when not explicit)**  
   Industry / mood words in the brief → infer and **state your reading in one sentence**.  
   Decorative glass / neon / full-page gradients only when the prompt clearly asks.

3. **Uncertain → ask (required)**  
   No reference, vague cues → **ask once** for a short description or a reference.  
   Do not invent the full look in silence.

4. **Only if user declines**  
   “你看着办 / 直接写” with still no cues → quiet flat on-token admin face, **say so**, continue.  
   Never default to aurora / neon / unsolicited glass / cream-serif-terracotta.

MCP: `get_style_direction` / `recommend_page({ style?, density?, brief? })` → `styleDirection` + optional `referenceMapping`.  
`map_reference` turns a reference description / required blocks into snippet + shell mapping.  
`resolution: "ask"` means **ask the user**, not free-style.

## Density (explicit)

Pass `density` to `recommend_page` / `map_reference` — do not rely only on regex in the intent string:

| Value | Effect |
| --- | --- |
| `compact` | Prefer `list-filters-dense` / `list-page-dense` cues |
| `default` | Standard Ops polish |
| `spacious` | More section gap; avoid packing |

## What `style` means

- Free-text from the user (or a short paraphrase of their reference).  
- **Not** a preset id.  
- Optional craft cues for list goldens only: words like `dense` / `compact` / `高密` → `list-page-dense`; `rail` / `品牌侧栏` → `list-page-rail`.

## Reference brief (fidelity)

When the user provides a screenshot / mock / “像 XX”, call **`map_reference`** (or pass `brief` into `recommend_page`) with:

- `description` — what you see (layout, density, primary CTA, **atmosphere cues**)
- `requiredBlocks` — e.g. `filters`, `table`, `status`, `kpi`, `auth`
- `requiredComponents` — e.g. `Table`, `Status`
- `density` / `primaryAction` when visible

Then compose structure via returned `mapping[].snippetId`, and map visual traits with [reference-visual-map.md](reference-visual-map.md). Pass the **same brief** to `validate_page` so missing blocks fail as contract issues. Run the **reference fidelity** checklist before delivery.

In the reply, state:

```text
style: follow reference — …
signature: …
```

## Anti-defaults (unearned only)

Block these when the **user/reference did not ask**:

- Purple→indigo / aurora / mesh washes  
- Warm cream + serif + terracotta kit  
- Broadsheet newspaper columns  
- Unsolicited glassmorphism, neon glow stacks, neumorph on dense tables  
- Companion “atmosphere” that overrides the user’s words  

If the reference **shows** soft frosted cards or a tinted wash, reproducing a **tokenized approximation** is following the reference — not an anti-default violation.

## How to apply

1. Map reference → snippets (`map_reference` / `recommend_page.referenceMapping`).  
2. Apply a signature shell when Account / Express / Flow need presence (`get_style_shells`).  
3. Brand color via theme `--m-color-primary` (DESIGN.md § 主题覆盖), not page hex.  
4. Run Ops polish when on Operate surfaces.  
5. Companions deepen **inside** the resolved direction only ([optional-companions.md](optional-companions.md)).
