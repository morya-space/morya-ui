---
title: Feedback
order: 4.56
description: Message, Toast, Dialog, Alert hierarchy and selection.
---

# Feedback

Feedback answers three questions: **what happened, how interrupting it is, and what the user does next**. Morya expresses interruption with different components—not every event needs a modal.

## Hierarchy (light → heavy)

| Interruption | Component / API | Use when |
| --- | --- | --- |
| In-page persistent | `MAlert` | Rules, partial failures, dismissible banners |
| Brief outcome | `message` / `MMessage` | Saved, copied, one-line results |
| Summary + process | `toast` / `MToast` | Detail, async progress, actionable notices |
| Decision required | `MConfirmDialog` / `MConfirmPopup` / `useConfirm` | Delete, discard edits |
| Task modal | `MDialog` / `MDrawer` | Forms, detail, multi-step (not bare confirms) |
| Blocking wait | `MLoading` (thin ring: `MProgressSpinner`) | Full-page / region loading |
| Quantified progress | `MProgressBar` | Uploads, long jobs |
| Empty / outcome page | `MEmpty` / `MResult` | No data, 404, success landings |

Also summarized in [Conventions](/docs/conventions).

## Principles

- **Prefer non-blocking success**: save → `message`, not a Dialog every time.
- **Confirm destruction**: delete / clear with `danger` + Confirm and clear consequence copy.
- **Shared severity colors**: success / warning / danger align with button `severity` ([Color](/docs/design-color)).
- **Ordered stacking**: Toast above menus; Dialog scrims use `--m-z-*` / Config `zIndex`.
- **Dismiss + focus**: modals support Esc; focus moves into the panel ([Accessibility](/docs/accessibility)).

## Message vs Toast

| | Message | Toast |
| --- | --- | --- |
| Payload | Short line | Richer title / body / action |
| Duration | Shorter | Can linger for async work |
| Typical | “Saved” | “Export ready—download” |

Both are light feedback; long reading or forms belong in Dialog / Drawer.

## Loading and empty

| Scenario | Pattern |
| --- | --- |
| Known first-paint structure | `MSkeleton` to avoid layout jump |
| Unknown blocking wait | `MLoading` |
| Empty list | `MEmpty` + a clear secondary action |
| Flow finished | `MResult` (success / error) + a way back |

Motion intensity affects spinner / skeleton loops—see [Motion (design)](/docs/design-motion) and [Motion](/docs/motion).

## Do / Don't

| Do | Don't |
| --- | --- |
| One success channel per action path | Toast + Message + Alert for the same success |
| Confirm primary as `danger` for destructive acts | Primary-colored “Delete” |
| Errors with a next step | “Failed” with no reason |
| Scope loading to the region | Full-screen Loading for a local fetch |

Hub: [Design language](/docs/design). Engineering defaults: [Configuration](/docs/config).
