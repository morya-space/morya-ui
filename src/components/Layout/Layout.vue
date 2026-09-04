<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import type { LayoutExpose, LayoutProps } from "./types";
import { computed, provide, ref } from "vue";
import { toCssLength } from "../../shared/responsive";
import { useLayoutScroll } from "./composables/useLayoutScroll";
import { WI_LAYOUT_KEY } from "./context";

defineOptions({ name: "WiLayout" });

const props = withDefaults(defineProps<LayoutProps>(), {
    embedded: false,
    position: "static",
    hasSider: false,
    siderPlacement: "left",
});

const emit = defineEmits<{
    (event: "scroll", eventPayload: Event): void;
}>();

provide(WI_LAYOUT_KEY, {
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
    "wi-layout",
    `wi-layout--${props.position}-positioned`,
    {
        "wi-layout--embedded": props.embedded,
        "wi-layout--has-sider": props.hasSider,
        "wi-layout--sider-right":
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
    "wi-layout__scroll",
    props.contentClass,
    { "wi-layout__scroll--has-sider": props.hasSider },
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
