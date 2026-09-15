<script setup lang="ts">
import { MScrollbar } from 'morya-ui'
</script>

<template>
  <MScrollbar height="240px" always class="w-full">
    <p
      v-for="item in 20"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--m-color-primary) 12%, transparent);
        color:var(--m-color-primary);
      "
    >
      {{ item }}
    </p>
  </MScrollbar>
</template>
