<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)

async function save() {
  await new Promise((resolve) => setTimeout(resolve, 400))
}
</script>

<template>
  <div>
    <MButton label="Save dialog" @click="open = true" />
    <MDialog
      v-model="open"
      header="保存更改"
      type="info"
      positive-text="保存"
      negative-text="取消"
      :on-positive-click="save"
      :before-close="() => true"
      width="28rem"
    >
      <p style="margin:0">
        关闭按钮、Esc、遮罩会走 <code>beforeClose</code>；保存走 <code>onPositiveClick</code>。
      </p>
    </MDialog>
  </div>
</template>
