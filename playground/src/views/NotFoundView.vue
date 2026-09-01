<script setup lang="ts">
import { WiButton, WiScrollbar } from '@well-insight/ui'
import { RouterLink } from 'vue-router'
import { useDocsI18n } from '../i18n'

const { t } = useDocsI18n()
</script>

<template>
  <WiScrollbar class="not-found-scroll">
    <section class="not-found">
      <p class="not-found__code" aria-hidden="true">
        404
      </p>
      <h1>{{ t.notFoundTitle }}</h1>
      <p>{{ t.notFoundBody }}</p>
      <div class="not-found__actions">
        <RouterLink :to="{ name: 'home' }">
          <WiButton :label="t.notFoundHome" />
        </RouterLink>
        <RouterLink :to="{ name: 'components' }">
          <WiButton :label="t.browse" outlined />
        </RouterLink>
      </div>
    </section>
  </WiScrollbar>
</template>

<style scoped>
.not-found-scroll {
  flex: 1;
  min-height: 0;
}

.not-found {
  margin: 0 auto;
  max-width: 36rem;
  padding: clamp(3rem, 10vw, 6rem) 1.5rem;
  text-align: center;
}

.not-found__code {
  color: var(--wi-color-primary);
  font-family: var(--docs-display);
  font-size: clamp(3rem, 12vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 1;
  margin: 0 0 1rem;
  opacity: 0.35;
}

.not-found h1 {
  font-family: var(--docs-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 0.75rem;
}

.not-found p {
  color: var(--wi-color-text-muted);
  line-height: 1.6;
  margin: 0 auto 1.5rem;
  max-width: 28rem;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
</style>
