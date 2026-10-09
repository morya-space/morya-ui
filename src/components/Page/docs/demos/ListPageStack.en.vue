<script setup lang="ts">
import {
  MButton,
  MInput,
  MPageContent,
  MPageFilters,
  MPageHeader,
  MPageToolbar,
  MSpace,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:visible;background:var(--m-color-surface)"
  >
    <MPageContent>
      <MPageHeader title="Users" description="Manage accounts and roles.">
        <template #actions>
          <MButton type="primary">
            Create
          </MButton>
        </template>
      </MPageHeader>
      <MPageFilters aria-label="Filters" variant="filled">
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="Search" clearable class="w-48" />
        </MSpace>
        <template #actions>
          <MButton>
            Search
          </MButton>
        </template>
      </MPageFilters>
      <MPageToolbar>
        <span style="color:var(--m-color-text-muted);font-size:var(--m-font-size-sm)">0 selected</span>
        <template #actions>
          <MButton type="text">
            Export
          </MButton>
          <MButton type="text" danger>
            Delete
          </MButton>
        </template>
      </MPageToolbar>
    </MPageContent>
  </div>
</template>
