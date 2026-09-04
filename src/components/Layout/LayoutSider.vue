<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import type { LayoutExpose, LayoutSiderProps } from "./types";
import { computed, inject, ref } from "vue";
import { useWdLocale } from "../../locale";
import { isSelfReferencingCssVar, toCssLength } from "../../shared/responsive";
import WdIcon from "../Icon/Icon.vue";
import { useLayoutScroll } from "./composables/useLayoutScroll";
import { useLayoutSiderCollapse } from "./composables/useLayoutSiderCollapse";
import { WD_LAYOUT_KEY } from "./context";
import { resolveLayoutTrigger } from "./utils";

defineOptions({ name: "WdLayoutSider" });

const props = withDefaults(defineProps<LayoutSiderProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
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

const locale = useWdLocale();
const layout = inject(WD_LAYOUT_KEY, null);
const scrollEl = ref<HTMLElement | null>(null);
const { scrollTo, onScroll } = useLayoutScroll(scrollEl, emit);
const { mergedCollapsed, toggle } = useLayoutSiderCollapse(props, emit);

const siderPlacement = computed(() => layout?.siderPlacement ?? "left");

/** Explicit prop values only — defaults live in `.wd-layout-sider` CSS. */
const expandedWidth = computed(() => toCssLength(props.width));
const collapsedWidth = computed(() => toCssLength(props.collapsedWidth));

const effectiveExpandedWidth = computed(
    () => expandedWidth.value ?? "var(--wd-layout-sider-width)",
);
const effectiveCollapsedWidth = computed(
    () => collapsedWidth.value ?? "var(--wd-layout-sider-collapsed-width)",
);

const layoutWidth = computed(() =>
    mergedCollapsed.value
        ? effectiveCollapsedWidth.value
        : effectiveExpandedWidth.value,
);

const triggerKind = computed(() => resolveLayoutTrigger(props.showTrigger));

const showContent = computed(
    () => !mergedCollapsed.value || props.showCollapsedContent,
);

const rootClass = computed(() => [
    "wd-layout-sider",
    `wd-layout-sider--${props.position}-positioned`,
    `wd-layout-sider--${siderPlacement.value}-placement`,
    `wd-layout-sider--collapse-${props.collapseMode}`,
    {
        "wd-layout-sider--bordered": props.bordered,
        "wd-layout-sider--inverted": props.inverted,
        "wd-layout-sider--collapsed": mergedCollapsed.value,
        "wd-layout-sider--show-content": showContent.value,
    },
]);

const rootStyle = computed(() => {
    const isWidthMode = props.collapseMode === "width";
    const style: Record<string, string> = {
        minWidth: "0",
        borderRadius:
            props.radius == null
                ? "var(--wd-layout-radius, 0)"
                : toCssLength(props.radius)!,
        width: isWidthMode ? layoutWidth.value : effectiveExpandedWidth.value,
        maxWidth: layoutWidth.value,
    };

    if (
        expandedWidth.value &&
        !isSelfReferencingCssVar(
            expandedWidth.value,
            "--wd-layout-sider-width",
        )
    ) {
        style["--wd-layout-sider-width"] = expandedWidth.value;
    }
    if (
        collapsedWidth.value &&
        !isSelfReferencingCssVar(
            collapsedWidth.value,
            "--wd-layout-sider-collapsed-width",
        )
    ) {
        style["--wd-layout-sider-collapsed-width"] = collapsedWidth.value;
    }

    return style;
});

const siderPadding = computed(() =>
    props.padding == null
        ? "var(--wd-layout-padding, var(--wd-space-4))"
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
    "wd-layout-sider__scroll",
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
      class="wd-layout-sider__trigger"
      :class="[
        triggerClass,
        {
          'wd-layout-sider__trigger--bar': triggerKind === 'bar',
          'wd-layout-sider__trigger--arrow-circle':
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
        class="wd-layout-sider__arrow"
        aria-hidden="true"
      >
        <WdIcon name="chevron-right" size="sm" />
      </span>
      <span v-else class="wd-layout-sider__bar" aria-hidden="true">
        <i class="wd-layout-sider__bar-top" />
        <i class="wd-layout-sider__bar-bottom" />
      </span>
    </button>

    <div
      v-if="bordered"
      class="wd-layout-sider__border"
      aria-hidden="true"
    />
  </aside>
</template>
