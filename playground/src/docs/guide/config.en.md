---
title: Configuration
order: 8
description: ConfigProvider, createMoryaUI, and useMConfig.
---

# Configuration

Morya UI provides app-level and page-level defaults for overlay mount, size, density, and copy.

## Capabilities

| Field | Description |
| --- | --- |
| `appendTo` | Default overlay Teleport target, `body` by default |
| `size` | Default size for forms / buttons |
| `density` | `compact` / `comfortable` / `spacious`, scales spacing and control height |
| `inputVariant` | Input surface `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Confirm, empty, loading, and placeholder copy. Pass built-in packs `zhCN` / `enUS` |

Priority: **component props > `MConfigProvider` > `createMoryaUI` > built-in default (Chinese)**.

## Locale packs

Built-in copy defaults to Chinese. Pass `enUS` to switch to English:

```ts
import { createMoryaUI, enUS, zhCN } from 'morya-ui'
import { createApp } from 'vue'

createApp(App).use(createMoryaUI({ locale: enUS })).mount('#app')
```

You can also override a subset:

```ts
createMoryaUI({
  locale: {
    ...zhCN,
    accept: 'OK',
  },
})
```

The **中 / EN** switch in the docs header injects the same pack into `MConfigProvider`, so live examples (empty states, confirm, dates, and so on) follow the selected language. Markdown pages load `*.en.md` when English is selected.

## Size

Controls without a local `size` inherit from ConfigProvider.

```vue preview src="./demos/config/Size.en.vue"
```

## Density

```vue preview src="./demos/config/Density.en.vue"
```

## Input variant

```vue preview src="./demos/config/InputVariant.vue"
```

## Locale

```vue preview src="./demos/config/Locale.en.vue"
```

## appendTo + zIndex

```vue preview src="./demos/config/AppendToZIndex.en.vue"
```

## App-level: `createMoryaUI`

```ts
import { createMoryaUI } from 'morya-ui'
import { createApp } from 'vue'

createApp(App).use(
    createMoryaUI({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: 'OK', reject: 'Cancel' },
    }),
  ).mount('#app')
```

## Reading config

```ts
import { useMConfig } from 'morya-ui'

const config = useMConfig()
// config.value.appendTo / size / locale …
```

Full props and comparison tables: [ConfigProvider](/components/ConfigProvider).
