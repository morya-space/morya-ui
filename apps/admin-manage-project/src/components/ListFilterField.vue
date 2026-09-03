<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})
</script>

<template>
  <div class="list-filter-field" :class="`list-filter-field--${size}`">
    <slot />
  </div>
</template>

<style scoped>
.list-filter-field {
  display: inline-flex;
  max-width: 100%;
}

.list-filter-field--sm {
  width: 8rem;
}

.list-filter-field--md {
  width: 12rem;
}

.list-filter-field--lg {
  width: 14rem;
}

.list-filter-field :deep(.wi-input),
.list-filter-field :deep(.wi-select),
.list-filter-field :deep(.wi-date-picker) {
  width: 100%;
}
</style>
