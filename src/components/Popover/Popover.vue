<script setup lang="ts">
import type { PopoverProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdId } from '../../shared/useWdId'
import { useWdConfig } from "../../shared/config";
import {
    isOverlayTeleported,
    resolveOverlayTeleport,
} from "../../shared/overlay";
import { computeFloatingOverlayStyle } from "../../shared/overlayPlacement";

const props = withDefaults(defineProps<PopoverProps>(), {
    modelValue: false,
    disabled: false,
    placement: "bottom",
    trigger: "manual",
    showDelay: 0,
    hideDelay: 200,
    teleport: true,
});
const emit = defineEmits<{
    (event: "update:modelValue", value: boolean): void;
    (event: "show"): void;
    (event: "hide"): void;
}>();

const config = useWdConfig()
const panelId = useWdId()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const panelStyle = ref<Record<string, string>>({});
const teleportTarget = computed(() =>
    resolveOverlayTeleport(props, config.value.appendTo),
);
const teleported = computed(() =>
    isOverlayTeleported(props, config.value.appendTo),
);
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function setOpen(open: boolean) {
    if (open && props.disabled) return;
    emit("update:modelValue", open);
}

function show() {
    setOpen(true);
}

function hide() {
    setOpen(false);
}

function toggle() {
    setOpen(!props.modelValue);
}

function close() {
    setOpen(false);
}

defineExpose({ show, hide, toggle });

function clearHoverTimers() {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    showTimer = undefined;
    hideTimer = undefined;
}

function onTriggerClick() {
    if (props.disabled || props.trigger !== "click") return;
    setOpen(!props.modelValue);
}

function onTriggerEnter() {
    if (props.disabled || props.trigger !== "hover") return;
    clearHoverTimers();
    if (props.showDelay > 0) {
        showTimer = setTimeout(setOpen, props.showDelay, true);
        return;
    }
    setOpen(true);
}

function onTriggerLeave() {
    if (props.trigger !== "hover") return;
    clearHoverTimers();
    if (props.hideDelay > 0) {
        hideTimer = setTimeout(setOpen, props.hideDelay, false);
        return;
    }
    setOpen(false);
}

function onPanelEnter() {
    if (props.trigger !== "hover") return;
    clearHoverTimers();
}

function onPanelLeave() {
    if (props.trigger !== "hover") return;
    clearHoverTimers();
    if (props.hideDelay > 0) {
        hideTimer = setTimeout(setOpen, props.hideDelay, false);
        return;
    }
    setOpen(false);
}

function onTriggerFocus() {
    if (props.disabled || props.trigger !== "focus") return;
    clearHoverTimers();
    if (props.showDelay > 0) {
        showTimer = setTimeout(setOpen, props.showDelay, true);
        return;
    }
    setOpen(true);
}

function onTriggerBlur() {
    if (props.trigger !== "focus") return;
    clearHoverTimers();
    if (props.hideDelay > 0) {
        hideTimer = setTimeout(setOpen, props.hideDelay, false);
        return;
    }
    setOpen(false);
}

function updatePanelPosition() {
    if (!teleported.value || !trigger.value) return;
    panelStyle.value = computeFloatingOverlayStyle(
        trigger.value.getBoundingClientRect(),
        props.placement,
    );
}

function onDocumentClick(event: MouseEvent) {
    const target = event.target as Node;
    if (root.value?.contains(target) || panel.value?.contains(target)) return;
    close();
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") close();
}

function onViewportChange() {
    if (props.modelValue) updatePanelPosition();
}

watch(
    () => props.modelValue,
    async (open, previousOpen) => {
        if (open) {
            document.addEventListener("click", onDocumentClick);
            document.addEventListener("keydown", onKeydown);
            if (teleported.value) {
                window.addEventListener("resize", onViewportChange);
                window.addEventListener("scroll", onViewportChange, true);
            }
            emit("show");
            await nextTick();
            updatePanelPosition();
        } else {
            document.removeEventListener("click", onDocumentClick);
            document.removeEventListener("keydown", onKeydown);
            window.removeEventListener("resize", onViewportChange);
            window.removeEventListener("scroll", onViewportChange, true);
            if (previousOpen) emit("hide");
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    clearHoverTimers();
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onViewportChange);
    window.removeEventListener("scroll", onViewportChange, true);
});
</script>

<template>
    <span
        ref="root"
        class="wd-popover"
        @mouseenter="onTriggerEnter"
        @mouseleave="onTriggerLeave"
    >
        <span
            ref="trigger"
            class="wd-popover__trigger"
            aria-haspopup="dialog"
            :aria-expanded="modelValue"
            :aria-controls="panelId"
            @click="onTriggerClick"
            @focusin="onTriggerFocus"
            @focusout="onTriggerBlur"
        >
            <slot />
        </span>
        <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
            <Transition name="wd-popover">
                <div
                    v-if="modelValue"
                    ref="panel"
                    :id="panelId"
                    class="wd-popover__content"
                    :class="[
                        `wd-popover__content--${placement}`,
                        { 'wd-popover__content--teleported': teleported },
                    ]"
                    :style="teleported ? panelStyle : undefined"
                    role="dialog"
                    @mouseenter="onPanelEnter"
                    @mouseleave="onPanelLeave"
                >
                    <slot name="content" />
                </div>
            </Transition>
        </Teleport>
    </span>
</template>
