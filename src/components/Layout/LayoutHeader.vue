<script setup lang="ts">
import type { LayoutHeaderProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "RdLayoutHeader" });

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
    bordered: true,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--rd-layout-header-height, 56px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "rd-layout-header",
    `rd-layout-header--${props.position}-positioned`,
    {
        "rd-layout-header--bordered": props.bordered,
        "rd-layout-header--inverted": props.inverted,
    },
]);
</script>

<template>
  <header :class="rootClass" :style="rootStyle">
    <slot />
  </header>
</template>
