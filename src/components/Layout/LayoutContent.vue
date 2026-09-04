<script setup lang="ts">
import type { StyleValue } from "vue";
import type { LayoutContentProps, LayoutExpose } from "./types";
import { computed, ref } from "vue";
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";
import { useLayoutScroll } from "./composables/useLayoutScroll";

defineOptions({ name: "WiLayoutContent" });

const props = withDefaults(defineProps<LayoutContentProps>(), {
    embedded: false,
    position: "static",
});

const emit = defineEmits<{
    (event: "scroll", eventPayload: Event): void;
}>();

const scrollEl = ref<HTMLElement | null>(null);
const { scrollTo, onScroll } = useLayoutScroll(scrollEl, emit);

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "wi-layout",
    "wi-layout-content",
    `wi-layout--${props.position}-positioned`,
    {
        "wi-layout--embedded": props.embedded,
    },
]);

const scrollClass = computed(() => ["wi-layout__scroll", props.contentClass]);
const scrollStyle = computed((): StyleValue => props.contentStyle);

defineExpose<LayoutExpose>({ scrollTo });
</script>

<template>
  <main :class="rootClass" :style="rootStyle">
    <div
      ref="scrollEl"
      :class="scrollClass"
      :style="scrollStyle"
      @scroll="onScroll"
    >
      <slot />
    </div>
  </main>
</template>
