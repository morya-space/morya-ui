<script setup lang="ts">
import { MButton, MDrawer, MFlex } from 'morya-ui';
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


  <MDrawer v-model="showDialog" width="72rem" header="测试抽屉">
    22
  </MDrawer>
</template>

<style scoped>

</style>