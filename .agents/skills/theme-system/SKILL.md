---
name: theme-system
description: 前端主题系统与设计令牌（Design Tokens）规范。涵盖颜色、间距、圆角、字体、阴影等设计变量管理、CSS 变量命名规范、亮色/暗色主题切换以及多主题配置方案。适用于任何基于 Vue3、React 或原生 Web 的项目。
---

# Theme System

This skill defines standards for managing design tokens and theme switching in frontend projects.

## Core Concepts

### Design Token Categories

Organize tokens by purpose, not by visual property.

```yaml
colors:
  brand: { primary, secondary, accent, success, warning, error }
  neutral: { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 }
  semantic: { background, foreground, muted, border, ring }

spacing:
  xs: 0.25rem   # 4px
  sm: 0.5rem    # 8px
  md: 1rem      # 16px
  lg: 1.5rem    # 24px
  xl: 2rem      # 32px
  xxl: 3rem     # 48px

typography:
  fontFamily: { sans, serif, mono }
  fontSize: { xs, sm, base, lg, xl, 2xl, 3xl, 4xl }
  fontWeight: { normal, medium, semibold, bold }
  lineHeight: { tight, normal, relaxed }

border:
  radius: { none, sm, md, lg, full }
  width: { default, sm, md }

shadow:
  sm, md, lg, xl

motion:
  duration: { fast, normal, slow }
  easing: { linear, easeIn, easeOut, easeInOut }
```

## CSS Variable Naming

Use a flat, semantic naming scheme.

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-muted: rgba(59, 130, 246, 0.1);

  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #64748b;
  --color-border: #e2e8f0;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

## Theme Variants

Define a light theme and a dark theme by overriding the same variables.

```css
/* Default (light) theme */
:root {
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #64748b;
  --color-border: #e2e8f0;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Dark theme */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-muted: #94a3b8;
  --color-border: #1e293b;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* High contrast theme */
[data-theme='high-contrast'] {
  --color-primary: #0000ff;
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-border: #000000;
}
```

## TypeScript Token Definitions

```typescript
// theme/tokens.ts
export interface ColorTokens {
  primary: string
  primaryHover: string
  primaryMuted: string
  background: string
  foreground: string
  muted: string
  border: string
  ring: string
}

export interface SpacingTokens {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
}

export interface RadiusTokens {
  none: number
  sm: number
  md: number
  lg: number
  full: number
}

export interface TypographyTokens {
  fontSans: string
  fontMono: string
  textXs: string
  textSm: string
  textBase: string
  textLg: string
  textXl: string
  text2Xl: string
}

export interface ShadowTokens {
  sm: string
  md: string
  lg: string
}

export interface MotionTokens {
  durationFast: string
  durationNormal: string
  durationSlow: string
  easeOut: string
}

export interface DesignTokens {
  colors: ColorTokens
  spacing: SpacingTokens
  radius: RadiusTokens
  typography: TypographyTokens
  shadow: ShadowTokens
  motion: MotionTokens
}

export const lightTheme: DesignTokens = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryMuted: 'rgba(59, 130, 246, 0.1)',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    ring: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    none: 0,
    sm: 0.25,
    md: 0.5,
    lg: 0.75,
    full: 9999,
  },
  typography: {
    fontSans: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    textXs: '0.75rem',
    textSm: '0.875rem',
    textBase: '1rem',
    textLg: '1.125rem',
    textXl: '1.25rem',
    text2Xl: '1.5rem',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  motion: {
    durationFast: '150ms',
    durationNormal: '250ms',
    durationSlow: '350ms',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },
}
```

## Theme Switcher

### Basic Theme Store (Pinia)

```typescript
// stores/theme.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { DesignTokens } from '../theme/tokens'
import { lightTheme, darkTheme } from '../theme/tokens'

type ThemeName = 'light' | 'dark' | 'high-contrast'

const themes: Record<ThemeName, DesignTokens> = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': lightTheme, // simplified
}

export const useThemeStore = defineStore('theme', () => {
  const themeName = ref<ThemeName>('light')
  const tokens = ref<DesignTokens>(lightTheme)

  watch(themeName, (name) => {
    tokens.value = themes[name]
    applyTheme(tokens.value)
  })

  function setTheme(name: ThemeName) {
    themeName.value = name
  }

  function toggleTheme() {
    setTheme(themeName.value === 'light' ? 'dark' : 'light')
  }

  return { themeName, tokens, setTheme, toggleTheme }
})

function applyTheme(tokens: DesignTokens) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', tokens.colors.primary)
  root.style.setProperty('--color-background', tokens.colors.background)
  root.style.setProperty('--color-foreground', tokens.colors.foreground)
  // ... set all tokens
}
```

### System Preference Detection

```typescript
function getSystemTheme(): ThemeName {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

// On app init
const saved = localStorage.getItem('theme') as ThemeName | null
const themeStore = useThemeStore()
themeStore.setTheme(saved ?? getSystemTheme())

// Listen for system changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    themeStore.setTheme(e.matches ? 'dark' : 'light')
  }
})
```

### Theme Switcher Component

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const themes = [
  { name: 'light', label: 'Light', icon: 'sun' },
  { name: 'dark', label: 'Dark', icon: 'moon' },
  { name: 'high-contrast', label: 'High Contrast', icon: 'contrast' },
] as const
</script>

<template>
  <div class="theme-switcher">
    <button
      v-for="t in themes"
      :key="t.name"
      :class="{ 'theme-switcher__active': themeStore.themeName === t.name }"
      @click="themeStore.setTheme(t.name)"
      :aria-label="`Switch to ${t.label} theme`"
    >
      <span class="theme-switcher__icon">{{ t.icon }}</span>
      {{ t.label }}
    </button>
  </div>
</template>
```

## Framework Integration

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
} satisfies Config
```

### UnoCSS Configuration

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      muted: 'var(--color-muted)',
      border: 'var(--color-border)',
    },
    borderRadius: {
      none: 'var(--radius-none)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      full: 'var(--radius-full)',
    },
  },
})
```

## Accessibility

### Contrast Requirements

- All text/background pairs must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have visible focus indicators using `--color-ring`
- Test all themes for contrast, not just the default

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }
}
```

## Multi-Tenant Theming

Allow different projects or users to define custom themes.

```typescript
export interface ProjectTheme {
  id: string
  name: string
  tokens: Partial<DesignTokens>
}

export async function loadProjectTheme(projectId: string): Promise<DesignTokens> {
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId))
  if (!project?.theme) return lightTheme

  return mergeTokens(lightTheme, project.theme)
}

function mergeTokens(base: DesignTokens, override: Partial<DesignTokens>): DesignTokens {
  return {
    colors: { ...base.colors, ...override.colors },
    spacing: { ...base.spacing, ...override.spacing },
    // ... merge other categories
  }
}
```

## Checklist

When designing a theme system:
- [ ] All design decisions are expressed as tokens, not magic values
- [ ] CSS variables follow a consistent naming convention
- [ ] Light and dark themes override the same token set
- [ ] Theme can be switched at runtime without page reload
- [ ] System preference is detected and respected by default
- [ ] User preference is persisted (localStorage or cookie)
- [ ] Tailwind/UnoCSS config maps to CSS variables
- [ ] All themes pass WCAG contrast checks
- [ ] Reduced motion preference is respected
- [ ] Multi-tenant theming merges safely with defaults
