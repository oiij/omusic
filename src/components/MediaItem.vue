<script setup lang='ts'>
import type { MediaLibrary } from '~/composables/useMediaLibrary'

const { data, playing, added } = defineProps<{
  data: MediaLibrary
  playing?: boolean
  added?: boolean
}>()
const emit = defineEmits<{
  (e: 'play', ev: MouseEvent): void
  (e: 'pause', ev: MouseEvent): void
  (e: 'add', ev: MouseEvent): void
  (e: 'remove', ev: MouseEvent): void
}>()
</script>

<template>
  <div class="w-full flex-y-center gap-[10px] rounded-[10px] bg-transparent p-[5px] transition-base hover:bg-black/5">
    <div class="h-[48px] w-[48px] flex items-center justify-center overflow-hidden rounded-[10px] bg-white/50">
      <img v-array-buffer-src="data.tag.picture?.data" class="wh-full object-cover">
    </div>
    <div class="min-w-0 flex-col flex-1">
      <div class="truncate text-[16px]">
        {{ data.tag.title }}
      </div>
      <div class="flex-y-center gap-[3px] truncate text-[12px] text-gray-5">
        <span>{{ data.tag.album }}</span>
        <span>-</span>
        <div>
          <span v-for="(item, index) in data.tag.artists" :key="index">{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="flex-y-center">
      <NButton quaternary circle size="small" @click="(e) => playing ? emit('pause', e) : emit('play', e)">
        <template #icon>
          <Transition name="fade">
            <i v-if="playing" class="i-iconamoon-player-pause-fill" />
            <i v-else class="i-iconamoon-player-play-fill" />
          </Transition>
        </template>
      </NButton>
      <NButton quaternary circle size="small" :disabled="added" @click="(e) => emit('add', e)">
        <template #icon>
          <i class="i-iconamoon-sign-plus-circle-bold" />
        </template>
      </NButton>
      <NButton quaternary circle size="small" @click="(e) => emit('remove', e)">
        <template #icon>
          <i class="i-iconamoon-trash" />
        </template>
      </NButton>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
