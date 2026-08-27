import type { LayoutTrigger } from "./types";

export function resolveLayoutTrigger(
    value: LayoutTrigger | undefined,
): "bar" | "arrow-circle" | null {
    if (!value) return null;
    if (value === "bar" || value === true) return "bar";
    return "arrow-circle";
}
