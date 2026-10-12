<script setup lang="ts">
import { MButton, MInput, MScrollbar, MTag, useTheme } from "morya-ui";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import SiteFooter from "../components/SiteFooter.vue";
import {
    SITE_GITHUB_URL,
    SITE_INSTALL_CMD,
    SITE_LOGO_URL,
    SITE_NAME,
    SITE_NPM_URL,
} from "../config/site";
import { listDocumentedComponents } from "../docs/loadComponentDocs";
import { useDocsI18n } from "../i18n";
import { copyText } from "../utils/copyText";

const { t, lang, interpolate } = useDocsI18n();
const { isDark, setTheme } = useTheme();
const copied = ref(false);
const previewAccent = ref<"blue" | "violet" | "green" | "orange">("blue");
const previewInput = ref("");

const accentOptions = [
    {
        name: "blue" as const,
        label: "Ocean",
        color: "#1677ff",
        hover: "#4096ff",
    },
    {
        name: "violet" as const,
        label: "Violet",
        color: "#7c3aed",
        hover: "#6d28d9",
    },
    {
        name: "green" as const,
        label: "Meadow",
        color: "#52c41a",
        hover: "#73d13d",
    },
    {
        name: "orange" as const,
        label: "Ember",
        color: "#ea580c",
        hover: "#c2410c",
    },
];

const HOME_THEME_PROPS = [
    "--m-color-primary",
    "--m-color-primary-hover",
    "--m-color-focus-ring",
] as const;

function applyHomeTheme() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const selected =
        accentOptions.find((item) => item.name === previewAccent.value) ??
        accentOptions[0];
    root.style.setProperty("--m-color-primary", selected.color);
    root.style.setProperty("--m-color-primary-hover", selected.hover);
    root.style.setProperty("--m-color-focus-ring", selected.color);
}

function resetHomeTheme() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    for (const prop of HOME_THEME_PROPS) root.style.removeProperty(prop);
}

watch(previewAccent, applyHomeTheme, { immediate: true });
onBeforeUnmount(resetHomeTheme);

const pillars = computed(() => [
    {
        title: t.value.pillarCompleteTitle,
        body: t.value.pillarCompleteBody,
    },
    {
        title: t.value.pillarThemeTitle,
        body: t.value.pillarThemeBody,
    },
    {
        title: t.value.pillarTypeScriptTitle,
        body: t.value.pillarTypeScriptBody,
    },
    {
        title: t.value.pillarDocsTitle,
        body: t.value.pillarDocsBody,
    },
]);

const wallItems = computed(() => {
    const preferred = [
        "Button",
        "Input",
        "Select",
        "Table",
        "Dialog",
        "Form",
        "Tabs",
        "DatePicker",
    ];
    const all = listDocumentedComponents(lang.value);
    const picked = preferred
        .map((name) => all.find((item) => item.name === name))
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
    if (picked.length >= 6) return picked.slice(0, 8);
    return all.slice(0, 8);
});

async function copyInstall() {
    const ok = await copyText(SITE_INSTALL_CMD);
    if (!ok) return;
    copied.value = true;
    window.setTimeout(() => {
        copied.value = false;
    }, 1600);
}
</script>

<template>
  <MScrollbar class="home-scroll">
    <div class="home-page">
      <section class="home-hero">
        <img
          class="home-logo"
          :src="SITE_LOGO_URL"
          width="96"
          height="96"
          alt=""
        >
        <h1 class="home-brand">
          {{ SITE_NAME }}
        </h1>
        <p class="home-headline">
          {{ t.headline }}
        </p>
        <p class="home-lead">
          {{ t.lead }}
        </p>
        <div class="home-actions">
          <RouterLink
            :to="{ name: 'docs', params: { slug: 'quick-start' } }"
          >
            <MButton type="primary" :label="t.start" />
          </RouterLink>
          <RouterLink :to="{ name: 'components' }">
            <MButton :label="t.browse" />
          </RouterLink>
          <a
            :href="SITE_GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MButton :label="t.viewGithub" />
          </a>
        </div>
        <div class="home-meta" :aria-label="t.techTags">
          <span>Vue 3</span>
          <span>{{ t.homeMetaComponents }}</span>
          <span>TypeScript</span>
          <span>MIT</span>
        </div>
      </section>

      <section class="home-install" :aria-label="t.installTitle">
        <div class="home-install__head">
          <h2>{{ t.installTitle }}</h2>
          <p>{{ t.installHint }}</p>
        </div>
        <div class="home-install__cmd">
          <code>{{ SITE_INSTALL_CMD }}</code>
          <button
            class="home-install__copy"
            type="button"
            @click="copyInstall"
          >
            {{ copied ? t.copied : t.copy }}
          </button>
        </div>
        <a
          class="home-install__npm"
          :href="SITE_NPM_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t.viewNpm }}
        </a>
      </section>

      <section class="home-pillars" :aria-label="t.capabilities">
        <article
          v-for="item in pillars"
          :key="item.title"
          class="home-pillar"
        >
          <h2>{{ item.title }}</h2>
          <p>{{ item.body }}</p>
        </article>
      </section>

      <section
        class="home-theme-preview"
        :aria-label="t.homeThemePreviewTitle"
      >
        <div class="home-theme-preview__copy">
          <h2>{{ t.homeThemePreviewTitle }}</h2>
          <p>{{ t.homeThemePreviewBody }}</p>
        </div>
        <div class="home-theme-preview__controls">
          <div
            class="home-theme-preview__modes"
            role="group"
            :aria-label="t.themeMode"
          >
            <button
              type="button"
              class="home-chip"
              :class="{ 'is-active': !isDark }"
              @click="setTheme('light')"
            >
              {{ t.light }}
            </button>
            <button
              type="button"
              class="home-chip"
              :class="{ 'is-active': isDark }"
              @click="setTheme('dark')"
            >
              {{ t.dark }}
            </button>
          </div>
          <div
            class="home-theme-preview__accents"
            role="group"
            :aria-label="t.brandColor"
          >
            <button
              v-for="option in accentOptions"
              :key="option.name"
              type="button"
              class="home-swatch"
              :class="{
                'is-selected': previewAccent === option.name,
              }"
              :style="{ '--swatch-color': option.color }"
              :aria-label="
                interpolate(t.useAccent, {
                  label: option.label,
                })
              "
              @click="previewAccent = option.name"
            />
          </div>
        </div>
        <div class="home-theme-preview__stage">
          <MButton type="primary" :label="t.homeThemePreviewSample" />
          <MButton :label="t.homeThemePreviewSecondary" />
          <MInput
            v-model="previewInput"
            :placeholder="t.homeThemePreviewInput"
            style="max-width: 14rem"
          />
          <MTag :value="t.homeThemePreviewTag" />
        </div>
      </section>

      <section class="home-wall" :aria-label="t.homeWallTitle">
        <div class="home-wall__head">
          <h2>{{ t.homeWallTitle }}</h2>
          <p>{{ t.homeWallBody }}</p>
        </div>
        <div class="home-wall__grid">
          <RouterLink
            v-for="item in wallItems"
            :key="item.name"
            class="home-wall__card"
            :to="{
              name: 'component-doc',
              params: { component: item.name },
            }"
          >
            <strong>{{ item.name }}</strong>
            <span>{{ item.description ?? t.defaultDoc }}</span>
          </RouterLink>
        </div>
        <RouterLink
          class="home-text-link home-wall__more"
          :to="{ name: 'components' }"
        >
          {{ t.allComponents }} →
        </RouterLink>
      </section>

      <section class="home-cta">
        <div>
          <h2>{{ t.next }}</h2>
          <p>{{ t.nextBody }}</p>
        </div>
        <div class="home-cta__links">
          <RouterLink
            class="home-text-link"
            :to="{ name: 'theme-editor' }"
          >
            {{ t.themeEditor }}
          </RouterLink>
          <RouterLink
            class="home-text-link"
            :to="{ name: 'docs', params: { slug: 'design' } }"
          >
            {{ t.design }}
          </RouterLink>
          <RouterLink
            class="home-text-link"
            :to="{ name: 'docs', params: { slug: 'config' } }"
          >
            {{ t.globalConfig }}
          </RouterLink>
          <RouterLink
            class="home-text-link"
            :to="{ name: 'components' }"
          >
            {{ t.allComponents }}
          </RouterLink>
          <RouterLink
            class="home-text-link"
            :to="{ name: 'changelog' }"
          >
            {{ t.changelog }}
          </RouterLink>
        </div>
      </section>

      <SiteFooter />
    </div>
  </MScrollbar>
</template>

<style scoped>
.home-scroll {
    flex: 1;
    height: 100%;
    min-height: 0;
}

.home-page {
    margin: 0 auto;
    max-width: 68rem;
    padding: clamp(2.5rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) 3rem;
    width: 100%;
}

.home-hero {
    animation: home-rise 0.7s var(--m-motion-ease) both;
    max-width: 46rem;
    position: relative;
}

.home-logo {
    display: block;
    height: clamp(4rem, 10vw, 5.25rem);
    margin: 0 0 1.5rem;
    width: clamp(4rem, 10vw, 5.25rem);
}

.home-brand {
    background: linear-gradient(
        120deg,
        var(--m-color-text) 30%,
        var(--docs-glow) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-family: var(--docs-display);
    font-size: clamp(2.75rem, 7vw, 4.75rem);
    font-weight: 800;
    letter-spacing: -0.045em;
    line-height: 0.95;
    margin: 0 0 1rem;
    text-wrap: balance;
}

.home-headline {
    color: var(--m-color-text);
    font-family: var(--docs-display);
    font-size: clamp(1.2rem, 2.2vw, 1.55rem);
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.35;
    margin: 0 0 0.85rem;
    max-width: 36rem;
    text-wrap: balance;
}

.home-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem 1.1rem;
    margin-top: 1.6rem;
}

.home-meta span {
    align-items: center;
    color: var(--m-color-text-muted);
    display: inline-flex;
    font-family: var(--docs-mono);
    font-size: 0.72rem;
    font-weight: 500;
    gap: 0.4rem;
    letter-spacing: 0.02em;
}

.home-meta span::before {
    background: var(--m-color-primary);
    border-radius: 50%;
    content: '';
    height: 0.3rem;
    opacity: 0.7;
    width: 0.3rem;
}

.home-lead {
    color: var(--m-color-text-muted);
    font-size: 1.05rem;
    line-height: 1.65;
    margin: 0;
    max-width: var(--docs-measure);
}

.home-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
}

.home-actions a {
    text-decoration: none;
}

.home-install {
    animation: home-rise 0.75s var(--m-motion-ease) both;
    border-top: 1px solid var(--docs-edge);
    margin-top: clamp(2.75rem, 6vw, 3.75rem);
    padding: 1.5rem 0 0;
}

.home-install__head h2 {
    font-family: var(--docs-display);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 0.35rem;
}

.home-install__head p {
    color: var(--m-color-text-muted);
    font-size: 0.92rem;
    line-height: 1.55;
    margin: 0 0 1rem;
}

.home-install__cmd {
    align-items: center;
    background: var(--docs-surface-subtle);
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-md, 0.65rem);
    box-shadow: var(--docs-shadow-card);
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    padding: 0.85rem 0.85rem 0.85rem 1.05rem;
    position: relative;
}

/* Terminal dots, keeps the install box recognizable as a shell command */
.home-install__cmd::before {
    background: color-mix(in srgb, var(--m-color-danger, #ff4d4f) 65%, transparent);
    border-radius: 50%;
    box-shadow:
        0.95rem 0 0 color-mix(in srgb, var(--m-color-warning, #faad14) 65%, transparent),
        1.9rem 0 0 color-mix(in srgb, var(--m-color-success, #52c41a) 65%, transparent);
    content: '';
    flex: 0 0 auto;
    height: 0.55rem;
    margin-right: 2.05rem;
    opacity: 0.65;
    width: 0.55rem;
}

.home-install__cmd code {
    color: var(--m-color-text);
    flex: 1;
    font-family: var(--docs-mono);
    font-size: 0.84rem;
    min-width: 0;
    overflow-x: auto;
    white-space: nowrap;
}

.home-install__copy {
    background: transparent;
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-sm, 0.45rem);
    color: var(--m-color-text-muted);
    cursor: pointer;
    font-family: var(--docs-mono);
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.35rem 0.65rem;
    transition:
        border-color var(--m-motion-fast) var(--m-motion-ease),
        color var(--m-motion-fast) var(--m-motion-ease);
}

.home-install__copy:hover {
    border-color: color-mix(
        in srgb,
        var(--m-color-primary) 40%,
        var(--docs-edge)
    );
    color: var(--m-color-primary);
}

.home-install__npm {
    color: var(--m-color-primary);
    display: inline-block;
    font-size: 0.84rem;
    font-weight: 600;
    margin-top: 0.85rem;
    text-decoration: none;
}

.home-install__npm:hover {
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

.home-pillars {
    display: grid;
    gap: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: clamp(2rem, 5vw, 3rem);
    border-top: 1px solid var(--docs-edge);
}

.home-pillar {
    animation: home-rise 0.8s var(--m-motion-ease) both;
    border-bottom: 1px solid var(--docs-edge);
    padding: 1.5rem 1.25rem 1.5rem 0;
}

.home-pillar:nth-child(even) {
    padding-left: 1.25rem;
    padding-right: 0;
    border-left: 1px solid var(--docs-edge);
}

.home-pillar:nth-child(2) {
    animation-delay: 0.05s;
}

.home-pillar:nth-child(3) {
    animation-delay: 0.1s;
}

.home-pillar:nth-child(4) {
    animation-delay: 0.15s;
}

.home-pillar h2 {
    font-family: var(--docs-display);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 0.55rem;
}

.home-pillar p {
    color: var(--m-color-text-muted);
    font-size: 0.92rem;
    line-height: 1.6;
    margin: 0;
    max-width: 34rem;
}

.home-theme-preview {
    border-top: 1px solid var(--docs-edge);
    margin-top: clamp(2rem, 5vw, 3rem);
    padding-top: 1.75rem;
}

.home-theme-preview__copy h2,
.home-wall__head h2 {
    font-family: var(--docs-display);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 0.45rem;
}

.home-theme-preview__copy p,
.home-wall__head p {
    color: var(--m-color-text-muted);
    font-size: 0.92rem;
    line-height: 1.55;
    margin: 0 0 1.15rem;
    max-width: 40rem;
}

.home-theme-preview__controls {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem 1.25rem;
    margin-bottom: 1rem;
}

.home-theme-preview__modes,
.home-theme-preview__accents {
    align-items: center;
    display: flex;
    gap: 0.45rem;
}

.home-chip {
    background: color-mix(in srgb, var(--m-color-border) 35%, transparent);
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--m-color-text-muted);
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
}

.home-chip.is-active {
    background: color-mix(in srgb, var(--m-color-primary) 12%, transparent);
    border-color: color-mix(in srgb, var(--m-color-primary) 35%, transparent);
    color: var(--m-color-primary);
}

.home-swatch {
    background: var(--swatch-color);
    border: 2px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    height: 1.15rem;
    width: 1.15rem;
}

.home-swatch.is-selected {
    border-color: var(--m-color-text);
    box-shadow: 0 0 0 2px var(--m-color-surface);
}

.home-theme-preview__stage {
    align-items: center;
    background-color: var(--docs-surface-subtle);
    background-image: radial-gradient(
        circle,
        color-mix(in srgb, var(--m-color-text) 8%, transparent) 1px,
        transparent 1px
    );
    background-position: center;
    background-size: 14px 14px;
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-md, 0.65rem);
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--m-color-surface) 60%, transparent);
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1.25rem 1rem;
}

.home-wall {
    border-top: 1px solid var(--docs-edge);
    margin-top: clamp(2rem, 5vw, 3rem);
    padding-top: 1.75rem;
}

.home-wall__grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.home-wall__card {
    animation: home-rise 0.6s var(--m-motion-ease) both;
    background: var(--docs-surface-subtle);
    border: 1px solid var(--docs-edge);
    border-radius: var(--m-radius-md, 0.65rem);
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-height: 6.5rem;
    padding: 0.95rem 1rem;
    position: relative;
    text-decoration: none;
    transition:
        border-color var(--m-motion-fast) var(--m-motion-ease),
        box-shadow var(--m-motion-fast) var(--m-motion-ease),
        transform var(--m-motion-fast) var(--m-motion-ease);
}

.home-wall__card:nth-child(2) { animation-delay: 0.04s; }
.home-wall__card:nth-child(3) { animation-delay: 0.08s; }
.home-wall__card:nth-child(4) { animation-delay: 0.12s; }
.home-wall__card:nth-child(5) { animation-delay: 0.16s; }
.home-wall__card:nth-child(6) { animation-delay: 0.2s; }
.home-wall__card:nth-child(7) { animation-delay: 0.24s; }
.home-wall__card:nth-child(8) { animation-delay: 0.28s; }

.home-wall__card:hover {
    border-color: var(--docs-primary-edge);
    box-shadow: var(--docs-shadow-card-hover);
    transform: translateY(-2px);
}

.home-wall__card strong {
    font-family: var(--docs-display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    transition: color var(--m-motion-fast) var(--m-motion-ease);
}

.home-wall__card:hover strong {
    color: var(--m-color-primary);
}

.home-wall__card span {
    color: var(--m-color-text-muted);
    font-size: 0.78rem;
    line-height: 1.45;
}

/* Arrow affordance appears on hover, matching the "→" of the text links */
.home-wall__card::after {
    bottom: 0.8rem;
    color: var(--m-color-primary);
    content: '→';
    font-family: var(--docs-display);
    font-size: 0.85rem;
    opacity: 0;
    position: absolute;
    right: 0.9rem;
    transform: translateX(-0.3rem);
    transition:
        opacity var(--m-motion-fast) var(--m-motion-ease),
        transform var(--m-motion-fast) var(--m-motion-ease);
}

.home-wall__card:hover::after {
    opacity: 1;
    transform: translateX(0);
}

.home-wall__more {
    display: inline-flex;
    margin-top: 1rem;
}

.home-cta {
    align-items: end;
    border-top: 1px solid var(--docs-edge);
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 2rem;
    padding-bottom: 0.5rem;
}

.home-cta h2 {
    font-family: var(--docs-display);
    font-size: 1.65rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 0.45rem;
}

.home-cta p {
    color: var(--m-color-text-muted);
    margin: 0;
}

.home-cta__links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
}

.home-text-link {
    color: var(--m-color-primary);
    font-family: var(--docs-display);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
}

.home-text-link:hover {
    text-decoration: underline;
}

@keyframes home-rise {
    from {
        opacity: 0;
        transform: translateY(0.8rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    html:not([data-m-ignore-reduced-motion]) .home-hero,
    html:not([data-m-ignore-reduced-motion]) .home-install,
    html:not([data-m-ignore-reduced-motion]) .home-pillar,
    html:not([data-m-ignore-reduced-motion]) .home-wall__card {
        animation: none;
    }
}

@media (max-width: 900px) {
    .home-pillars {
        grid-template-columns: 1fr;
    }

    .home-pillar:nth-child(even) {
        border-left: 0;
        padding-left: 0;
        padding-right: 0;
    }

    .home-wall__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 560px) {
    .home-wall__grid {
        grid-template-columns: 1fr;
    }
}
</style>
