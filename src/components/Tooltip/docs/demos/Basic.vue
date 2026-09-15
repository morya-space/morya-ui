<script setup lang="ts">
import { MButton, MTooltip } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <MTooltip content="Save changes" placement="top">
      <MButton icon="check" icon-only aria-label="Save" />
    </MTooltip>
    <MTooltip content="Delete item" placement="bottom" :show-delay="200" :hide-delay="120" :max-width="160">
      <MButton icon="trash" icon-only severity="danger" outlined aria-label="Delete" />
    </MTooltip>
  </div>
</template>
