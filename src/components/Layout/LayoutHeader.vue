<script setup lang="ts">
import type { LayoutHeaderProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "WiLayoutHeader" });

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
    bordered: true,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--wi-layout-header-height, 56px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wi-layout-header",
    `wi-layout-header--${props.position}-positioned`,
    {
        "wi-layout-header--bordered": props.bordered,
        "wi-layout-header--inverted": props.inverted,
    },
]);
</script>

<template>
  <header :class="rootClass" :style="rootStyle">
    <slot />
  </header>
</template>
