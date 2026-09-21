<script setup lang="ts">
import type { LayoutSiderProps } from "./types";
import { computed, inject, useAttrs } from "vue";
import { useMLocale } from "../../locale";
import { isSelfReferencingCssVar, toCssLength } from "../../shared/responsive";
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from "../Icon/Icon.vue";
import { useLayoutSiderCollapse } from "./composables/useLayoutSiderCollapse";
import { M_LAYOUT_KEY } from "./context";
import { resolveLayoutTrigger } from "./utils";

defineOptions({ name: "MLayoutSider", inheritAttrs: false });

const props = withDefaults(defineProps<LayoutSiderProps>(), {
    bordered: false,
    inverted: false,
    position: "static",
    defaultCollapsed: false,
    collapseMode: "transform",
    showCollapsedContent: true,
    showTrigger: false,
})
const emit = defineEmits<{
    (event: "update:collapsed", value: boolean): void;
    (event: "collapse"): void;
    (event: "expand"): void;
    (event: "after-enter"): void;
    (event: "after-leave"): void;
}>();
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const locale = useMLocale();
const layout = inject(M_LAYOUT_KEY, null);
const { mergedCollapsed, toggle } = useLayoutSiderCollapse(props, emit);

const siderPlacement = computed(() => layout?.siderPlacement ?? "left");

/** Explicit prop values only — defaults live in `.m-layout-sider` CSS. */
const expandedWidth = computed(() => toCssLength(props.width));
const collapsedWidth = computed(() => toCssLength(props.collapsedWidth));

const effectiveExpandedWidth = computed(
    () => expandedWidth.value ?? "var(--m-layout-sider-width)",
);
const effectiveCollapsedWidth = computed(
    () => collapsedWidth.value ?? "var(--m-layout-sider-collapsed-width)",
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
    "m-layout-sider",
    `m-layout-sider--${props.position}-positioned`,
    `m-layout-sider--${siderPlacement.value}-placement`,
    `m-layout-sider--collapse-${props.collapseMode}`,
    {
        "m-layout-sider--bordered": props.bordered,
        "m-layout-sider--inverted": props.inverted,
        "m-layout-sider--collapsed": mergedCollapsed.value,
        "m-layout-sider--show-content": showContent.value,
    },
]);

const rootStyle = computed(() => {
    const isWidthMode = props.collapseMode === "width";
    const style: Record<string, string> = {
        minWidth: "0",
        borderRadius:
            props.radius == null
                ? "var(--m-layout-radius, 0)"
                : toCssLength(props.radius)!,
        width: isWidthMode ? layoutWidth.value : effectiveExpandedWidth.value,
        maxWidth: layoutWidth.value,
    };

    if (props.padding != null) {
        const padding = toCssLength(props.padding);
        if (padding) style.padding = padding;
    }

    if (
        expandedWidth.value &&
        !isSelfReferencingCssVar(
            expandedWidth.value,
            "--m-layout-sider-width",
        )
    ) {
        style["--m-layout-sider-width"] = expandedWidth.value;
    }
    if (
        collapsedWidth.value &&
        !isSelfReferencingCssVar(
            collapsedWidth.value,
            "--m-layout-sider-collapsed-width",
        )
    ) {
        style["--m-layout-sider-collapsed-width"] = collapsedWidth.value;
    }

    return style;
});

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
</script>

<template>
  <aside
    v-bind="rootAttrs"
    :class="rootClass"
    :style="rootStyle"
    @transitionend="onTransitionEnd"
  >
    <slot />

    <button
      v-if="triggerKind"
      type="button"
      class="m-layout-sider__trigger"
      :class="[
        triggerClass,
        {
          'm-layout-sider__trigger--bar': triggerKind === 'bar',
          'm-layout-sider__trigger--arrow-circle':
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
        class="m-layout-sider__arrow"
        aria-hidden="true"
      >
        <MIcon name="chevron-right" size="sm" />
      </span>
      <span v-else class="m-layout-sider__bar" aria-hidden="true">
        <i class="m-layout-sider__bar-top" />
        <i class="m-layout-sider__bar-bottom" />
      </span>
    </button>

    <div
      v-if="bordered"
      class="m-layout-sider__border"
      aria-hidden="true"
    />
  </aside>
</template>
