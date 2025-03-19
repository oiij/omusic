<script setup lang='ts'>
const { playerCollapsed, current, currentTime, duration, playing, pause, resume, progress, setProgress, volume, playMode } = usePlayer()
function handleCollapse() {
  playerCollapsed.value = false
}
const picture = computed(() => current.value?.tag.picture?.data)
const imgRef = ref<HTMLImageElement>()
function onLoad() {
  // console.log(imgRef.value)
  // console.log('onLoad-1')
}
function handlePlay() {
  if (playing.value) {
    pause()
  }
  else {
    resume()
  }
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
function handleRepeatClick() {
  const repeats = ['repeat', 'repeat-one', 'shuffle']
  const currentRepeat = repeats.indexOf(playMode.value)
  if (currentRepeat === 2) {
    playMode.value = 'repeat'
  }
  else {
    playMode.value = repeats[currentRepeat + 1] as typeof playMode.value
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="playerCollapsed" class="fixed-full z-8 flex-col items-center gap-[10px] bg-white p-[20px]">
        <div class="absolute-lt p-[20px]">
          <div class="h-[20px] w-[20px] flex cursor-pointer items-center justify-center" @click="handleCollapse">
            <i class="i-iconamoon-arrow-down-2 text-[20px]" />
          </div>
        </div>
        <div class="m-t-[60px] h-[300px] w-[300px] overflow-hidden rounded-[20px] bg-white shadow-2xl shadow-black/5">
          <img ref="imgRef" v-array-buffer-src="picture" class="wh-full object-cover" @load="onLoad">
          <!-- <img src="https://images.unsplash.com/photo-1741173826628-199d13c4914a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8" @load="onLoad"> -->
        </div>
        <div class="h-[100px] w-full flex-col">
          l
        </div>
        <div class="m-t-auto w-full flex-col gap-[5px]">
          <div class="text-2xl">
            {{ current?.tag.title }}
          </div>
          <div class="flex-y-center gap-[3px] text-xl">
            <span v-for="(item, index) in current?.tag.artists" :key="index">{{ item }}</span>
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
          <PlayerControllerButton :name="playMode" @click="handleRepeatClick" />
          <PlayerControllerButton name="prev" />
          <PlayerControllerButton :name="playing ? 'pause' : 'play'" :size="50" @click="handlePlay" />
          <PlayerControllerButton name="next" />
          <n-popover trigger="click">
            <template #trigger>
              <PlayerControllerButton :name="volumeIconName" />
            </template>
            <div class="h-[90px] w-[20px] flex-x-center">
              <n-slider v-model:value="volume" vertical placement="top" />
            </div>
          </n-popover>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang='less'>

</style>
