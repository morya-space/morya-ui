---
title: Select
category: 02 / FORM
description: Form select. Supports multiple tags, remote search, invalid, size, fluid, showClear, and filter. Distinct from the Dropdown action menu.
---

# Select

Form select for choosing one or more values from a list of options.

**Unlike Dropdown:** `WiSelect` is a form control. Use `WiDropdown` for action menus.

## Import

```ts
import { WiSelect } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | number | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
  { label: 'Unavailable', value: 'na', disabled: true },
]
</script>

<template>
  <WiSelect v-model="value" label="Team" :options="options" placeholder="Choose a team" />
</template>
```

## Clearable

`showClear` shows a clear button when a value is selected.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | number | undefined>('design')
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect v-model="value" label="Team" :options="options" show-clear />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect
    v-model="value"
    :options="options"
    placeholder="Required"
    invalid
    help-text="Please select a team"
  />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiSelect } from '@well-insight/ui'

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect model-value="design" :options="options" disabled />
</template>
```

## Sizes

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 'lg' },
]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-start">
    <WiSelect v-model="value" :options="options" size="small" placeholder="Small" />
    <WiSelect v-model="value" :options="options" placeholder="Normal" />
    <WiSelect v-model="value" :options="options" size="large" placeholder="Large" />
  </div>
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect v-model="value" :options="options" fluid placeholder="Fluid width" />
</template>
```

## Multiple

With `multiple`, `v-model` is an array. Selected values render as removable tags and the menu stays open after a pick. `maxTagCount` collapses extra tags.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<Array<string | number>>(['design'])
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
  { label: 'Research', value: 'research' },
]
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiSelect v-model="value" :options="options" multiple show-clear placeholder="Teams" />
    <WiSelect v-model="value" :options="options" multiple :max-tag-count="1" placeholder="Collapsed tags" />
  </div>
</template>
```

## Tag

`tag` + `filter` lets the user create an option from the current query (Enter or the create row). Virtual lists are deferred.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<Array<string | number>>([])
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
]
</script>

<template>
  <WiSelect v-model="value" :options="options" multiple filter tag placeholder="Add a stack" />
</template>
```

## Remote

`remote` skips local filtering and emits `search` as the query changes. Use `loading` for in-flight requests.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | number | undefined>()
const loading = ref(false)
const options = ref<{ label: string; value: string }[]>([])
const catalog = [
  { label: 'Shanghai', value: 'sh' },
  { label: 'Beijing', value: 'bj' },
  { label: 'Shenzhen', value: 'sz' },
]

function onSearch(query: string) {
  if (!query) {
    options.value = []
    return
  }
  loading.value = true
  window.setTimeout(() => {
    const needle = query.toLowerCase()
    options.value = catalog.filter((item) => item.label.toLowerCase().includes(needle))
    loading.value = false
  }, 400)
}
</script>

<template>
  <WiSelect
    v-model="value"
    :options="options"
    filter
    remote
    :loading="loading"
    placeholder="Search a city"
    @search="onSearch"
  />
</template>
```

## Empty

Shows empty-state text when there are no options or the filter has no matches. Override with `emptyMessage`, otherwise it reads ConfigProvider `locale.emptyMessage`.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const cities = [
  { label: 'Shanghai', value: 'sh' },
  { label: 'Beijing', value: 'bj' },
  { label: 'Shenzhen', value: 'sz' },
]
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiSelect v-model="value" :options="[]" empty-message="No options" placeholder="Empty list" />
    <WiSelect v-model="value" :options="cities" filter placeholder="Filter cities" />
  </div>
</template>
```

## Teleport

The menu Teleports to `body` by default (`teleport` + `appendTo`). Set `append-to="self"` or `teleport={false}` to render in place.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'In place', value: 'local' },
  { label: 'Teleported', value: 'body' },
]
</script>

<template>
  <WiSelect v-model="value" :options="options" append-to="self" placeholder="Append to self" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array<string \| number>` | — | Selected value; an array when `multiple`. |
| `options` | `SelectOption[]` | — | Options list. |
| `label` | `string` | — | Field label. |
| `helpText` | `string` | — | Help text. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `error` | `boolean` | `false` | **Deprecated.** Use `invalid`. |
| `placeholder` | `string` | — | Placeholder text. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Form required hint. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `fluid` | `boolean` | `false` | Stretch to the container width. |
| `multiple` | `boolean` | `false` | Allow multiple values. |
| `tag` | `boolean` | `false` | Create an option from the filter query (requires `filter`). |
| `remote` | `boolean` | `false` | Skip local filtering and emit `search`. |
| `loading` | `boolean` | `false` | Async loading state. |
| `maxTagCount` | `number` | — | Max visible tags in multiple mode; extras collapse to +N. |
| `showClear` | `boolean` | `false` | Show a clear button when a value is selected. |
| `emptyMessage` | `string` | — | Empty-options text. Defaults to ConfigProvider `locale.emptyOptions`. |
| `filter` | `boolean` | `false` | Show a filter input when the menu is open. |
| `teleport` | `boolean` | `true` | Menu Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target. `'self'` renders in place. |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Menu alignment. |
| `id` | `string` | — | Control id. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `SelectModelValue` | Emitted when the value changes. |
| `change` | `SelectModelValue` | Emitted after a selection or clear. |
| `clear` | — | Emitted when clear is clicked. |
| `show` | — | Emitted when the menu opens. |
| `hide` | — | Emitted when the menu closes. |
| `search` | `string` | Emitted as the filter query changes (`filter` / `remote`). |
| `create` | `SelectOption` | Emitted when `tag` creates a new option. |
