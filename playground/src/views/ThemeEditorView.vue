<script setup lang="ts">
import {
    MAlert,
    MButton,
    MCard,
    MInput,
    MScrollbar,
    MSwitch,
    MTag,
    createTheme,
    useDensity,
    useMotion,
    useTheme,
} from "morya-ui";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import SiteFooter from "../components/SiteFooter.vue";
import { useDocsI18n } from "../i18n";
import { copyText } from "../utils/copyText";

type AccentName = "blue" | "violet" | "green" | "orange" | "custom";
type RadiusName = "sharp" | "comfortable" | "soft";
type ExportTab = "createTheme" | "css";

const { t, lang, interpolate } = useDocsI18n();
const { isDark, setTheme } = useTheme();
const { preference: density, setDensity } = useDensity();
const { preference: motionPreference, setMotion } = useMotion();

const accent = ref<AccentName>("blue");
const customPrimary = ref("#1677ff");
const radius = ref<RadiusName>("comfortable");
const exportTab = ref<ExportTab>("createTheme");
const copied = ref(false);
const previewInput = ref("");
const previewSwitch = ref(true);

const accentOptions = [
    { name: "blue" as const, label: "Ocean", color: "#1677ff" },
    { name: "violet" as const, label: "Violet", color: "#7c3aed" },
    { name: "green" as const, label: "Meadow", color: "#52c41a" },
    { name: "orange" as const, label: "Ember", color: "#ea580c" },
    { name: "custom" as const, label: "Custom", color: "" },
];

const radiusValues: Record<RadiusName, number> = {
    sharp: 2,
    comfortable: 6,
    soft: 10,
};

const densityOptions = computed(() => [
    { name: "compact" as const, label: t.value.compact },
    { name: "comfortable" as const, label: t.value.comfortable },
    { name: "spacious" as const, label: t.value.spacious },
]);

const motionOptions = computed(() => [
    { name: "full" as const, label: t.value.motionFull },
    { name: "reduced" as const, label: t.value.motionReduced },
    { name: "none" as const, label: t.value.motionNone },
]);

const radiusOptions = computed(() => [
    { name: "sharp" as const, label: t.value.sharp },
    { name: "comfortable" as const, label: t.value.comfortable },
    { name: "soft" as const, label: t.value.soft },
]);

const activePrimary = computed(() => {
    if (accent.value === "custom") {
        const value = customPrimary.value.trim();
        return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#1677ff";
    }
    return (
        accentOptions.find((item) => item.name === accent.value)?.color ??
        "#1677ff"
    );
});

const derivedTheme = computed(() =>
    createTheme({
        seed: {
            colorPrimary: activePrimary.value,
            borderRadius: radiusValues[radius.value],
        },
        // Keep export / preview seed on light neutrals; page light/dark stays on useTheme.
        algorithm: isDark.value ? "dark" : undefined,
    }),
);

/** Preview only touches brand + radius so dark mode CSS is not wiped by a full :root inject. */
const EDITOR_THEME_PROPS = [
    "--m-color-primary",
    "--m-color-primary-hover",
    "--m-color-primary-active",
    "--m-color-primary-bg",
    "--m-color-focus-ring",
    "--m-radius-sm",
    "--m-radius-md",
    "--m-radius-lg",
    "--m-radius-control",
] as const;

function applyEditorTheme() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const vars = derivedTheme.value.cssVars;
    for (const prop of EDITOR_THEME_PROPS) {
        const value = vars[prop];
        if (value) root.style.setProperty(prop, value);
        else root.style.removeProperty(prop);
    }
}

function resetEditorTheme() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    for (const prop of EDITOR_THEME_PROPS) root.style.removeProperty(prop);
}

watch([derivedTheme, isDark], applyEditorTheme, { immediate: true });
onBeforeUnmount(resetEditorTheme);

const exportSnippet = computed(() => {
    const primary = activePrimary.value;
    const borderRadius = radiusValues[radius.value];
    const exportTheme = createTheme({
        seed: {
            colorPrimary: primary,
            borderRadius,
        },
    });

    if (exportTab.value === "css") {
        const vars = exportTheme.cssVars;
        const keys = [...EDITOR_THEME_PROPS];
        const lines = keys
            .filter((key) => vars[key])
            .map((key) => `  ${key}: ${vars[key]};`);
        return `:root {\n${lines.join("\n")}\n}`;
    }

    return `import { createTheme } from 'morya-ui'

const theme = createTheme({
  seed: {
    colorPrimary: '${primary}',
    borderRadius: ${borderRadius},
  },
})

// Write vars onto :root (or pass an element for scoped theming)
theme.apply()
// Or inject a <style data-m-theme> tag (needed for component overrides):
// const dispose = theme.inject()`;
});

const pageCopy = computed(() =>
    lang.value === "en-US"
        ? {
              title: "Theme editor",
              lead: "Tune seed tokens, preview components live, and export paste-ready createTheme or CSS. Session-only — nothing is written to your app.",
              controls: "Controls",
              preview: "Live preview",
              exportTitle: "Export",
              tabCreate: "createTheme",
              tabCss: "CSS variables",
              reset: "Reset presets",
              customPrimary: "Custom primary",
              docsTheme: "Theme guide",
              docsTokens: "Design tokens",
              docsDesign: "Design language",
              samplePrimary: "Primary",
              sampleSecondary: "Secondary",
              sampleDanger: "Danger",
              sampleInput: "Preview input…",
              sampleTag: "Token driven",
              sampleAlert:
                  "Alerts, buttons, and fields share the same --m-* seeds.",
              sampleSwitch: "Enable notifications",
          }
        : {
              title: "主题编辑器",
              lead: "调整 seed 令牌、实时预览组件，并导出可粘贴的 createTheme 或 CSS。仅作用于当前会话，不会写入你的项目。",
              controls: "控制",
              preview: "实时预览",
              exportTitle: "导出",
              tabCreate: "createTheme",
              tabCss: "CSS 变量",
              reset: "重置预设",
              customPrimary: "自定义主色",
              docsTheme: "主题指南",
              docsTokens: "设计令牌",
              docsDesign: "设计语言",
              samplePrimary: "主按钮",
              sampleSecondary: "次要",
              sampleDanger: "危险",
              sampleInput: "预览输入…",
              sampleTag: "令牌驱动",
              sampleAlert: "提示、按钮与表单字段共享同一套 --m-* seed。",
              sampleSwitch: "开启通知",
          },
);

function resetPresets() {
    accent.value = "blue";
    customPrimary.value = "#1677ff";
    radius.value = "comfortable";
    setDensity("comfortable");
    setMotion("full");
    setTheme("light");
}

async function copyExport() {
    const ok = await copyText(exportSnippet.value);
    if (!ok) return;
    copied.value = true;
    window.setTimeout(() => {
        copied.value = false;
    }, 1600);
}
</script>

<template>
    <MScrollbar class="theme-editor-scroll">
        <div class="theme-editor-page">
            <header class="theme-editor-hero">
                <p class="theme-editor-kicker">{{ t.themeEditor }}</p>
                <h1>{{ pageCopy.title }}</h1>
                <p class="theme-editor-lead">{{ pageCopy.lead }}</p>
                <div class="theme-editor-links">
                    <RouterLink
                        :to="{ name: 'docs', params: { slug: 'theme' } }"
                    >
                        {{ pageCopy.docsTheme }}
                    </RouterLink>
                    <RouterLink
                        :to="{
                            name: 'docs',
                            params: { slug: 'design-tokens' },
                        }"
                    >
                        {{ pageCopy.docsTokens }}
                    </RouterLink>
                    <RouterLink
                        :to="{ name: 'docs', params: { slug: 'design' } }"
                    >
                        {{ pageCopy.docsDesign }}
                    </RouterLink>
                </div>
            </header>

            <div class="theme-editor-grid">
                <MCard class="theme-editor-panel" :title="pageCopy.controls">
                    <div class="theme-editor-panel__body">
                        <div class="setting-group">
                            <span class="setting-label">{{ t.themeMode }}</span>
                            <div
                                class="segmented-control"
                                role="group"
                                :aria-label="t.themeMode"
                            >
                                <button
                                    type="button"
                                    :class="{ 'is-selected': !isDark }"
                                    @click="setTheme('light')"
                                >
                                    {{ t.light }}
                                </button>
                                <button
                                    type="button"
                                    :class="{ 'is-selected': isDark }"
                                    @click="setTheme('dark')"
                                >
                                    {{ t.dark }}
                                </button>
                            </div>
                        </div>

                        <div class="setting-group">
                            <span class="setting-label">{{
                                t.brandColor
                            }}</span>
                            <div
                                class="swatch-row"
                                role="group"
                                :aria-label="t.brandColor"
                            >
                                <button
                                    v-for="option in accentOptions"
                                    :key="option.name"
                                    type="button"
                                    class="swatch"
                                    :class="{
                                        'is-selected': accent === option.name,
                                        'is-custom': option.name === 'custom',
                                    }"
                                    :style="
                                        option.color
                                            ? { '--swatch-color': option.color }
                                            : undefined
                                    "
                                    :aria-label="
                                        interpolate(t.useAccent, {
                                            label: option.label,
                                        })
                                    "
                                    @click="accent = option.name"
                                >
                                    <span v-if="option.name === 'custom'"
                                        >+</span
                                    >
                                </button>
                            </div>
                            <label
                                v-if="accent === 'custom'"
                                class="custom-primary"
                            >
                                <span>{{ pageCopy.customPrimary }}</span>
                                <input
                                    v-model="customPrimary"
                                    type="color"
                                    :aria-label="pageCopy.customPrimary"
                                />
                                <input
                                    v-model="customPrimary"
                                    class="custom-primary__text"
                                    type="text"
                                    spellcheck="false"
                                    maxlength="7"
                                />
                            </label>
                        </div>

                        <div class="setting-group">
                            <span class="setting-label">{{ t.radius }}</span>
                            <div
                                class="segmented-control segmented-control--triple"
                                role="group"
                                :aria-label="t.radius"
                            >
                                <button
                                    v-for="option in radiusOptions"
                                    :key="option.name"
                                    type="button"
                                    :class="{
                                        'is-selected': radius === option.name,
                                    }"
                                    @click="radius = option.name"
                                >
                                    {{ option.label }}
                                </button>
                            </div>
                        </div>

                        <div class="setting-group">
                            <span class="setting-label">{{ t.density }}</span>
                            <div
                                class="segmented-control segmented-control--triple"
                                role="group"
                                :aria-label="t.density"
                            >
                                <button
                                    v-for="option in densityOptions"
                                    :key="option.name"
                                    type="button"
                                    :class="{
                                        'is-selected': density === option.name,
                                    }"
                                    @click="setDensity(option.name)"
                                >
                                    {{ option.label }}
                                </button>
                            </div>
                        </div>

                        <div class="setting-group">
                            <span class="setting-label">{{ t.motion }}</span>
                            <div
                                class="segmented-control segmented-control--triple"
                                role="group"
                                :aria-label="t.motion"
                            >
                                <button
                                    v-for="option in motionOptions"
                                    :key="option.name"
                                    type="button"
                                    :class="{
                                        'is-selected':
                                            motionPreference === option.name,
                                    }"
                                    @click="setMotion(option.name)"
                                >
                                    {{ option.label }}
                                </button>
                            </div>
                        </div>

                        <MButton :label="pageCopy.reset" @click="resetPresets" block/>
                    </div>
                </MCard>

                <MCard
                    class="theme-editor-panel theme-editor-panel--preview"
                    :title="pageCopy.preview"
                >
                    <div class="theme-editor-preview">
                        <div class="theme-editor-preview__row">
                            <MButton type="primary" :label="pageCopy.samplePrimary" />
                            <MButton :label="pageCopy.sampleSecondary" />
                            <MButton type="primary" danger :label="pageCopy.sampleDanger" />
                        </div>
                        <div class="theme-editor-preview__row">
                            <MInput
                                v-model="previewInput"
                                :placeholder="pageCopy.sampleInput"
                                style="min-width: 12rem; flex: 1"
                            />
                            <MTag :value="pageCopy.sampleTag" />
                        </div>
                        <MSwitch
                            v-model="previewSwitch"
                            :label="pageCopy.sampleSwitch"
                        />
                        <MAlert :title="pageCopy.sampleAlert" type="info" />
                    </div>
                </MCard>

                <MCard
                    class="theme-editor-panel theme-editor-panel--export"
                    :title="pageCopy.exportTitle"
                >
                    <div class="theme-editor-export">
                        <div
                            class="segmented-control"
                            role="tablist"
                            :aria-label="pageCopy.exportTitle"
                        >
                            <button
                                type="button"
                                role="tab"
                                :aria-selected="exportTab === 'createTheme'"
                                :class="{
                                    'is-selected': exportTab === 'createTheme',
                                }"
                                @click="exportTab = 'createTheme'"
                            >
                                {{ pageCopy.tabCreate }}
                            </button>
                            <button
                                type="button"
                                role="tab"
                                :aria-selected="exportTab === 'css'"
                                :class="{ 'is-selected': exportTab === 'css' }"
                                @click="exportTab = 'css'"
                            >
                                {{ pageCopy.tabCss }}
                            </button>
                        </div>
                        <div class="theme-editor-export__toolbar">
                            <button
                                type="button"
                                class="theme-editor-export__copy"
                                @click="copyExport"
                            >
                                {{ copied ? t.copied : t.copy }}
                            </button>
                        </div>
                        <pre
                            class="theme-editor-export__code"
                        ><code>{{ exportSnippet }}</code></pre>
                    </div>
                </MCard>
            </div>

            <SiteFooter />
        </div>
    </MScrollbar>
</template>

<style scoped>
.theme-editor-scroll {
    flex: 1;
    min-height: 0;
}

.theme-editor-page {
    margin: 0 auto;
    max-width: 72rem;
    padding: clamp(1.5rem, 4vw, 2.75rem) clamp(1rem, 3vw, 2rem) 2rem;
    width: 100%;
}

.theme-editor-hero {
    margin-bottom: 1.5rem;
}

.theme-editor-kicker {
    color: var(--m-color-primary);
    font-family: var(--docs-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    margin: 0 0 0.45rem;
    text-transform: uppercase;
}

.theme-editor-hero h1 {
    font-family: var(--docs-display);
    font-size: clamp(1.7rem, 3vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 0.55rem;
}

.theme-editor-lead {
    color: var(--m-color-text-muted);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 0.85rem;
    max-width: 48rem;
}

.theme-editor-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
}

.theme-editor-links a {
    color: var(--m-color-primary);
    font-size: 0.84rem;
    font-weight: 600;
    text-decoration: none;
}

.theme-editor-links a:hover {
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

.theme-editor-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(16rem, 20rem) minmax(0, 1fr);
}

.theme-editor-panel--export {
    grid-column: 1 / -1;
}

.theme-editor-panel__body,
.theme-editor-preview,
.theme-editor-export {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.theme-editor-preview__row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}

.setting-label {
    color: var(--m-color-text-muted);
    font-size: 0.75rem;
    font-weight: 600;
}

.segmented-control {
    background: color-mix(
        in srgb,
        var(--m-color-text) 5%,
        var(--m-color-surface)
    );
    border: 1px solid var(--docs-edge);
    border-radius: 999px;
    display: inline-flex;
    padding: 0.18rem;
    width: fit-content;
}

.segmented-control--triple {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
}

.segmented-control button {
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: var(--m-color-text-muted);
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.4rem 0.75rem;
}

.segmented-control button.is-selected {
    background: var(--m-color-surface);
    box-shadow: var(--m-shadow-sm);
    color: var(--m-color-primary);
}

.swatch-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
}

.swatch {
    background: var(--swatch-color, transparent);
    border: 2px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    height: 1.7rem;
    width: 1.7rem;
}

.swatch.is-custom {
    align-items: center;
    background: color-mix(
        in srgb,
        var(--m-color-text) 6%,
        var(--m-color-surface)
    );
    border-color: var(--docs-edge);
    color: var(--m-color-text-muted);
    display: inline-flex;
    font-size: 0.95rem;
    justify-content: center;
}

.swatch.is-selected {
    border-color: var(--m-color-text);
    box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--m-color-primary) 28%, transparent);
}

.custom-primary {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.78rem;
}

.custom-primary__text {
    background: var(--m-color-surface);
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-sm);
    color: var(--m-color-text);
    font-family: var(--docs-mono);
    font-size: 0.78rem;
    padding: 0.35rem 0.5rem;
    width: 7.5rem;
}

.theme-editor-export__toolbar {
    display: flex;
    justify-content: flex-end;
}

.theme-editor-export__copy {
    background: transparent;
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-sm);
    color: var(--m-color-text-muted);
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0.3rem 0.65rem;
}

.theme-editor-export__copy:hover {
    border-color: color-mix(
        in srgb,
        var(--m-color-primary) 40%,
        var(--m-color-border)
    );
    color: var(--m-color-primary);
}

.theme-editor-export__code {
    background: color-mix(
        in srgb,
        var(--m-color-text) 6%,
        var(--m-color-surface)
    );
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-md);
    font-family: var(--docs-mono);
    font-size: 0.78rem;
    line-height: 1.55;
    margin: 0;
    overflow: auto;
    padding: 0.9rem 1rem;
    white-space: pre;
}

@media (max-width: 900px) {
    .theme-editor-grid {
        grid-template-columns: 1fr;
    }
}
</style>
