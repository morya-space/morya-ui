---
name: vue3-component-design
description: Vue3 + TypeScript 组件库的组件设计规范。涵盖 Composition API、Props/Emits 类型定义、v-model、Slots、样式隔离和可访问性。适用于任何 Vue3 组件库项目。
---

# Vue3 Component Design

This skill defines standards for designing Vue 3 components with TypeScript in a reusable component library.

## Tech Stack

- Vue 3.4+ with `<script setup>` and Composition API
- TypeScript strict mode
- `<script setup lang="ts">` for all components

## File Structure

```
packages/
├── components/
│   ├── Button/
│   │   ├── Button.vue
│   │   ├── Button.ts
│   │   └── index.ts
│   └── Input/
│       ├── Input.vue
│       ├── Input.ts
│       └── index.ts
└── index.ts
```

### Barrel Export

```typescript
// components/Button/index.ts
export { default as YcButton } from './Button.vue'
export type { ButtonProps, ButtonEmits } from './Button'
```

## Component Template

```vue
<script setup lang="ts">
// 1. Define props with TypeScript interface
interface Props {
  /** Button label text */
  label: string
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Disabled state */
  disabled?: boolean
  /** Click handler */
  onClick?: () => void
}

// 2. Define emits with typed signature
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'update:modelValue', value: string): void
}>()

// 3. Resolve props with defaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})

// 4. Logic
const handleClick = () => {
  if (props.disabled) return
  emit('click')
  props.onClick?.()
}
</script>

<template>
  <button
    :class="[
      'yc-button',
      `yc-button--${variant}`,
      { 'yc-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
```

## Rules

### Props and Emits

- MUST define explicit `Props` interface with JSDoc comments
- MUST define explicit `Emits` type
- MUST use `withDefaults(defineProps<Props>(), { ... })` for optional props
- MUST NOT use `this` in setup
- MUST NOT emit events without declaring them in `defineEmits`
- SHOULD prefer `defineProps` over `props` option

### v-model Support

```vue
<script setup lang="ts">
interface Props {
  modelValue?: string
}
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const props = withDefaults(defineProps<Props>(), { modelValue: '' })
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

- MUST use `modelValue` prop and `update:modelValue` event for single v-model
- MUST support `v-model:arg` for multiple v-model bindings when needed
- SHOULD forward `v-model` to native input elements when wrapping them

### Slots

- MUST use `<slot>` with fallback content when appropriate
- SHOULD use named slots for complex layouts
- SHOULD type-check slot content with `defineSlots` when using Vue 3.3+
- MUST NOT rely on slot content existence without fallback

### Styling

- MUST use BEM-like class naming with library prefix (e.g., `yc-button--primary`)
- MUST scope all styles to the component root
- SHOULD use CSS custom properties for theming
- MUST NOT leak styles to sibling components
- SHOULD support `inheritAttrs: false` when using attrs manually

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>

<template>
  <button v-bind="attrs">
    <slot />
  </button>
</template>
```

### Accessibility

- MUST include semantic HTML elements (button, input, nav, etc.)
- MUST add `aria-label` to icon-only buttons
- MUST associate labels with inputs via `for`/`id` or `aria-labelledby`
- MUST ensure visible focus indicators are not removed
- SHOULD use native elements over ARIA roles when possible

## Composition Patterns

### Reusable Composables

```typescript
// composables/useFocusWithin.ts
export function useFocusWithin(initial = false) {
  const isFocused = ref(initial)
  const container = ref<HTMLElement | null>(null)

  onMounted(() => {
    const el = container.value
    if (!el) return
    const onFocusIn = () => (isFocused.value = true)
    const onFocusOut = () => (isFocused.value = false)
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)
    onUnmounted(() => {
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
    })
  })

  return { container, isFocused }
}
```

### Component Composition

```vue
<script setup lang="ts">
import YcButton from '../Button/Button.vue'
import YcIcon from '../Icon/Icon.vue'
</script>

<template>
  <YcButton variant="primary">
    <YcIcon name="check" />
    <span>Confirm</span>
  </YcButton>
</template>
```

- SHOULD compose smaller primitives into compound components
- MUST forward refs when wrapping native elements
- MUST NOT mutate props directly
- SHOULD use `toRefs` when passing reactive objects to child components

## Checklist

When designing a component:
- [ ] Component uses `<script setup lang="ts">`
- [ ] Props interface is explicitly typed with JSDoc
- [ ] Emits are explicitly typed
- [ ] Optional props use `withDefaults`
- [ ] Component supports v-model when appropriate
- [ ] Styles are scoped and use library prefix
- [ ] Slots have sensible fallback content
- [ ] Accessible by keyboard with visible focus
- [ ] Export barrel file (`index.ts`) is present
- [ ] No direct prop mutation
