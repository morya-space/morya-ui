import type { ComputedRef, MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import { toCssLength } from "../../../shared/responsive";

export interface LayoutRegionStyleInput {
    height?: number | string;
    heightFallback?: string;
    padding?: number | string;
    /** When false, padding is only written if `padding` is set. Default true. */
    applyDefaultPadding?: boolean;
    radius?: number | string;
}

function resolveTokenLength(
    value: number | string | undefined,
    token: string,
): string {
    if (value == null) return token;
    return toCssLength(value) ?? token;
}

export function useLayoutRegionStyle(
    input: MaybeRefOrGetter<LayoutRegionStyleInput>,
): ComputedRef<Record<string, string>> {
    return computed(() => {
        const props = toValue(input);
        const style: Record<string, string> = {
            borderRadius: resolveTokenLength(
                props.radius,
                "var(--m-layout-radius, 0)",
            ),
        };

        if (props.padding != null) {
            const padding = toCssLength(props.padding);
            if (padding) style.padding = padding;
        } else if (props.applyDefaultPadding !== false) {
            style.padding = "var(--m-layout-padding, var(--m-space-4))";
        }

        if (props.heightFallback != null) {
            style.height = resolveTokenLength(props.height, props.heightFallback);
        } else if (props.height != null) {
            const height = toCssLength(props.height);
            if (height) style.height = height;
        }

        return style;
    });
}
