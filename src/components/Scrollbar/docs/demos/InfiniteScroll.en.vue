<script setup lang="ts">
import type { ScrollbarDirection } from 'morya-ui'
import { MScrollbar } from 'morya-ui'
import { ref } from 'vue'

const num = ref(20)

function loadMore(direction: ScrollbarDirection) {
  if (direction === 'bottom') num.value += 5
}
</script>

<template>
  <MScrollbar height="220px" style="width: 200px" always @end-reached="loadMore">
    <p
      v-for="item in num"
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
