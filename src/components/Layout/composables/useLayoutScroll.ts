import type { ShallowRef } from "vue";
import type { ScrollbarInstance } from "../../Scrollbar/types";
import type { LayoutExpose, LayoutScrollEmits } from "../types";

type LayoutScrollTarget = HTMLElement | ScrollbarInstance | null | undefined;

function resolveScrollElement(target: LayoutScrollTarget): HTMLElement | undefined {
    if (!target) return undefined;
    if ("wrapRef" in target) return target.wrapRef;
    return target;
}

export function useLayoutScroll(
    scrollEl: ShallowRef<LayoutScrollTarget>,
    emit: LayoutScrollEmits,
): LayoutExpose & { onScroll: (event: Event) => void } {
    function scrollTo(options: ScrollToOptions): void;
    function scrollTo(x: number, y: number): void;
    function scrollTo(options: ScrollToOptions | number, y?: number): void {
        const el = resolveScrollElement(scrollEl.value);
        if (!el) return;
        if (typeof options === "number") el.scrollTo(options, y ?? 0);
        else el.scrollTo(options);
    }

    function onScroll(event: Event) {
        emit("scroll", event);
    }

    return { scrollTo, onScroll };
}
