<script setup lang='ts'>
import { usePlayer } from '~/composables/usePlayer'

definePage({
  meta: {
    layout: 'default',
    title: 'HOME',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-home',

  },
})

const { mediaLibrary, mediaLoading, handleAddMedia, handleAddDirectory, handleRemoveMedia, handleClearMedia, handlePlay } = usePlayer()
</script>

<template>
  <div class="wh-full flex-col gap-[10px] p-[20px]">
    <div class="w-full flex">
      <h1 class="text-[28px]">
        {{ $t('MEDIA.TITLE') }}
      </h1>
    </div>
    <div class="flex-y-center gap-[10px]">
      <NButton size="small" strong secondary @click="handleAddMedia">
        添加
      </NButton>
      <NButton size="small" strong secondary @click="handleAddDirectory">
        添加文件夹
      </NButton>
      <NButton size="small" strong secondary @click="handleClearMedia">
        清除
      </NButton>
      <NButton class="m-l-auto!" size="small" strong secondary @click="() => $router.push('/setting')">
        设置
      </NButton>
    </div>
    <div class="min-h-0 flex-1">
      <NSpin class="wh-full" content-class="wh-full" :show="mediaLoading">
        <NScrollbar>
          <div class="flex-col gap-[10px]">
            <div v-for="item in mediaLibrary" :key="item.path">
              <MediaItem :data="item" @play="() => handlePlay(item)" @remove="() => handleRemoveMedia(item.path)" />
            </div>
          </div>
        </NScrollbar>
      </NSpin>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
