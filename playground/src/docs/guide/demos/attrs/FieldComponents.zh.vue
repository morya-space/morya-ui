<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
function onEnter() {
  // submit
}
</script>

<template>
  <!-- 布局类、测试 id 等加在外层；键盘事件绑控件 -->
  <MInput
    v-model="name"
    class="signup-field"
    data-testid="user-name"
    title="Display name"
    placeholder="Your name"
    @keydown.enter="onEnter"
  />
</template>
