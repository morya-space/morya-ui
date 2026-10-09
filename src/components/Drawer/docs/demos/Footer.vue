<script setup lang="ts">
import { MButton, MDrawer, MSpace } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="With Footer" @click="open = true" />
    <MDrawer v-model="open" header="Edit details" position="right" :width="360">
      <p style="margin:0">
        Put primary and secondary actions in the footer slot so the body can scroll independently.
      </p>
      <template #footer>
        <MSpace style="justify-content: flex-end; width: 100%">
          <MButton label="Cancel" @click="open = false" type="text"/>
          <MButton label="Save" @click="open = false" />
        </MSpace>
      </template>
    </MDrawer>
  </div>
</template>
