import type { ShallowRef } from "vue";
import type { LayoutExpose, LayoutScrollEmits } from "../types";

export function useLayoutScroll(
    scrollEl: ShallowRef<HTMLElement | null | undefined>,
    emit: LayoutScrollEmits,
): LayoutExpose & { onScroll: (event: Event) => void } {
    function scrollTo(options: ScrollToOptions): void;
    function scrollTo(x: number, y: number): void;
    function scrollTo(options: ScrollToOptions | number, y?: number): void {
        const el = scrollEl.value;
        if (!el) return;
        if (typeof options === "number") el.scrollTo(options, y ?? 0);
        else el.scrollTo(options);
    }

    function onScroll(event: Event) {
        emit("scroll", event);
    }

    return { scrollTo, onScroll };
}
