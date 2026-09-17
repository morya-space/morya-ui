<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="success" description="Your order was created. You can review it in the list.">
      <template #footer>
        <MButton label="View order" />
        <MButton label="Back home" severity="secondary" text />
      </template>
    </MResult>
    <MResult status="error" description="Check your network and try again, or contact an admin.">
      <template #footer>
        <MButton label="Retry" />
      </template>
    </MResult>
  </div>
</template>
