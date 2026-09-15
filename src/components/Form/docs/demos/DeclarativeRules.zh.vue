<script setup lang="ts">
import type { FormInstance, FormRules } from 'morya-ui'
import { MButton, MForm, MFormItem, MInput } from 'morya-ui'
import { reactive, ref } from 'vue'

const formRef = ref<FormInstance | null>(null)
const model = reactive({ name: '', email: '' })
const rules: FormRules = {
  name: { required: true, message: '请输入名称', trigger: ['blur', 'input'] },
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /.[^\n\r@\u2028\u2029]*@.+\..+/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

async function onSubmit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
}
</script>

<template>
  <MForm
    ref="formRef"
    :model="model"
    :rules="rules"
    label-position="top"
    validate-on="submit"
    style="max-width: 22rem"
    @submit="onSubmit"
  >
    <MFormItem label="名称" name="name">
      <template #default="{ id, invalid }">
        <MInput :id="id" v-model="model.name" fluid :invalid="invalid" />
      </template>
    </MFormItem>
    <MFormItem label="邮箱" name="email" help="用于接收通知">
      <template #default="{ id, invalid }">
        <MInput :id="id" v-model="model.email" type="email" fluid :invalid="invalid" />
      </template>
    </MFormItem>
    <MButton native-type="submit" label="提交" />
  </MForm>
</template>
