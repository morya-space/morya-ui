---
title: Terminal
category: 07 / MISC
description: Simple command-prompt UI.
---

# Terminal

Shows a welcome message and command history; submitting emits `command`.

## Import

```ts
import { WiTerminal } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTerminal } from '@well-insight/ui'

const last = ref('')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WiTerminal welcome-message="Well Insight Terminal" @command="last = $event" />
    <div v-if="last">Last command: {{ last }}</div>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `welcomeMessage` | `string` | `'Welcome to Well Insight Terminal'` | Welcome message at the top. |
| `prompt` | `string` | `'>'` | Prompt. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `command` | `string` | Submitted command. |
