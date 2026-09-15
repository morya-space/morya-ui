<script setup lang="ts">
import { MButton, MScrollbar } from 'morya-ui'
import { ref } from 'vue'

const count = ref(3)
</script>

<template>
  <div class="grid gap-3">
    <div style="display:flex;gap:0.5rem">
      <MButton label="Add" size="small" @click="count++" />
      <MButton label="Remove" severity="secondary" size="small" @click="count = Math.max(0, count - 1)" />
    </div>
    <MScrollbar max-height="220px" always class="w-full">
      <p
        v-for="item in count"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--m-color-info) 12%, transparent);
          color:var(--m-color-info);
        "
      >
        Item {{ item }}
      </p>
    </MScrollbar>
  </div>
</template>
