<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="403" description="You do not have permission to access this resource.">
      <template #extra>
        <MButton label="Go back" severity="secondary" />
      </template>
    </MResult>
    <MResult status="404" description="This page does not exist or was removed." />
    <MResult status="500" description="The service is temporarily unavailable. Try again later." />
  </div>
</template>
