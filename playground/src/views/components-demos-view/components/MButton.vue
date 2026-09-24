<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui';
</script>

<template>
  <MFlex vertical size="medium">
    <MFlex wrap align="center" size="medium">
      <MButton label="label" />
      <MButton icon="check" label="icon" />
      <MButton icon="search" icon-pos="right" label="iconPos" />
      <MButton icon="plus" icon-only aria-label="iconOnly" />
      <MButton severity="danger" label="severity" />
      <MButton color="#7c3aed" label="color" />
      <MButton raised label="raised" />
      <MButton rounded label="rounded" />
      <MButton text label="text" />
      <MButton outlined label="outlined" />
      <MButton link label="link" />
      <MButton link :underline="false" label="underline" />
      <MButton ghost label="ghost" />
      <MButton quaternary label="quaternary" />
      <MButton plain severity="success" label="plain" />
      <MButton size="large" label="size" />
      <MButton loading label="loading" />
      <MButton disabled label="disabled" />
      <MButton badge="8" label="badge" />
      <MButton badge="8" badge-severity="danger" label="badgeSeverity" />
      <MButton autofocus label="autofocus" />
      <MButton native-type="submit" label="nativeType" />
      <MButton icon="info-circle" label="ariaLabel" aria-label="ariaLabel" />
      <MButton ripple label="ripple" />
      <MButton press label="press" />
    </MFlex>
    <MButton fluid label="fluid" />
  </MFlex>
</template>
