<script setup lang="ts">
/**
 * 黄金样例：列表空状态（Flow）
 * @see DESIGN.md · page-layouts.md · surfaces § Flow
 * 可嵌在列表页 MPageContent / MTable #empty 中；此处给出完整可运行骨架。
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MEmpty,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  zhCN,
} from 'morya-ui'
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '课程' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent>
          <MPageHeader title="{{页面标题}}" description="{{页面说明}}">
            <template #actions>
              <MButton type="primary">
                {{主操作}}
              </MButton>
            </template>
          </MPageHeader>

          <!-- 空态说明"接下来做什么"；illustration 跟 styleDirection -->
          <MEmpty
            title="{{空态标题}}"
            description="{{空态说明}}"
            illustration="no-content"
          >
            <template #extra>
              <MButton type="primary">
                {{空态主操作}}
              </MButton>
              <MButton type="text">
                {{空态次操作}}
              </MButton>
            </template>
          </MEmpty>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>
