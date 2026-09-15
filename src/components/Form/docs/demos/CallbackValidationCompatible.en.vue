<script setup lang="ts">
import { MButton, MForm, MFormItem, MInput } from 'morya-ui'
import { reactive } from 'vue'

const form = reactive({ name: '' })
</script>

<template>
  <MForm validate-on="submit" style="max-width: 22rem">
    <MFormItem
      label="Name"
      name="name"
      required
      :validate="() => (form.name.trim() ? undefined : 'Enter a name')"
    >
      <template #default="{ id, invalid }">
        <MInput :id="id" v-model="form.name" fluid :invalid="invalid" />
      </template>
    </MFormItem>
    <MButton native-type="submit" label="Submit" />
  </MForm>
</template>
