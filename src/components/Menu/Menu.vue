<script setup lang="ts">
import type { MenuItem, MenuProps } from './types'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import MenuNodes from './MenuNodes.vue'

const props = withDefaults(defineProps<MenuProps>(), {
  popup: false,
  modelValue: false,
  selectedKey: null,
  collapsed: false,
  indent: 16,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:selectedKey', value: string | null): void
  (event: 'select', item: MenuItem): void
}>()

const config = useWiConfig()
const root = ref<HTMLElement | null>(null)
const teleportTarget = computed(() =>
  resolveOverlayTeleport(props.popup ? props : { teleport: false }, config.value.appendTo),
)
const teleported = computed(() => props.popup && isOverlayTeleported(props, config.value.appendTo))

function activate(item: MenuItem) {
  if (item.disabled || item.separator) return
  item.command?.()
  const key = item.key ?? item.label ?? null
  emit('update:selectedKey', key)
  emit('select', item)
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
  <div
    v-if="!popup"
    ref="root"
    class="wi-menu"
    :class="{ 'wi-menu--collapsed': collapsed }"
    role="menu"
  >
    <MenuNodes
      :items="model"
      :depth="0"
      :indent="indent"
      :collapsed="collapsed"
      :selected-key="selectedKey"
      @activate="activate"
    />
  </div>
  <Teleport v-else :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-scale-fade">
      <div
        v-if="modelValue"
        ref="root"
        class="wi-menu wi-menu--popup"
        :class="{ 'wi-menu--teleported': teleported, 'wi-menu--collapsed': collapsed }"
        role="menu"
      >
        <MenuNodes
          :items="model"
          :depth="0"
          :indent="indent"
          :collapsed="collapsed"
          :selected-key="selectedKey"
          @activate="activate"
        />
      </div>
    </Transition>
  </Teleport>
</template>
