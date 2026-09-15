<script setup lang="ts">
import type { StyleValue } from "vue";
import type { LayoutContentProps, LayoutExpose } from "./types";
import { computed, ref, useAttrs } from "vue";
import { useRootParts } from '../../shared/useComponentAttrs'
import { useLayoutRegionStyle } from "./composables/useLayoutRegionStyle";
import LayoutScrollRegion from "./LayoutScrollRegion.vue";

defineOptions({ name: "MLayoutContent", inheritAttrs: false });

const props = withDefaults(defineProps<LayoutContentProps>(), {
    embedded: false,
    position: "static",
})
const emit = defineEmits<{
    (event: "scroll", eventPayload: Event): void;
}>();
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const scrollRegionRef = ref<InstanceType<typeof LayoutScrollRegion>>();

const rootStyle = useLayoutRegionStyle(() => ({
    height: props.height,
    padding: props.padding,
    radius: props.radius,
}));

const rootClass = computed(() => [
    "m-layout",
    "m-layout-content",
    `m-layout--${props.position}-positioned`,
    {
        "m-layout--embedded": props.embedded,
    },
]);

const scrollClass = computed(() => ["m-layout__scroll", props.contentClass]);
const scrollStyle = computed((): StyleValue => props.contentStyle);

defineExpose<LayoutExpose>({
    scrollTo: ((...args: Parameters<LayoutExpose["scrollTo"]>) =>
        scrollRegionRef.value?.scrollTo(...args)) as LayoutExpose["scrollTo"],
});
</script>

<template>
  <main v-bind="rootAttrs" :class="rootClass" :style="rootStyle">
    <LayoutScrollRegion
      ref="scrollRegionRef"
      scrollbar-root-class="m-layout__scrollbar"
      :scroll-class="scrollClass"
      :scroll-style="scrollStyle"
      @scroll="emit('scroll', $event)"
    >
      <slot />
    </LayoutScrollRegion>
  </main>
</template>
