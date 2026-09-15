<script setup lang="ts">
import { MScrollbar } from 'morya-ui'
</script>

<template>
  <MScrollbar always>
    <div style="display:flex;width:fit-content">
      <p
        v-for="item in 30"
        :key="item"
        style="
          flex-shrink:0;display:flex;align-items:center;justify-content:center;
          width:96px;height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--m-color-danger) 12%, transparent);
          color:var(--m-color-danger);
        "
      >
        {{ item }}
      </p>
    </div>
  </MScrollbar>
</template>
