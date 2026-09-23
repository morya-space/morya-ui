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
      <MPageHeader title="用户管理" description="维护账号与角色。">
        <template #actions>
          <MButton severity="primary">
            新建
          </MButton>
        </template>
      </MPageHeader>
      <MPageFilters aria-label="筛选" variant="filled">
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="搜索" clearable class="w-48" />
          <MButton severity="secondary">
            查询
          </MButton>
        </MSpace>
      </MPageFilters>
      <MPageToolbar>
        <span style="color:var(--m-color-text-muted);font-size:var(--m-font-size-sm)">已选 0 项</span>
        <template #actions>
          <MButton severity="secondary" text>
            导出
          </MButton>
          <MButton severity="danger" text>
            删除
          </MButton>
        </template>
      </MPageToolbar>
    </MPageContent>
  </div>
</template>
