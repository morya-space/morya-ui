<script setup lang="ts">
import type { LayoutFooterProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "MLayoutFooter" });

const props = withDefaults(defineProps<LayoutFooterProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--m-layout-footer-height, 48px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "m-layout-footer",
    `m-layout-footer--${props.position}-positioned`,
    {
        "m-layout-footer--bordered": props.bordered,
        "m-layout-footer--inverted": props.inverted,
    },
]);
</script>

<template>
  <footer :class="rootClass" :style="rootStyle">
    <slot />
  </footer>
</template>
