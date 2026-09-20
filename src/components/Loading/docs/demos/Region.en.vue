<script setup lang="ts">
import { MButton, MLoading, vLoading } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <div class="grid gap-4">
    <MLoading :loading="loading" text="Loading" effect="wave">
      <div class="min-h-32 p-4">
        Region content
      </div>
    </MLoading>
    <div
      v-loading="loading"
      m-loading-text="Loading"
      m-loading-effect="circular"
      class="min-h-32 rounded-md border border-solid border-[var(--m-color-border)] p-4"
    >
      Directive target
    </div>
    <div>
      <MButton size="small" :label="loading ? 'Stop' : 'Start'" @click="loading = !loading" />
    </div>
  </div>
</template>
