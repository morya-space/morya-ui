<script setup lang="ts">
import type { LayoutHeaderProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "WkLayoutHeader" });

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
    bordered: true,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--wk-layout-header-height, 56px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wk-layout-header",
    `wk-layout-header--${props.position}-positioned`,
    {
        "wk-layout-header--bordered": props.bordered,
        "wk-layout-header--inverted": props.inverted,
    },
]);
</script>

<template>
  <header :class="rootClass" :style="rootStyle">
    <slot />
  </header>
</template>
