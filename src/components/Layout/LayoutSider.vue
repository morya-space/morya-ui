<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import type { LayoutExpose, LayoutSiderProps } from "./types";
import { computed, inject, useTemplateRef } from "vue";
import { useWiLocale } from "../../locale";
import WiIcon from "../Icon/Icon.vue";
import { toCssLength } from "../../shared/responsive";
import { useLayoutScroll } from "./composables/useLayoutScroll";
import { useLayoutSiderCollapse } from "./composables/useLayoutSiderCollapse";
import { WI_LAYOUT_KEY } from "./context";
import { resolveLayoutTrigger } from "./utils";

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
const scrollEl = useTemplateRef<HTMLElement>("scrollEl");
const { scrollTo, onScroll } = useLayoutScroll(scrollEl, emit);
const { mergedCollapsed, toggle } = useLayoutSiderCollapse(props, emit);

const siderPlacement = computed(() => layout?.siderPlacement ?? "left");
const expandedWidth = computed(
    () => toCssLength(props.width) ?? "var(--wi-layout-sider-width)",
);
const collapsedWidth = computed(
    () =>
        toCssLength(props.collapsedWidth) ??
        "var(--wi-layout-sider-collapsed-width)",
);
const layoutWidth = computed(() =>
    mergedCollapsed.value ? collapsedWidth.value : expandedWidth.value,
);

const triggerKind = computed(() => resolveLayoutTrigger(props.showTrigger));

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
    },
]);

const rootStyle = computed(() => {
    const isWidthMode = props.collapseMode === "width";

    return {
        "--wi-layout-sider-width": expandedWidth.value,
        "--wi-layout-sider-collapsed-width": collapsedWidth.value,
        width: isWidthMode ? layoutWidth.value : expandedWidth.value,
        maxWidth: layoutWidth.value,
        minWidth: "0",
        borderRadius:
            props.radius == null
                ? "var(--wi-layout-radius, 0)"
                : toCssLength(props.radius),
    };
});

const siderPadding = computed(() =>
    props.padding == null
        ? "var(--wi-layout-padding, var(--wi-space-4))"
        : toCssLength(props.padding),
);

const scrollStyle = computed((): StyleValue => {
    const regionStyle: CSSProperties = {
        padding: siderPadding.value,
    };

    return props.contentStyle == null
        ? regionStyle
        : [regionStyle, props.contentStyle];
});

const scrollClass = computed(() => [
    "wi-layout-sider__scroll",
    props.contentClass,
]);

const triggerClass = computed(() =>
    mergedCollapsed.value ? props.collapsedTriggerClass : props.triggerClass,
);

const triggerStyle = computed(() =>
    mergedCollapsed.value ? props.collapsedTriggerStyle : props.triggerStyle,
);

function onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName !== "max-width") return;
    if (mergedCollapsed.value) emit("after-leave");
    else emit("after-enter");
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
      ref="scrollEl"
      :class="scrollClass"
      :style="scrollStyle"
      @scroll="onScroll"
    >
      <slot />
    </div>

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
        <WiIcon name="chevron-right" size="sm" />
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
