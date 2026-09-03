<script setup lang="ts">
import { computed } from 'vue'
import { WiLayoutContent } from '@well-insight/ui'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  /** Max content width token — matches golden form page. */
  narrow?: boolean
}>(), {
  description: undefined,
  narrow: true,
})

const contentClass = computed(() => (props.narrow ? 'form-page form-page--narrow' : 'form-page'))
</script>

<template>
  <WiLayoutContent :content-class="contentClass">
    <header class="form-page__intro">
      <h1 class="form-page__title">{{ title }}</h1>
      <p v-if="description" class="form-page__desc">{{ description }}</p>
    </header>

    <div class="form-page__body">
      <slot />
    </div>

    <footer v-if="$slots.actions" class="form-page__actions">
      <slot name="actions" />
    </footer>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.form-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

:deep(.form-page--narrow) {
  max-width: 42rem;
}

.form-page__intro {
  margin-bottom: var(--wi-space-2);
}

.form-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
  color: var(--wi-color-text);
}

.form-page__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.form-page__body {
  padding: var(--wi-space-6);
  background: var(--wi-color-surface);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
  box-shadow: var(--wi-shadow-sm);
}

.form-page__actions {
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}
</style>
