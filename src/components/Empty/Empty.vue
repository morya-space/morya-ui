<script setup lang="ts">
import type { EmptyIllustration } from "./illustrations";
import type { EmptyProps, EmptySize } from "./types";
import { computed, ref, useAttrs, useSlots, watch } from "vue";
import { useMLocale } from "../../locale";
import { useRootParts } from "../../shared/useComponentAttrs";
import { useMId } from "../../shared/useMId";
import MIcon from "../Icon/Icon.vue";
import {
    DEFAULT_EMPTY_ICON_SVG,
    resolveIllustrationMarkup,
} from "./illustrations";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EmptyProps>(), {
    showDescription: true,
    showIcon: true,
    simple: false,
});

const attrs = useAttrs();
const slots = useSlots();
const { rootAttrs } = useRootParts(attrs, () => props.pt);
const locale = useMLocale();
const illustrationIdPrefix = useMId("m-ill");

const illustrationHtml = ref<string>();
let illustrationLoadToken = 0;

function resolveEmptySize(size?: EmptySize): "small" | "medium" | "large" {
    if (size === "small" || size === "sm") return "small";
    if (size === "large" || size === "lg") return "large";
    return "medium";
}

const sizeClass = computed(() => resolveEmptySize(props.size));

const showImage = computed(() => Boolean(slots.image || props.image));
const showIconSlot = computed(() => Boolean(slots.icon));

/** Named catalog illustration only — never auto-selected for the default path. */
const resolvedIllustration = computed<EmptyIllustration | undefined>(() => {
    if (!props.showIcon) return undefined;
    if (props.illustration) return props.illustration;
    if (showImage.value || showIconSlot.value) return undefined;
    if (props.icon === "search") return "no-result";
    return undefined;
});

watch(
    resolvedIllustration,
    (key) => {
        const token = ++illustrationLoadToken;
        if (!key) {
            illustrationHtml.value = undefined;
            return;
        }
        void resolveIllustrationMarkup(key, illustrationIdPrefix).then(
            (html) => {
                if (token === illustrationLoadToken) {
                    illustrationHtml.value = html;
                }
            },
            () => {
                if (token === illustrationLoadToken) {
                    illustrationHtml.value = undefined;
                }
            },
        );
    },
    { immediate: true },
);

const showIllustration = computed(
    () =>
        props.showIcon &&
        Boolean(resolvedIllustration.value) &&
        Boolean(illustrationHtml.value) &&
        !showImage.value &&
        !showIconSlot.value,
);

const showMutedIcon = computed(
    () =>
        props.showIcon &&
        Boolean(props.icon) &&
        props.icon !== "search" &&
        !resolvedIllustration.value &&
        !showImage.value &&
        !showIconSlot.value,
);

const showDefaultIcon = computed(
    () =>
        props.showIcon &&
        !resolvedIllustration.value &&
        !showMutedIcon.value &&
        !showImage.value &&
        !showIconSlot.value,
);

const showVisual = computed(
    () =>
        props.showIcon &&
        (showImage.value ||
            showIconSlot.value ||
            showIllustration.value ||
            showMutedIcon.value ||
            showDefaultIcon.value),
);

const resolvedDescription = computed(() => {
    if (props.description != null) return props.description;
    return locale.value.emptyMessage;
});

const hasTitleContent = computed(() => {
    if (slots.title) return true;
    return props.title != null && props.title !== "";
});

const showDescriptionBlock = computed(() => {
    if (!props.showDescription) return false;
    if (slots.default) return true;
    return Boolean(resolvedDescription.value);
});

const rootClass = computed(() => [
    "m-empty",
    `m-empty--${sizeClass.value}`,
    {
        "m-empty--simple": props.simple,
        "m-empty--default-icon": showDefaultIcon.value,
    },
]);
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass" role="status">
    <div
      v-if="showVisual"
      class="m-empty__illustration"
      aria-hidden="true"
    >
      <template v-if="showImage">
        <slot name="image">
          <img
            v-if="image"
            class="m-empty__image"
            :src="image"
            alt=""
          >
        </slot>
      </template>
      <template v-else-if="showIconSlot">
        <slot name="icon" />
      </template>
      <div
        v-else-if="showIllustration && illustrationHtml"
        class="m-empty__glyph"
        v-html="illustrationHtml"
      />
      <MIcon
        v-else-if="showMutedIcon && icon"
        class="m-empty__icon"
        :name="icon"
        size="lg"
      />
      <div
        v-else-if="showDefaultIcon"
        class="m-empty__default-icon"
        v-html="DEFAULT_EMPTY_ICON_SVG"
      />
    </div>

    <div
      v-if="hasTitleContent || showDescriptionBlock"
      class="m-empty__body"
    >
      <div v-if="hasTitleContent" class="m-empty__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <div v-if="showDescriptionBlock" class="m-empty__description">
        <slot>
          {{ resolvedDescription }}
        </slot>
      </div>
    </div>

    <div v-if="slots.extra" class="m-empty__extra">
      <slot name="extra" />
    </div>
  </div>
</template>
