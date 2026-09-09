<script setup lang="ts">
import type { LayoutHeaderProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "MLayoutHeader" });

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
    bordered: true,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--m-layout-header-height, 56px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "m-layout-header",
    `m-layout-header--${props.position}-positioned`,
    {
        "m-layout-header--bordered": props.bordered,
        "m-layout-header--inverted": props.inverted,
    },
]);
</script>

<template>
  <header :class="rootClass" :style="rootStyle">
    <slot />
  </header>
</template>
