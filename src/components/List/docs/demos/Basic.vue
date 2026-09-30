<script setup lang="ts">
import { MAvatar, MList, MListItem, MListItemMeta } from 'morya-ui'

const data = [
  {
    id: '1',
    title: '列表标题 1',
    description: '用于后台与工具类产品的界面设计语言示例文案。',
  },
  {
    id: '2',
    title: '列表标题 2',
    description: 'We supply a series of design principles, practical patterns and high quality design resources.',
  },
  {
    id: '3',
    title: '列表标题 3',
    description: 'Creating a product that people love.',
  },
]
</script>

<template>
  <MList
    header="Header"
    footer="Footer"
    bordered
    :items="data"
    row-key="id"
  >
    <template #item="{ item }">
      <MListItem>
        <MListItemMeta
          :title="item.title"
          :description="item.description"
        >
          <template #avatar>
            <MAvatar
              :label="item.title.slice(0, 1)"
              shape="circle"
            />
          </template>
        </MListItemMeta>
      </MListItem>
    </template>
  </MList>
</template>
