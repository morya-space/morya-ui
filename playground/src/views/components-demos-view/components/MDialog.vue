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
    <MButton type="primary">
      Click me
    </MButton>
    <MButton type="danger">
      Click me
    </MButton>
  </MFlex>


  <MDialog v-model="showDialog">
    222
  </MDialog>
</template>

<style scoped>

</style>