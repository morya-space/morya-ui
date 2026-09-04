<script setup lang="ts">
import type { LayoutFooterProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "WdLayoutFooter" });

const props = withDefaults(defineProps<LayoutFooterProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--wd-layout-footer-height, 48px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wd-layout-footer",
    `wd-layout-footer--${props.position}-positioned`,
    {
        "wd-layout-footer--bordered": props.bordered,
        "wd-layout-footer--inverted": props.inverted,
    },
]);
</script>

<template>
  <footer :class="rootClass" :style="rootStyle">
    <slot />
  </footer>
</template>
