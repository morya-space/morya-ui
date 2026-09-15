<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  {
    key: 'workspace',
    label: 'Workspace',
    icon: 'folder',
    items: [
      { key: 'home', label: 'Home', icon: 'home' },
      { key: 'docs', label: 'Docs', icon: 'file-text' },
    ],
  },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <div style="display: flex; gap: var(--m-space-4); align-items: stretch">
    <div
      style="
        flex: 1;
        min-width: 0;
        padding: var(--m-space-3);
        background: var(--m-color-surface);
        border: 1px solid var(--m-color-border);
        border-radius: var(--m-radius-lg);
        box-shadow: var(--m-shadow-sm);
      "
    >
      <p
        style="
          margin: 0 0 var(--m-space-3);
          font-size: var(--m-font-size-xs);
          color: var(--m-color-text-muted);
        "
      >
        Expanded
      </p>
      <MMenu v-model:selected-key="selectedKey" :model="model" embedded />
    </div>
    <div
      style="
        width: 4.5rem;
        padding: var(--m-space-3) var(--m-space-2);
        background: var(--m-color-surface);
        border: 1px solid var(--m-color-border);
        border-radius: var(--m-radius-lg);
        box-shadow: var(--m-shadow-sm);
      "
    >
      <p
        style="
          margin: 0 0 var(--m-space-3);
          font-size: var(--m-font-size-xs);
          color: var(--m-color-text-muted);
          text-align: center;
        "
      >
        Collapsed
      </p>
      <MMenu
        v-model:selected-key="selectedKey"
        :model="model"
        collapsed
        embedded
        :collapsed-width="64"
      />
    </div>
  </div>
</template>
