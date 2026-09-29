---
title: Image
category: 03 / DATA
description: Image display with click-to-preview; PreviewGroup for multi-image browsing.
---

# Image

Thumbnail with lightbox preview. For gallery chrome, use [Gallery](/components/Gallery).


## When to use

- Image display with click-to-preview; PreviewGroup for multi-image browsing
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

## Import

```ts
import { MImage, MImagePreviewGroup } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Preview group

```vue preview src="./demos/Group.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Image URL |
| `alt` | `string` | — | Alt text |
| `width` / `height` | `string \| number` | — | Size |
| `preview` | `boolean` | `true` | Enable preview |
| `previewSrc` | `string` | — | Preview URL; defaults to `src` |
| `fit` | `ImageFit` | `'cover'` | `object-fit` |
| `pt` | `RootPassThrough` | — | Pass-through |

## Events

| Event | Description |
| --- | --- |
| `click-preview` | Fired when preview opens |

## Components

| Component | Description |
| --- | --- |
| `MImage` | Single image |
| `MImagePreviewGroup` | Wrap multiple `MImage` for shared preview |
