<script setup lang="ts">
import { MCheckbox, MCheckboxGroup } from 'morya-ui'
import { ref } from 'vue'

const selected = ref(['vue'])
</script>

<template>
  <MCheckboxGroup v-model="selected">
    <MCheckbox value="vue" label="Vue" />
    <MCheckbox value="react" label="React" />
    <MCheckbox :indeterminate="selected.length === 1" label="Mixed (demo)" />
  </MCheckboxGroup>
</template>
