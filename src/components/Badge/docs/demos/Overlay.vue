<script setup lang="ts">
import { MBadge, MButton } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <MBadge :value="120" :max="99">
      <MButton label="Inbox" severity="secondary" />
    </MBadge>
    <MBadge processing>
      <MButton label="Live" icon="check" />
    </MBadge>
  </div>
</template>
