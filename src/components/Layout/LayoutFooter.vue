<script setup lang="ts">
import type { LayoutFooterProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "WkLayoutFooter" });

const props = withDefaults(defineProps<LayoutFooterProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--wk-layout-footer-height, 48px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wk-layout-footer",
    `wk-layout-footer--${props.position}-positioned`,
    {
        "wk-layout-footer--bordered": props.bordered,
        "wk-layout-footer--inverted": props.inverted,
    },
]);
</script>

<template>
  <footer :class="rootClass" :style="rootStyle">
    <slot />
  </footer>
</template>
