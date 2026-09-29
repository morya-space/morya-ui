<script setup lang="ts">
import type { ListItemProps } from './types'
import { computed, inject, useSlots } from 'vue'
import { LIST_KEY } from './types'

defineOptions({ name: 'MListItem' })

const props = defineProps<ListItemProps>()
const slots = useSlots()
const ctx = inject(LIST_KEY, null)

const tag = computed(() => (ctx?.grid.value ? 'div' : 'li'))

const itemClass = computed(() => [
  'm-list-item',
  {
    'm-list-item--split': ctx?.split.value,
    'm-list-item--bordered': ctx?.bordered.value,
    'm-list-item--vertical': ctx?.itemLayout.value === 'vertical',
    'm-list-item--grid': Boolean(ctx?.grid.value),
  },
])

const showActions = computed(() => Boolean(slots.actions || (props.actions && props.actions.length)))
const showExtra = computed(() => Boolean(slots.extra || props.extra))
const verticalWithExtra = computed(
  () => ctx?.itemLayout.value === 'vertical' && showExtra.value,
)
</script>

<template>
  <component
    :is="tag"
    :class="itemClass"
  >
    <template v-if="verticalWithExtra">
      <div class="m-list-item__main">
        <slot />
        <ul
          v-if="showActions"
          class="m-list-item__actions"
        >
          <slot name="actions">
            <li
              v-for="(action, i) in actions"
              :key="i"
              class="m-list-item__action"
            >
              <template v-if="typeof action === 'string' || typeof action === 'number'">
                {{ action }}
              </template>
              <component
                v-else
                :is="action as object"
              />
            </li>
          </slot>
        </ul>
      </div>
      <div
        v-if="showExtra"
        class="m-list-item__extra"
      >
        <slot name="extra">
          {{ extra }}
        </slot>
      </div>
    </template>
    <template v-else>
      <div class="m-list-item__main">
        <slot />
      </div>
      <ul
        v-if="showActions"
        class="m-list-item__actions"
      >
        <slot name="actions">
          <li
            v-for="(action, i) in actions"
            :key="i"
            class="m-list-item__action"
          >
            <template v-if="typeof action === 'string' || typeof action === 'number'">
              {{ action }}
            </template>
            <component
              v-else
              :is="action as object"
            />
          </li>
        </slot>
      </ul>
      <div
        v-if="showExtra"
        class="m-list-item__extra"
      >
        <slot name="extra">
          {{ extra }}
        </slot>
      </div>
    </template>
  </component>
</template>
