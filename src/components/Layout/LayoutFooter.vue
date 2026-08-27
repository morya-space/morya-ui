<script setup lang="ts">
import type { LayoutFooterProps } from "./types";
import { computed } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "WiLayoutFooter" });

const props = withDefaults(defineProps<LayoutFooterProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    heightFallback: "var(--wi-layout-footer-height, 48px)",
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wi-layout-footer",
    `wi-layout-footer--${props.position}-positioned`,
    {
        "wi-layout-footer--bordered": props.bordered,
        "wi-layout-footer--inverted": props.inverted,
    },
]);
</script>

<template>
  <footer :class="rootClass" :style="rootStyle">
    <slot />
  </footer>
</template>
