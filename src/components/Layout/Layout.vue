<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import { useRootParts } from '../../shared/useComponentAttrs'
import type { LayoutExpose, LayoutProps } from "./types";
import { computed, provide, ref, useAttrs } from "vue";
import { toCssLength } from "../../shared/responsive";
import LayoutScrollRegion from "./LayoutScrollRegion.vue";
import { M_LAYOUT_KEY } from "./context";

defineOptions({ name: "MLayout", inheritAttrs: false });

const props = withDefaults(defineProps<LayoutProps>(), {
    embedded: false,
    position: "static",
    hasSider: false,
    siderPlacement: "left",
    fillViewport: false,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const emit = defineEmits<{
    (event: "scroll", eventPayload: Event): void;
}>();

provide(M_LAYOUT_KEY, {
    get hasSider() {
        return props.hasSider;
    },
    get siderPlacement() {
        return props.siderPlacement;
    },
});

const scrollRegionRef = ref<InstanceType<typeof LayoutScrollRegion>>();

const rootStyle = computed(() => ({
    ...(props.height != null ? { height: toCssLength(props.height) } : {}),
    width: props.width == null ? "100%" : toCssLength(props.width),
}));

const rootClass = computed(() => [
    "m-layout",
    `m-layout--${props.position}-positioned`,
    {
        "m-layout--embedded": props.embedded,
        "m-layout--fill-viewport": props.fillViewport,
        "m-layout--has-sider": props.hasSider,
        "m-layout--sider-right":
            props.hasSider && props.siderPlacement === "right",
    },
]);

const hasSiderStyle = computed((): CSSProperties => ({
    display: "flex",
    flexWrap: "nowrap",
    width: "100%",
    flexDirection: props.siderPlacement === "right" ? "row-reverse" : "row",
}));

const scrollStyle = computed((): StyleValue => props.contentStyle);

const viewStyle = computed((): StyleValue =>
    props.hasSider ? hasSiderStyle.value : undefined,
);

const scrollClass = computed(() => [
    "m-layout__scroll",
    props.contentClass,
    { "m-layout__scroll--has-sider": props.hasSider },
]);

const viewClass = computed(() => ({
    "m-layout__scroll-view--has-sider": props.hasSider,
}));

defineExpose<LayoutExpose>({
    scrollTo: ((...args: Parameters<LayoutExpose["scrollTo"]>) =>
        scrollRegionRef.value?.scrollTo(...args)) as LayoutExpose["scrollTo"],
});
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass" :style="rootStyle">
    <LayoutScrollRegion
      ref="scrollRegionRef"
      :has-sider="hasSider"
      :sider-placement="siderPlacement"
      scrollbar-root-class="m-layout__scrollbar"
      :scroll-class="scrollClass"
      :scroll-style="scrollStyle"
      :view-class="viewClass"
      :view-style="viewStyle"
      @scroll="emit('scroll', $event)"
    >
      <slot />
    </LayoutScrollRegion>
  </div>
</template>
