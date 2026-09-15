<script setup lang="ts">
import { MDivider } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <MDivider type="solid" label="Solid" />
    <MDivider type="dashed" label="Dashed" />
    <MDivider type="dotted" label="Dotted" />
  </div>
</template>
