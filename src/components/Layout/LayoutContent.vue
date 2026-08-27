<script setup lang="ts">
import type { StyleValue } from "vue";
import type { ScrollbarInstance } from "../Scrollbar/types";
import type { LayoutContentProps, LayoutExpose } from "./types";
import { computed, useTemplateRef } from "vue";
import WiScrollbar from "../Scrollbar/Scrollbar.vue";
import { toCssLength } from "../../shared/responsive";

defineOptions({ name: "WiLayoutContent" });

const props = withDefaults(defineProps<LayoutContentProps>(), {
    embedded: false,
    position: "static",
    nativeScrollbar: true,
});

const emit = defineEmits<{
    (event: "scroll", eventPayload: Event): void;
}>();

const scrollEl = useTemplateRef<HTMLElement>("scrollEl");
const scrollbarRef = useTemplateRef<ScrollbarInstance>("scrollbarRef");

const rootStyle = computed(() => ({
    ...(props.height == null ? {} : { height: toCssLength(props.height) }),
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
    "wi-layout",
    "wi-layout-content",
    `wi-layout--${props.position}-positioned`,
    {
        "wi-layout--embedded": props.embedded,
        "wi-layout--custom-scrollbar": !props.nativeScrollbar,
    },
]);

const scrollClass = computed(() => ["wi-layout__scroll", props.contentClass]);
const scrollStyle = computed((): StyleValue => props.contentStyle);

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
    <main :class="rootClass" :style="rootStyle">
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
    </main>
</template>
