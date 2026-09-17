<script setup lang="ts">
import type { IconName } from "../Icon/types";
import type { ResultProps, ResultSize, ResultStatus } from "./types";
import { computed, useAttrs, useSlots } from "vue";
import { useMLocale } from "../../locale";
import { useRootParts } from "../../shared/useComponentAttrs";
import MIcon from "../Icon/Icon.vue";
import {
    RESULT_HTTP_ILLUSTRATIONS,
    type ResultHttpStatus,
} from "./statusIcons";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResultProps>(), {
    status: "info",
});

const attrs = useAttrs();
const slots = useSlots();
const { rootAttrs } = useRootParts(attrs, () => props.pt);
const locale = useMLocale();

const HTTP_STATUSES = new Set<string>(["403", "404", "500", "418"]);

function resolveResultSize(size?: ResultSize): "small" | "medium" | "large" | "huge" {
    if (size === "small" || size === "sm") return "small";
    if (size === "large" || size === "lg") return "large";
    if (size === "huge") return "huge";
    return "medium";
}

const sizeClass = computed(() => resolveResultSize(props.size));
const isHttpStatus = computed(() => HTTP_STATUSES.has(props.status));

const showIconSlot = computed(() => Boolean(slots.icon));
const showHttpIllustration = computed(
    () =>
        isHttpStatus.value &&
        !props.icon &&
        !showIconSlot.value,
);

const statusIcon = computed<IconName>(() => {
    if (props.icon) return props.icon;
    switch (props.status as ResultStatus) {
        case "success":
            return "check-circle";
        case "warning":
            return "warning";
        case "error":
        case "500":
            return "x-circle";
        case "403":
            return "lock";
        case "404":
            return "search";
        case "418":
            return "info";
        default:
            return "info";
    }
});

const httpIllustrationHtml = computed(() => {
    if (!showHttpIllustration.value) return undefined;
    return RESULT_HTTP_ILLUSTRATIONS[props.status as ResultHttpStatus];
});

const resolvedTitle = computed(() => {
    if (props.title != null) return props.title;
    const messages = locale.value;
    switch (props.status) {
        case "success":
            return messages.resultSuccess;
        case "warning":
            return messages.resultWarning;
        case "error":
            return messages.resultError;
        case "403":
            return messages.result403;
        case "404":
            return messages.result404;
        case "500":
            return messages.result500;
        case "418":
            return messages.result418;
        default:
            return messages.resultInfo;
    }
});

const showTitle = computed(() => Boolean(slots.title || resolvedTitle.value));
const showDescription = computed(() =>
    Boolean(slots.description || props.description),
);

const rootClass = computed(() => [
    "m-result",
    `m-result--${props.status === "warning" ? "warning" : props.status}`,
    `m-result--${sizeClass.value}`,
]);

const iconSize = computed(() => {
    switch (sizeClass.value) {
        case "small":
            return "md" as const;
        case "large":
        case "huge":
            return "lg" as const;
        default:
            return "lg" as const;
    }
});
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass" role="status">
    <div
      v-if="showHttpIllustration && httpIllustrationHtml"
      class="m-result__illustration"
      aria-hidden="true"
      v-html="httpIllustrationHtml"
    />

    <div
      v-else-if="showIconSlot || statusIcon"
      class="m-result__icon"
      aria-hidden="true"
    >
      <slot name="icon">
        <MIcon
          class="m-result__glyph"
          :name="statusIcon"
          :size="iconSize"
        />
      </slot>
    </div>

    <div v-if="showTitle" class="m-result__title">
      <slot name="title">
        {{ resolvedTitle }}
      </slot>
    </div>

    <div v-if="showDescription" class="m-result__description">
      <slot name="description">
        {{ description }}
      </slot>
    </div>

    <div v-if="slots.default" class="m-result__content">
      <slot />
    </div>

    <div v-if="slots.footer" class="m-result__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
