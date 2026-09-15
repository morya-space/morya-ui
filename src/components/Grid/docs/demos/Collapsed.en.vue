<script setup lang="ts">
import { MButton, MGrid, MGridItem } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(true)
</script>

<template>
  <div class="grid gap-3">
    <MButton size="small" :label="collapsed ? 'Expand' : 'Collapse'" @click="collapsed = !collapsed" />
    <MGrid :cols="4" :x-gap="8" :y-gap="8" :collapsed="collapsed" :collapsed-rows="1">
      <MGridItem v-for="n in 6" :key="n" :span="1">
        <div style="padding:0.5rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
          {{ n }}
        </div>
      </MGridItem>
      <MGridItem suffix :span="1">
        <template #default="{ overflow }">
          <div style="padding:0.5rem;color:var(--m-color-text-muted);font-size:0.75rem">
            {{ overflow ? 'More…' : 'All' }}
          </div>
        </template>
      </MGridItem>
    </MGrid>
  </div>
</template>
