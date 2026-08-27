<script setup lang="ts">
import type { LayoutHeaderProps } from "./types";
import { computed } from "vue";
import { toCssLength } from "../../shared/responsive";

defineOptions({ name: "WiLayoutHeader" });

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
});

const rootStyle = computed(() => ({
    minHeight:
        props.height == null
            ? "var(--wi-layout-header-height, 56px)"
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
