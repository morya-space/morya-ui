<script setup lang="ts">
import { MForm, MFormItem, MInput } from 'morya-ui'
import { reactive } from 'vue'

const model = reactive({ city: '', zip: '' })
</script>

<template>
  <MForm
    :model="model"
    inline
    label-placement="left"
    label-align="right"
    :label-width="72"
    :rules="{ city: { required: true, message: '必填' } }"
  >
    <MFormItem label="城市" name="city">
      <template #default="{ id }">
        <MInput :id="id" v-model="model.city" />
      </template>
    </MFormItem>
    <MFormItem label="邮编" name="zip">
      <template #default="{ id }">
        <MInput :id="id" v-model="model.zip" />
      </template>
    </MFormItem>
  </MForm>
</template>
