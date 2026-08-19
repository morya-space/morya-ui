<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import type { MenuItem, MenuProps } from './types'

const props = withDefaults(defineProps<MenuProps>(), {
  popup: false,
  modelValue: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const config = useWdConfig()
const root = ref<HTMLElement | null>(null)
const teleportTarget = computed(() =>
  resolveOverlayTeleport(props.popup ? props : { teleport: false }, config.value.appendTo),
)
const teleported = computed(() => props.popup && isOverlayTeleported(props, config.value.appendTo))

function activate(item: MenuItem) {
  if (item.disabled || item.separator) return
  item.command?.()
  if (props.popup) emit('update:modelValue', false)
}

function onOutsideClick(event: MouseEvent) {
  if (!props.popup || !props.modelValue) return
  if (root.value && !root.value.contains(event.target as Node)) {
    emit('update:modelValue', false)
  }
}

watch(
  () => Boolean(props.modelValue && props.popup),
  (open) => {
    if (open) document.addEventListener('click', onOutsideClick)
    else document.removeEventListener('click', onOutsideClick)
  },
  { immediate: true },
)

onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick))
</script>

<template>
  <!-- Inline menu stays in place -->
  <div
    v-if="!popup"
    ref="root"
    class="wd-menu"
    role="menu"
  >
    <template v-for="(item, index) in model" :key="`${item.label ?? 'sep'}-${index}`">
      <div v-if="item.separator" class="wd-menu__separator" role="separator" />
      <button
        v-else
        type="button"
        class="wd-menu__item"
        role="menuitem"
        :disabled="item.disabled"
        @click="activate(item)"
      >
        {{ item.label }}
      </button>
    </template>
  </div>
  <Teleport v-else :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wd-scale-fade">
      <div
        v-if="modelValue"
        ref="root"
        class="wd-menu wd-menu--popup"
        :class="{ 'wd-menu--teleported': teleported }"
        role="menu"
      >
        <template v-for="(item, index) in model" :key="`${item.label ?? 'sep'}-${index}`">
          <div v-if="item.separator" class="wd-menu__separator" role="separator" />
          <button
            v-else
            type="button"
            class="wd-menu__item"
            role="menuitem"
            :disabled="item.disabled"
            @click="activate(item)"
          >
            {{ item.label }}
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>
