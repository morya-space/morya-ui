<script setup lang="ts">
import {
  MButton,
  MInput,
  MPageContent,
  MPageFilters,
  MPageToolbar,
  MSpace,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent>
      <MPageFilters aria-label="Filters">
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="Search" clearable class="w-48" />
          <MButton severity="primary">
            Search
          </MButton>
        </MSpace>
      </MPageFilters>
      <MPageToolbar title="Users">
        <template #actions>
          <MButton severity="primary">
            Create
          </MButton>
        </template>
      </MPageToolbar>
    </MPageContent>
  </div>
</template>
