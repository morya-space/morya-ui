<script setup lang="ts">
import type { LayoutHeaderProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "WdLayoutHeader" });

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
    bordered: true,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--wd-layout-header-height, 56px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wd-layout-header",
    `wd-layout-header--${props.position}-positioned`,
    {
        "wd-layout-header--bordered": props.bordered,
        "wd-layout-header--inverted": props.inverted,
    },
]);
</script>

<template>
  <header :class="rootClass" :style="rootStyle">
    <slot />
  </header>
</template>
