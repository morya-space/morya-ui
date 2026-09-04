---
title: Terminal
category: 03 / DATA
description: Simple command-prompt UI.
---

# Terminal

Shows a welcome message and command history; submitting emits `command`.

## Import

```ts
import { WdTerminal } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdTerminal } from '@wex-design/ui'
import { ref } from 'vue'

const last = ref('')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WdTerminal welcome-message="Wex Design Terminal" @command="last = $event" />
    <div v-if="last">
      Last command: {{ last }}
    </div>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `welcomeMessage` | `string` | `'Welcome to Wex Design Terminal'` | Welcome message at the top. |
| `prompt` | `string` | `'>'` | Prompt. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `command` | `string` | Submitted command. |

## Slots

No slots.
