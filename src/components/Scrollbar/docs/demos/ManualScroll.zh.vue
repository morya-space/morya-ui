<script setup lang="ts">
import type { ScrollbarInstance } from 'morya-ui'
import { MButton, MScrollbar } from 'morya-ui'
import { ref } from 'vue'

const scrollbarRef = ref<ScrollbarInstance>()
const scrollTop = ref(0)

function jump(top: number) {
  scrollbarRef.value?.setScrollTop(top)
}

function onScroll(payload: { scrollTop: number }) {
  scrollTop.value = Math.round(payload.scrollTop)
}
</script>

<template>
  <div class="grid gap-3">
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
      <MButton label="Top" size="small" @click="jump(0)" />
      <MButton label="Mid" size="small" severity="secondary" @click="jump(200)" />
      <MButton label="Bottom" size="small" severity="secondary" @click="jump(9999)" />
      <span style="color:var(--m-color-text-muted);font-size:0.875rem">scrollTop: {{ scrollTop }}</span>
    </div>
    <MScrollbar ref="scrollbarRef" height="200px" style="width: 200px" always @scroll="onScroll">
      <p
        v-for="item in 24"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--m-color-success) 12%, transparent);
          color:var(--m-color-success);
        "
      >
        {{ item }}
      </p>
    </MScrollbar>
  </div>
</template>
