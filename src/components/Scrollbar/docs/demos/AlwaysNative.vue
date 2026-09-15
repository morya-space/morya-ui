<script setup lang="ts">
import { MScrollbar } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;grid-template-columns:1fr 1fr">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--m-color-text-muted)">
        always
      </p>
      <MScrollbar height="160px" always>
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">
          Line {{ n }}
        </p>
      </MScrollbar>
    </div>
    <div>
      <p style="margin:0 0 0.5rem;color:var(--m-color-text-muted)">
        native
      </p>
      <MScrollbar height="160px" native style="width: 200px">
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">
          Line {{ n }}
        </p>
      </MScrollbar>
    </div>
  </div>
</template>
