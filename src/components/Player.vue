<script setup lang='ts'>
import { colord } from 'colord'
import ColorThief from 'colorthief'
import { useAudioVisualization } from '~/composables/useAudioVisualization'

const { playerCollapsed, currentMedia, currentPicture, currentTime, duration, progress, setProgress, playing, volume, playMode, handlePlayModeToggle, handlePauseResume, handleNext, handlePrev, onByteTimeDomainData } = usePlayer()
function handleCollapse() {
  playerCollapsed.value = false
}
const volumeIconName = computed(() => {
  if (volume.value === 0) {
    return 'volume-off'
  }
  if (volume.value < 50) {
    return 'volume-down'
  }
  return 'volume-up'
})
const bgGradient = ref('')
const imgRef = ref<HTMLImageElement>()
function onLoad() {
  if (imgRef.value) {
    const colorThief = new ColorThief()
    const color = `rgba(${(colorThief.getColor(imgRef.value, 1) as number[]).join(',')},1)`
    bgGradient.value = `linear-gradient(to bottom right, ${color},${colord(color).darken(0.2).toRgbString()})`
  }
}
const { domRef, update } = useAudioVisualization()

onByteTimeDomainData((data) => {
  update(data)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-bottom">
      <div v-if="playerCollapsed" class="fixed-full z-8 flex-col items-center gap-[10px] bg-white p-[20px]" :style="{ background: `${bgGradient}` }">
        <div class="absolute-lt p-[20px]">
          <div class="h-[20px] w-[20px] flex cursor-pointer items-center justify-center" @click="handleCollapse">
            <i class="i-iconamoon-arrow-down-2 text-[20px]" />
          </div>
        </div>
        <div class="m-t-[60px] h-[300px] w-[300px] flex items-center justify-center overflow-hidden rounded-[20px] bg-white shadow-2xl shadow-black/5">
          <img v-if="currentPicture" ref="imgRef" v-array-buffer-src="currentPicture" class="wh-full object-cover" @load="onLoad">
          <i v-else class="i-iconamoon-music-2-fill text-[40px] text-black/30" />
        </div>
        <div ref="domRef" class="h-[100px] w-full flex-col" />
        <div class="m-t-auto w-full flex-col gap-[5px]">
          <div class="text-2xl">
            {{ currentMedia?.tag.title }}
          </div>
          <div class="flex-y-center gap-[3px] text-xl">
            <span v-for="(item, index) in currentMedia?.tag.artists" :key="index">{{ item }}</span>
          </div>
        </div>
        <div class="w-full flex-y-center gap-[10px]">
          <div>{{ currentTime }}</div>
          <div class="min-w-0 flex-1">
            <ProgressBar :value="progress" @update:value="(val) => val && setProgress(val)" />
          </div>
          <div>{{ duration }}</div>
        </div>
        <div class="w-full flex items-center justify-center gap-[15px]">
          <PlayerControllerButton :name="playMode" @click="handlePlayModeToggle" />
          <PlayerControllerButton name="prev" @click="handlePrev" />
          <PlayerControllerButton :name="playing ? 'pause' : 'play'" :size="50" @click="handlePauseResume" />
          <PlayerControllerButton name="next" @click="handleNext" />
          <n-popover trigger="click" class="p-[5px]!">
            <template #trigger>
              <PlayerControllerButton :name="volumeIconName" />
            </template>
            <div class="h-[90px] w-[26px] flex-col-center">
              <div class="text-[12px]">
                {{ volume }}
              </div>
              <n-slider v-model:value="volume" vertical :tooltip="false" />
            </div>
          </n-popover>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang='less'>

</style>
