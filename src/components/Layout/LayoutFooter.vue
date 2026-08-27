<script setup lang="ts">
import type { LayoutFooterProps } from "./types";
import { computed } from "vue";
import { toCssLength } from "../../shared/responsive";

defineOptions({ name: "WiLayoutFooter" });

const props = withDefaults(defineProps<LayoutFooterProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = computed(() => ({
    minHeight:
        props.height == null
            ? "var(--wi-layout-footer-height, 48px)"
            : toCssLength(props.height),
    padding:
        props.padding == null
            ? "var(--wi-layout-padding, 0)"
            : toCssLength(props.padding),
    borderRadius:
        props.radius == null
            ? "var(--wi-layout-radius, 0)"
            : toCssLength(props.radius),
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
