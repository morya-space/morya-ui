<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical size="medium">
    <MFlex wrap align="center" size="medium">
      <MButton label="default" />
      <MButton type="primary" label="primary" />
      <MButton type="dashed" label="dashed" />
      <MButton type="text" label="text" />
      <MButton type="link" label="link" />
      <MButton icon="check" label="icon" />
      <MButton icon="search" icon-placement="end" label="iconPlacement" />
      <MButton icon="plus" icon-only aria-label="iconOnly" />
      <MButton type="primary" danger label="danger" />
      <MButton color="success" variant="solid" label="success" />
      <MButton color="info" variant="filled" label="filled" />
      <MButton shape="round" label="round" />
      <MButton type="primary" ghost label="ghost" />
      <MButton size="large" label="large" />
      <MButton loading label="loading" />
      <MButton disabled label="disabled" />
      <MButton autofocus label="autofocus" />
      <MButton html-type="submit" label="htmlType" />
      <MButton icon="info-circle" label="ariaLabel" aria-label="ariaLabel" />
      <MButton type="primary" ripple label="ripple" />
      <MButton type="primary" press label="press" />
    </MFlex>
    <MButton type="primary" label="block" block />
  </MFlex>
</template>
