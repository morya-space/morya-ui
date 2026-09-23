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
          <MPageHeader title="课程" description="管理目录与可见性。">
            <template #actions>
              <MButton severity="primary">
                新建课程
              </MButton>
            </template>
          </MPageHeader>

          <MEmpty
            title="还没有课程"
            description="创建第一门课程后，学员就能在目录里看到它。也可以稍后从模板导入。"
            icon="book"
          >
            <template #extra>
              <MButton severity="primary">
                创建第一门课程
              </MButton>
              <MButton severity="secondary" text>
                从模板导入
              </MButton>
            </template>
          </MEmpty>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>
