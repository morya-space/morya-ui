---
title: Motion (design)
order: 4.55
description: Duration, easing, reduced-motion policy, and design intent (APIs in Motion guide).
---

# Motion (design)

This chapter covers **design intent**: when to move, how far, and how to reduce motion. Implementation and preset registration live in [Motion](/docs/motion) (`useMotion`, `transition`, enter/exit ids).

Two orthogonal layers:

1. **Intensity**: `full` / `reduced` / `none` → `data-m-motion`
2. **Shape**: named enter/exit presets (`fade`, `scale-fade`, `dialog`, …)

## Principles

- **Serve state changes**: overlays, list updates, loading—not decorative loops that steal focus.
- **Tokenized timing**: `--m-motion-fast` / `normal` / `enter` / `exit`, distance `--m-motion-distance`, easing `--m-motion-ease`.
- **Intensity is opt-in product config**: components follow `useMotion` and **do not** read system `prefers-reduced-motion`; expose the preference in your product if needed.
- **Looping indicators can stop**: under `reduced` / `none`, spin / pulse / skeleton durations go to zero.

## Key tokens (comfortable / full)

| Token | Default | Role |
| --- | --- | --- |
| `--m-motion-fast` | `150ms` | Micro-interactions, color shifts |
| `--m-motion-normal` | `250ms` | General transitions |
| `--m-motion-enter` | `200ms` | Enter |
| `--m-motion-exit` | `150ms` | Exit (slightly faster than enter) |
| `--m-motion-distance` | `0.5rem` | Slide distance |
| `--m-motion-ease` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | Default easing |

`reduced`: shorter durations, zero distance, loops off. `none`: near-instant transitions.

## Scenario guidance

| Scenario | Guidance |
| --- | --- |
| Dialog / Drawer | Role defaults or Config `motion.transitions`; avoid bounce that hides content |
| Toast / Message | Short enter/exit; do not cover primary actions for long |
| Button ripple / press | Off by default; enable explicitly; should no-op under `none` |
| Skeleton | When layout is known; stop shimmer under `reduced` |

Overlay resolution (summary): component `transition` → `componentDefaults` → `motion.transitions[role]` → built-in default. Custom `registerMotionPreset` details: [Motion](/docs/motion).

## Do / Don't

| Do | Don't |
| --- | --- |
| Exit ≤ enter to avoid drag | Mix unrelated easing curves on one page |
| Offer `reduced` / `none` | Force long looping motion with no off switch |
| Fade the scrim; emphasize the panel (Dialog) | Bounce the entire backdrop so the panel clips |
| Tune duration via tokens | Hardcode `transition: 0.8s` inside components |

Next: [Feedback](/docs/design-feedback). For APIs and demos, return to [Motion](/docs/motion).
