<script setup lang="ts">
import type { LayoutSiderPlacement } from "./types";
import { provide } from "vue";
import { M_LAYOUT_KEY } from "./context";

const props = defineProps<{
  hasSider: boolean;
  siderPlacement: LayoutSiderPlacement;
}>();

provide(M_LAYOUT_KEY, {
  get hasSider() {
    return props.hasSider;
  },
  get siderPlacement() {
    return props.siderPlacement;
  },
});
</script>

<template>
  <slot />
</template>
