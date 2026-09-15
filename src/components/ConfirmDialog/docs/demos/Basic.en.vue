<script setup lang="ts">
import { MButton, MConfirmDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MButton label="Delete" severity="danger" @click="visible = true" />
  <MConfirmDialog
    v-model="visible"
    header="Confirm delete"
    message="Are you sure you want to delete this item? This action cannot be undone."
    accept-label="Delete"
    reject-label="Cancel"
    accept-severity="danger"
  />
</template>
