<script setup lang="ts">
import { MButton, MDialog, MFlex } from 'morya-ui';
import { ref } from 'vue';

const showDialog = ref(false);

const  openDialog  =() => {
  showDialog.value = true;
}

</script>

<template>
  <MFlex>
    <MButton @click="openDialog">
      Click me
    </MButton>
  </MFlex>


  <MDialog v-model="showDialog" title="测试弹窗" width="72rem">
    222
  </MDialog>
</template>

<style scoped>

</style>