<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import type { ScrollbarInstance } from "../Scrollbar/types";
import type { LayoutExpose, LayoutProps } from "./types";
import { computed, provide, useTemplateRef } from "vue";
import WiScrollbar from "../Scrollbar/Scrollbar.vue";
import { WI_LAYOUT_KEY } from "./context";
import { toCssLength } from "../../shared/responsive";

defineOptions({ name: "WiLayout" });

const props = withDefaults(defineProps<LayoutProps>(), {
    embedded: false,
    position: "static",
    hasSider: false,
    siderPlacement: "left",
    nativeScrollbar: true,
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

const scrollEl = useTemplateRef<HTMLElement>("scrollEl");
const scrollbarRef = useTemplateRef<ScrollbarInstance>("scrollbarRef");

const rootStyle = computed(() => ({
    height:
        props.height == null
            ? "var(--wi-layout-height, 100%)"
            : toCssLength(props.height),
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
        "wi-layout--custom-scrollbar": !props.nativeScrollbar,
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

const scrollbarViewClass = computed(() => {
    const extra = props.scrollbarProps?.viewClass;
    const base = scrollClass.value.filter(Boolean);
    if (extra == null || extra === "") return base;
    if (Array.isArray(extra)) return [...base, ...extra];
    if (typeof extra === "object") return [...base, extra];
    return [...base, extra];
});

const scrollbarViewStyle = computed((): StyleValue => {
    const extra = props.scrollbarProps?.viewStyle;
    if (extra == null || extra === "") return scrollStyle.value;
    return [scrollStyle.value, extra];
});

function scrollTo(options: ScrollToOptions): void;
function scrollTo(x: number, y: number): void;
function scrollTo(options: ScrollToOptions | number, y?: number): void {
    if (props.nativeScrollbar) {
        const el = scrollEl.value;
        if (!el) return;
        if (typeof options === "number") el.scrollTo(options, y ?? 0);
        else el.scrollTo(options);
        return;
    }
    const scrollbar = scrollbarRef.value;
    if (!scrollbar) return;
    if (typeof options === "number") scrollbar.scrollTo(options, y ?? 0);
    else scrollbar.scrollTo(options);
}

function onScroll(event: Event) {
    emit("scroll", event);
}

function onScrollbarScroll() {
    const wrap = scrollbarRef.value?.wrapRef;
    if (!wrap) return;
    const event = new Event("scroll");
    Object.defineProperty(event, "target", { value: wrap });
    Object.defineProperty(event, "currentTarget", { value: wrap });
    emit("scroll", event);
}

defineExpose<LayoutExpose>({ scrollTo });
</script>

<template>
    <div :class="rootClass" :style="rootStyle">
        <div
            v-if="nativeScrollbar"
            ref="scrollEl"
            :class="scrollClass"
            :style="scrollStyle"
            @scroll="onScroll"
        >
            <slot />
        </div>
        <WiScrollbar
            v-else
            ref="scrollbarRef"
            class="wi-layout__scrollbar"
            height="100%"
            v-bind="scrollbarProps"
            :view-class="scrollbarViewClass"
            :view-style="scrollbarViewStyle"
            @scroll="onScrollbarScroll"
        >
            <slot />
        </WiScrollbar>
    </div>
</template>
