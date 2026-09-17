<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
    <MResult
      size="small"
      status="success"
      title="Saved"
    >
      <template #footer>
        <MButton
          label="OK"
          size="small"
          severity="secondary"
        />
      </template>
    </MResult>
    <MResult
      size="small"
      status="error"
      title="Upload failed"
    >
      <template #footer>
        <MButton
          label="Retry"
          size="small"
        />
      </template>
    </MResult>
  </div>
</template>
