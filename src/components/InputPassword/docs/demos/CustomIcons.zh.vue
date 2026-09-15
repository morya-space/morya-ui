<script setup lang="ts">
import { MIcon, MInputPassword } from 'morya-ui'
import { ref } from 'vue'

const byProp = ref('')
const bySlot = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;max-width:20rem">
    <MInputPassword v-model="byProp" label="属性替换" show-icon="unlock" hide-icon="lock" />
    <MInputPassword v-model="bySlot" label="插槽替换">
      <template #showIcon>
        <MIcon name="search" size="sm" />
      </template>
      <template #hideIcon>
        <MIcon name="close" size="sm" />
      </template>
    </MInputPassword>
  </div>
</template>
