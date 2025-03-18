<script setup lang='ts'>
const { playerCollapsed, current, currentTime, duration, playing, pause, resume } = usePlayer()
function handleCollapse() {
  playerCollapsed.value = false
}

const imgRef = ref<HTMLImageElement>()
function onLoad() {
  // console.log(imgRef.value)
}
function handlePlay() {
  if (playing.value) {
    pause()
  }
  else {
    resume()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="playerCollapsed" class="fixed-full z-999 flex-col items-center bg-white p-[20px]">
        <div class="absolute-lt p-[20px]">
          <div class="h-[20px] w-[20px] flex cursor-pointer items-center justify-center" @click="handleCollapse">
            <i class="i-iconamoon-arrow-down-2 text-[20px]" />
          </div>
        </div>
        <div class="m-t-[60px] h-[300px] w-[300px] overflow-hidden rounded-[20px] bg-white shadow-2xl shadow-black/5">
          <img ref="imgRef" v-array-buffer-src="current?.tag.picture?.data" class="wh-full object-cover" :alt="current?.tag.title" @load="onLoad">
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
        <div class="w-full flex">
          {{ currentTime }}-{{ duration }}
        </div>
        <div class="w-full flex items-center justify-center gap-[15px]">
          <PlayerControllerButton name="prev" />
          <PlayerControllerButton :name="playing ? 'pause' : 'play'" :size="50" @click="handlePlay" />
          <PlayerControllerButton name="next" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang='less'>

</style>
