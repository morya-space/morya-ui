<script setup lang="ts">
import type { StyleValue } from "vue";
import type { ScrollbarInstance } from "../Scrollbar/types";
import type { LayoutExpose, LayoutSiderProps } from "./types";
import { computed, inject, ref, useTemplateRef, watch } from "vue";
import { useWiLocale } from "../../locale";
import { toCssLength } from "../../shared/responsive";
import WiScrollbar from "../Scrollbar/Scrollbar.vue";
import { WI_LAYOUT_KEY } from "./context";

defineOptions({ name: "WiLayoutSider" });

const props = withDefaults(defineProps<LayoutSiderProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
    width: "var(--wi-layout-sider-width)",
    collapsedWidth: "var(--wi-layout-sider-collapsed-width)",
    defaultCollapsed: false,
    collapseMode: "transform",
    showCollapsedContent: true,
    showTrigger: false,
    nativeScrollbar: true,
});

const emit = defineEmits<{
    (event: "update:collapsed", value: boolean): void;
    (event: "collapse"): void;
    (event: "expand"): void;
    (event: "after-enter"): void;
    (event: "after-leave"): void;
    (event: "scroll", eventPayload: Event): void;
}>();

const locale = useWiLocale();
const layout = inject(WI_LAYOUT_KEY, null);
const uncontrolled = ref(props.defaultCollapsed);
const scrollEl = useTemplateRef<HTMLElement>("scrollEl");
const scrollbarRef = useTemplateRef<ScrollbarInstance>("scrollbarRef");

const isControlled = computed(() => props.collapsed !== undefined);
const mergedCollapsed = computed(() =>
    isControlled.value ? Boolean(props.collapsed) : uncontrolled.value,
);

watch(
    () => props.collapsed,
    (value) => {
        if (value !== undefined) uncontrolled.value = value;
    },
);

const siderPlacement = computed(() => layout?.siderPlacement ?? "left");
const fullWidth = computed(
    () => toCssLength(props.width) ?? "var(--wi-layout-sider-width)",
);
const maxWidth = computed(() =>
    toCssLength(mergedCollapsed.value ? props.collapsedWidth : props.width),
);

const triggerKind = computed(() => {
    const value = props.showTrigger;
    if (!value) return null;
    if (value === "bar" || value === true) return "bar" as const;
    return "arrow-circle" as const;
});

const showContent = computed(
    () => !mergedCollapsed.value || props.showCollapsedContent,
);

const rootClass = computed(() => [
    "wi-layout-sider",
    `wi-layout-sider--${props.position}-positioned`,
    `wi-layout-sider--${siderPlacement.value}-placement`,
    `wi-layout-sider--collapse-${props.collapseMode}`,
    {
        "wi-layout-sider--bordered": props.bordered,
        "wi-layout-sider--inverted": props.inverted,
        "wi-layout-sider--collapsed": mergedCollapsed.value,
        "wi-layout-sider--show-content": showContent.value,
        "wi-layout-sider--custom-scrollbar": !props.nativeScrollbar,
    },
]);

const rootStyle = computed(() => ({
    width: fullWidth.value,
    maxWidth: maxWidth.value,
    padding:
        props.padding == null
            ? "var(--wi-layout-padding, 0)"
            : toCssLength(props.padding),
    borderRadius:
        props.radius == null
            ? "var(--wi-layout-radius, 0)"
            : toCssLength(props.radius),
}));

const scrollStyle = computed((): StyleValue => {
    const base = props.contentStyle;
    if (props.collapseMode !== "transform") return base;
    return [base, { minWidth: fullWidth.value }];
});

const scrollClass = computed(() => [
    "wi-layout-sider__scroll",
    props.contentClass,
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

const triggerClass = computed(() =>
    mergedCollapsed.value ? props.collapsedTriggerClass : props.triggerClass,
);

const triggerStyle = computed(() =>
    mergedCollapsed.value ? props.collapsedTriggerStyle : props.triggerStyle,
);

function toggle() {
    const next = !mergedCollapsed.value;
    uncontrolled.value = next;
    emit("update:collapsed", next);
    if (next) emit("collapse");
    else emit("expand");
}

function onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName !== "max-width") return;
    if (mergedCollapsed.value) emit("after-leave");
    else emit("after-enter");
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

defineExpose<LayoutExpose>({ scrollTo });
</script>

<template>
    <aside
        :class="rootClass"
        :style="rootStyle"
        @transitionend="onTransitionEnd"
    >
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
            class="wi-layout-sider__scrollbar"
            height="100%"
            v-bind="scrollbarProps"
            :view-class="scrollbarViewClass"
            :view-style="scrollbarViewStyle"
            @scroll="onScrollbarScroll"
        >
            <slot />
        </WiScrollbar>

        <button
            v-if="triggerKind"
            type="button"
            class="wi-layout-sider__trigger"
            :class="[
                triggerClass,
                {
                    'wi-layout-sider__trigger--bar': triggerKind === 'bar',
                    'wi-layout-sider__trigger--arrow-circle':
                        triggerKind === 'arrow-circle',
                },
            ]"
            :style="triggerStyle"
            :aria-expanded="!mergedCollapsed"
            :aria-label="mergedCollapsed ? locale.expand : locale.collapse"
            @click="toggle"
        >
            <span
                v-if="triggerKind === 'arrow-circle'"
                class="wi-layout-sider__arrow"
                aria-hidden="true"
            >
                ›
            </span>
            <span v-else class="wi-layout-sider__bar" aria-hidden="true">
                <i class="wi-layout-sider__bar-top" />
                <i class="wi-layout-sider__bar-bottom" />
            </span>
        </button>

        <div
            v-if="bordered"
            class="wi-layout-sider__border"
            aria-hidden="true"
        />
    </aside>
</template>
