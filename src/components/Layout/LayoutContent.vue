<script setup lang="ts">
import type { LayoutContentProps } from "./types";
import { computed, useAttrs } from "vue";
import { useRootParts } from '../../shared/useComponentAttrs'
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";

defineOptions({ name: "MLayoutContent", inheritAttrs: false });

const props = withDefaults(defineProps<LayoutContentProps>(), {
    embedded: false,
    position: "static",
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    padding: props.padding,
    radius: props.radius,
    applyDefaultPadding: false,
}));

const rootClass = computed(() => [
    "m-layout",
    "m-layout-content",
    `m-layout--${props.position}-positioned`,
    {
        "m-layout--embedded": props.embedded,
    },
]);
</script>

<template>
  <main v-bind="rootAttrs" :class="rootClass" :style="rootStyle">
    <slot />
  </main>
</template>
