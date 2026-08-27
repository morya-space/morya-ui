import type { ComputedRef, Ref } from "vue";
import { computed, ref, watch } from "vue";

export interface LayoutSiderCollapseProps {
    collapsed?: boolean;
    defaultCollapsed: boolean;
}

export interface LayoutSiderCollapseEmit {
    (event: "update:collapsed", value: boolean): void;
    (event: "collapse"): void;
    (event: "expand"): void;
}

export function useLayoutSiderCollapse(
    props: LayoutSiderCollapseProps,
    emit: LayoutSiderCollapseEmit,
): {
    mergedCollapsed: ComputedRef<boolean>;
    toggle: () => void;
    uncontrolled: Ref<boolean>;
} {
    const uncontrolled = ref(props.defaultCollapsed);

    watch(
        () => props.collapsed,
        (value) => {
            if (value !== undefined) uncontrolled.value = value;
        },
    );

    const mergedCollapsed = computed(() =>
        props.collapsed !== undefined
            ? Boolean(props.collapsed)
            : uncontrolled.value,
    );

    function toggle() {
        const next = !mergedCollapsed.value;
        uncontrolled.value = next;
        emit("update:collapsed", next);
        if (next) emit("collapse");
        else emit("expand");
    }

    return { mergedCollapsed, toggle, uncontrolled };
}
