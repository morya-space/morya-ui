<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <div
    class="rounded-md p-4"
    style="background: linear-gradient(135deg, #0f172a, #1d4ed8)"
  >
    <MFlex gap="small" wrap>
      <MButton type="primary" ghost label="Primary Ghost" />
      <MButton ghost label="Default Ghost" />
      <MButton type="dashed" ghost label="Dashed Ghost" />
      <MButton type="primary" danger ghost label="Danger Ghost" />
    </MFlex>
  </div>
</template>
