---
title: Page
category: 06 / LAYOUT
description: Composable page sections for spacing, borders, and headings with little or no custom CSS.
---

# Page

Page composition components. Use them with `MLayout` to encode filter bars, toolbars, form surfaces, KPI cards, and other admin-page blocks **without rewriting scoped CSS on every page**.

## Import

```ts
import {
  MPageContent,
  MPageFilters,
  MPageHeader,
  MPagePlaceholder,
  MPageSection,
  MPageStat,
  MPageToolbar,
} from 'morya-ui'
```

## List page stack

`MPageContent` owns content **padding** (default `--m-space-6`) and section **gap** (default `--m-space-4`). The bordered frame in previews simulates `MLayoutContent` only.

```vue preview
<script setup lang="ts">
import {
  MButton,
  MInput,
  MPageContent,
  MPageFilters,
  MPageToolbar,
  MSpace,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent>
      <MPageFilters aria-label="Filters">
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="Search" clearable style="width:12rem" />
          <MButton severity="primary">Search</MButton>
        </MSpace>
      </MPageFilters>
      <MPageToolbar title="Users">
        <template #actions>
          <MButton severity="primary">Create</MButton>
        </template>
      </MPageToolbar>
    </MPageContent>
  </div>
</template>
```

## Form page stack

Use `MPageContent width="narrow"`, `MPageSection variant="form"`, and `variant="actions"` for the footer.

## Composition rules

| Scenario | Use | Avoid |
| --- | --- | --- |
| Vertical page stack | `MPageContent` | Hand-written `gap` / `padding` |
| Filters | `MPageFilters` | Extra bordered `MCard` wrapper |
| Title + actions | `MPageToolbar` | Raw flex divs |
| Form surface | `MPageSection variant="form"` | Nested bordered cards |
| Data table | `MTable` directly | `MCard` around bordered table |
| KPI metric | `MPageStat` | Custom stat CSS per page |

Golden references: `docs/golden-pages/` (MCP: `get_golden_page`).
