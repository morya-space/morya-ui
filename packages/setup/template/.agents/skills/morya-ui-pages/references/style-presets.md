# Style direction (no preset catalog)

Golden pages lock **block order and APIs**. They are **not** the only allowed look. There is **no** named style-preset table (`simple` / `glass` / …). Resolve the look from the **user**, then map onto `M*` + `--m-*`.

## Resolution order (required)

1. **User reference or explicit description (highest)**  
   Screenshot / mock / existing page / URL / “像 XX”, or clear words (“毛玻璃一点”、“深蓝科技风”).  
   **Must follow.** Remap to `--m-*` + `M*`. Do not switch kits, do not “improve” into another face.

2. **Clear prompt cues (when not explicit)**  
   Industry / mood words in the brief → infer and **state your reading in one sentence**.  
   Decorative glass / neon / full-page gradients only when the prompt clearly asks.

3. **Uncertain → ask (required)**  
   No reference, vague cues → **ask once** for a short description or a reference.  
   Do not invent the full look in silence.

4. **Only if user declines**  
   “你看着办 / 直接写” with still no cues → quiet flat on-token admin face, **say so**, continue.  
   Never default to aurora / neon / unsolicited glass / cream-serif-terracotta.

MCP: `get_style_direction` / `recommend_page({ style? })` → `styleDirection`.  
`resolution: "ask"` means **ask the user**, not free-style.

## What `style` means

- Free-text from the user (or a short paraphrase of their reference).  
- **Not** a preset id.  
- Optional craft cues for list goldens only: words like `dense` / `compact` / `高密` → `list-page-dense`; `rail` / `品牌侧栏` → `list-page-rail`.

## Anti-defaults (unless user/reference asks)

- Purple→indigo / aurora / mesh washes  
- Warm cream + serif + terracotta kit  
- Broadsheet newspaper columns  
- Unsolicited glassmorphism, neon glow stacks, neumorph on dense tables  
- Companion “atmosphere” that overrides the user’s words  

## How to apply

1. Mirror golden **structure** via `recommend_page` / `get_golden_page`.  
2. Apply the resolved direction with tokens + layout/type — see [visual-craft.md](visual-craft.md).  
3. Run Ops polish when on Operate surfaces.  
4. Companions deepen **inside** the resolved direction only ([optional-companions.md](optional-companions.md)).
