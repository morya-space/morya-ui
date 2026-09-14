<script setup lang="ts">
import type { CSSProperties, StyleValue } from "vue";
import { computed, inject, ref } from "vue";
import MScrollbar from "../Scrollbar/Scrollbar.vue";
import type { ScrollbarClassValue, ScrollbarInstance } from "../Scrollbar/types";
import LayoutScrollContext from "./LayoutScrollContext.vue";
import { M_LAYOUT_KEY } from "./context";
import { useLayoutScroll } from "./composables/useLayoutScroll";
import type { LayoutScrollEmits, LayoutExpose, LayoutSiderPlacement } from "./types";

defineOptions({ name: "MLayoutScrollRegion", inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        scrollbarRootClass?: string;
        scrollClass?: ScrollbarClassValue;
        scrollStyle?: string | CSSProperties;
        viewClass?: ScrollbarClassValue;
        viewStyle?: string | CSSProperties;
        hasSider?: boolean;
        siderPlacement?: LayoutSiderPlacement;
    }>(),
    {
        scrollbarRootClass: "m-layout__scrollbar",
        hasSider: false,
        siderPlacement: "left",
    },
);

const emit = defineEmits<LayoutScrollEmits>();

const parentLayout = inject(M_LAYOUT_KEY, null);
const contextHasSider = computed(
    () => props.hasSider || (parentLayout?.hasSider ?? false),
);
const contextSiderPlacement = computed(
    () => props.siderPlacement ?? parentLayout?.siderPlacement ?? "left",
);

const scrollbarRef = ref<ScrollbarInstance>();
const scrollTarget = computed(() => scrollbarRef.value);

const { scrollTo, onScroll } = useLayoutScroll(scrollTarget, emit);

const wrapClass = computed(() => normalizeClass(props.scrollClass));
const viewClassList = computed(() =>
    normalizeClass(["m-layout__scroll-view", props.viewClass]),
);

function onScrollbarScroll() {
    onScroll(new Event("scroll"));
}

function normalizeClass(value: ScrollbarClassValue | undefined): string[] {
    if (value == null) return [];
    if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
    if (Array.isArray(value)) {
        return value.flatMap((item) => {
            if (typeof item === "string") return item.split(/\s+/).filter(Boolean);
            if (item && typeof item === "object") {
                return Object.entries(item)
                    .filter(([, active]) => active)
                    .map(([name]) => name);
            }
            return [];
        });
    }
    return Object.entries(value)
        .filter(([, active]) => active)
        .map(([name]) => name);
}

defineExpose<LayoutExpose>({ scrollTo });
</script>

<template>
  <MScrollbar
    ref="scrollbarRef"
    :class="[scrollbarRootClass, 'm-scrollbar--fill']"
    :wrap-class="wrapClass"
    :wrap-style="scrollStyle"
    :view-class="viewClassList"
    :view-style="viewStyle"
    @scroll="onScrollbarScroll"
  >
    <LayoutScrollContext
      :has-sider="contextHasSider"
      :sider-placement="contextSiderPlacement"
    >
      <slot />
    </LayoutScrollContext>
  </MScrollbar>
</template>
