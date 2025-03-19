<script setup lang='ts'>
import { getCurrentWindow } from '@tauri-apps/api/window'

const isFullscreen = ref(false)
const window = getCurrentWindow()
async function onMinimize() {
  await window.minimize()
}
async function toggleFullScreen() {
  const isMaximized = await window.isMaximized()
  isFullscreen.value = !isMaximized
  await window.toggleMaximize()
}
async function onClose() {
  await window.hide()
}
onMounted(() => {
  window.isMaximized().then((res) => {
    isFullscreen.value = res
  })
})
</script>

<template>
  <div class="fixed-lt z-9 h-[22px] w-full flex">
    <div class="group wh-full flex items-center justify-center" data-tauri-drag-region>
      <div class="pointer-events-none h-[6px] w-[120px] rounded-full bg-transparent transition-base group-hover:bg-black/20" />
    </div>
    <div class="absolute-rt h-full flex-y-center">
      <slot name="actions">
        <n-button quaternary size="tiny" type="default" class="rounded-0!" @click="onMinimize">
          <template #icon>
            <i class="i-mage-minus" />
          </template>
        </n-button>
        <n-button quaternary size="tiny" type="default" class="rounded-0!" @click="toggleFullScreen">
          <template #icon>
            <i :class="isFullscreen ? 'i-mage-scale-down' : 'i-mage-scale-up'" />
          </template>
        </n-button>
        <n-button quaternary size="tiny" type="error" class="rounded-0!" @click="onClose">
          <template #icon>
            <i class="i-mage-multiply" />
          </template>
        </n-button>
      </slot>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
