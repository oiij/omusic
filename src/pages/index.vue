<script setup lang='ts'>
import { usePlayer } from '~/composables/usePlayer'

defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: 'HOME',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-home',

  },
})
useHead({
  title: '首页',
})
const { play } = usePlayer()
const { data, refresh } = useRequest(async () => {
  const { getAll } = await useMediaLibrary()
  return getAll()
})
async function handleAdd() {
  const { addMediaLibrary } = await useMediaLibrary()
  await addMediaLibrary()
  refresh()
}
async function handleClear() {
  const { clear } = await useMediaLibrary()
  await clear()
  refresh()
}
async function handleRemove(key: string) {
  const { removeMediaLibrary } = await useMediaLibrary()
  await removeMediaLibrary(key)
  refresh()
}
function handlePaly(data: MediaLibrary) {
  play(data)
}
</script>

<template>
  <div class="wh-full flex-col gap-[10px] p-[20px]">
    <div class="w-full flex">
      <h1 class="text-[28px]">
        {{ $t('MEDIA.TITLE') }}
      </h1>
    </div>
    <div class="flex-y-center gap-[10px]">
      <NButton @click="handleClear">
        清除
      </NButton>
      <NButton @click="handleAdd">
        添加
      </NButton>
    </div>
    <div class="min-h-0 flex-1">
      <NScrollbar>
        <div class="flex-col gap-[10px]">
          <div v-for="item in data" :key="item.path">
            <MediaItem :data="item" @play="() => handlePaly(item)" @remove="() => handleRemove(item.path)" />
          </div>
        </div>
      </NScrollbar>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
