<script setup lang="ts">
import type { LayoutFooterProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "RdLayoutFooter" });

const props = withDefaults(defineProps<LayoutFooterProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--rd-layout-footer-height, 48px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "rd-layout-footer",
    `rd-layout-footer--${props.position}-positioned`,
    {
        "rd-layout-footer--bordered": props.bordered,
        "rd-layout-footer--inverted": props.inverted,
    },
]);
</script>

<template>
  <footer :class="rootClass" :style="rootStyle">
    <slot />
  </footer>
</template>
