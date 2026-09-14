<script setup lang="ts">
import type { CSSProperties } from "vue";
import { ref } from "vue";
import MScrollbar from "../components/Scrollbar/Scrollbar.vue";
import type {
    ScrollbarClassValue,
    ScrollbarInstance,
    ScrollbarScrollPayload,
} from "../components/Scrollbar/types";

defineOptions({ inheritAttrs: false, name: "MScrollBody" });

withDefaults(
    defineProps<{
        rootClass?: string;
        wrapClass?: ScrollbarClassValue;
        wrapStyle?: string | CSSProperties;
        viewClass?: ScrollbarClassValue;
        viewStyle?: string | CSSProperties;
        tabindex?: number | string;
        noresize?: boolean;
        role?: string;
        ariaLabel?: string;
    }>(),
    {
        noresize: true,
    },
);

const emit = defineEmits<{
    (event: "scroll", payload: ScrollbarScrollPayload): void;
}>();

const scrollbarRef = ref<ScrollbarInstance>();

defineExpose({
    get wrapRef() {
        return scrollbarRef.value?.wrapRef;
    },
    update: () => scrollbarRef.value?.update(),
    scrollTo: (...args: Parameters<NonNullable<ScrollbarInstance["scrollTo"]>>) =>
        scrollbarRef.value?.scrollTo(...args),
    setScrollTop: (value: number) => scrollbarRef.value?.setScrollTop(value),
    setScrollLeft: (value: number) => scrollbarRef.value?.setScrollLeft(value),
});
</script>

<template>
  <MScrollbar
    ref="scrollbarRef"
    :class="[rootClass, 'm-scroll-body', 'm-scrollbar--fill']"
    :wrap-class="wrapClass"
    :wrap-style="wrapStyle"
    :view-class="viewClass"
    :view-style="viewStyle"
    :tabindex="tabindex"
    :noresize="noresize"
    :role="role"
    :aria-label="ariaLabel"
    @scroll="emit('scroll', $event)"
  >
    <slot />
  </MScrollbar>
</template>
