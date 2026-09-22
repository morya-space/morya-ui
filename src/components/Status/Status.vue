<script setup lang="ts">
import type { IconName } from "../Icon/types";
import type { StatusProps } from "./types";
import { computed, ref, useSlots } from "vue";
import { useConfiguredSize } from "../../shared/config";
import { normalizeSeverity } from "../../shared/types";
import { usePauseOffscreen } from "../../shared/usePauseOffscreen";
import MIcon from "../Icon/Icon.vue";

const props = withDefaults(defineProps<StatusProps>(), {
    severity: "secondary",
    processing: false,
    variant: "dot",
    disabled: false,
});

const slots = useSlots();
const rootRef = ref<HTMLElement | null>(null);
const sizeClass = useConfiguredSize("Status", () => props.size);
const severityTone = computed(
    () => normalizeSeverity(props.severity) ?? "secondary",
);

/** Severity → default leading icon (skipped for neutral tones / text variant). */
const AUTO_ICONS: Partial<Record<string, IconName>> = {
    success: "check-circle",
    danger: "x-circle",
    warn: "warning",
    info: "info",
    primary: "info",
    help: "info",
};

const autoIcon = computed<IconName | undefined>(() => {
    if (props.variant === "text") return undefined;
    if (props.icon || slots.icon) return undefined;
    return AUTO_ICONS[severityTone.value];
});

const resolvedIcon = computed<IconName | undefined>(
    () => props.icon ?? autoIcon.value,
);

const showIcon = computed(
    () => Boolean(slots.icon || resolvedIcon.value),
);
const showDot = computed(
    () => props.variant !== "text" && !showIcon.value,
);

const { pauseAttrs } = usePauseOffscreen(
    rootRef,
    () => props.processing && (showDot.value || showIcon.value),
);

const rootClass = computed(() => [
    "m-status",
    `m-status--${severityTone.value}`,
    `m-status--${sizeClass.value}`,
    `m-status--${props.variant}`,
    {
        "m-status--processing":
            props.processing && (showDot.value || showIcon.value),
        "m-status--custom": Boolean(props.color),
        "m-status--disabled": props.disabled,
        "m-status--has-icon": showIcon.value,
    },
]);

const rootStyle = computed(() =>
    props.color ? { "--m-status-color": props.color } : undefined,
);
</script>

<template>
  <span ref="rootRef" v-bind="pauseAttrs" :class="rootClass" :style="rootStyle" role="status">
    <span v-if="showDot" class="m-status__dot" aria-hidden="true" />
    <span v-else-if="showIcon" class="m-status__icon" aria-hidden="true">
      <slot name="icon">
        <MIcon v-if="resolvedIcon" :name="resolvedIcon" />
      </slot>
    </span>
    <span class="m-status__label">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
