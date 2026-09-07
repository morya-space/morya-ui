<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import type { LayoutExpose, LayoutProps } from "./types";
import { computed, provide, ref } from "vue";
import { toCssLength } from "../../shared/responsive";
import { useLayoutScroll } from "./composables/useLayoutScroll";
import { RD_LAYOUT_KEY } from "./context";

defineOptions({ name: "RdLayout" });

const props = withDefaults(defineProps<LayoutProps>(), {
    embedded: false,
    position: "static",
    hasSider: false,
    siderPlacement: "left",
});

const emit = defineEmits<{
    (event: "scroll", eventPayload: Event): void;
}>();

provide(RD_LAYOUT_KEY, {
    get hasSider() {
        return props.hasSider;
    },
    get siderPlacement() {
        return props.siderPlacement;
    },
});

const scrollEl = ref<HTMLElement | null>(null);
const { scrollTo, onScroll } = useLayoutScroll(scrollEl, emit);

const rootStyle = computed(() => ({
    ...(props.height != null ? { height: toCssLength(props.height) } : {}),
    width: props.width == null ? "100%" : toCssLength(props.width),
}));

const rootClass = computed(() => [
    "rd-layout",
    `rd-layout--${props.position}-positioned`,
    {
        "rd-layout--embedded": props.embedded,
        "rd-layout--has-sider": props.hasSider,
        "rd-layout--sider-right":
            props.hasSider && props.siderPlacement === "right",
    },
]);

const scrollStyle = computed((): StyleValue => {
    if (!props.hasSider) return props.contentStyle;
    const hasSiderStyle: CSSProperties = {
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        flexDirection: props.siderPlacement === "right" ? "row-reverse" : "row",
    };
    return [props.contentStyle, hasSiderStyle];
});

const scrollClass = computed(() => [
    "rd-layout__scroll",
    props.contentClass,
    { "rd-layout__scroll--has-sider": props.hasSider },
]);

defineExpose<LayoutExpose>({ scrollTo });
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <div
      ref="scrollEl"
      :class="scrollClass"
      :style="scrollStyle"
      @scroll="onScroll"
    >
      <slot />
    </div>
  </div>
</template>
