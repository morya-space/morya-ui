<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { WiCommandMenu } from '@well-insight/ui'
import { commandItems } from '@/config/navigation'

const open = defineModel<boolean>({ default: false })
const router = useRouter()

const items = computed(() =>
  commandItems.map((item) => ({
    label: item.label,
    icon: item.icon,
    command: () => {
      router.push(item.route)
      open.value = false
    },
  })),
)

function onKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <WiCommandMenu
    v-model="open"
    :model="items"
    placeholder="搜索菜单、学生、课程… (Ctrl+K)"
  />
</template>
