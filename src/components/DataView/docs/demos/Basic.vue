<script setup lang="ts">
import { MDataView } from 'morya-ui'

const items = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']
</script>

<template>
  <MDataView :value="items" layout="grid" paginator :rows="4">
    <template #grid="{ items: page }">
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
        <div v-for="(item, index) in page" :key="index">
          {{ item }}
        </div>
      </div>
    </template>
  </MDataView>
</template>
