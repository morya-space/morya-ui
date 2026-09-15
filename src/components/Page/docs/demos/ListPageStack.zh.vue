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
      <MPageFilters aria-label="筛选">
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="搜索" clearable class="w-48" />
          <MButton severity="primary">
            查询
          </MButton>
        </MSpace>
      </MPageFilters>
      <MPageToolbar title="用户管理">
        <template #actions>
          <MButton severity="primary">
            新建
          </MButton>
        </template>
      </MPageToolbar>
    </MPageContent>
  </div>
</template>
