<script setup lang='ts'>
const { size = 40, name = 'play' } = defineProps<{
  size?: number
  name?: keyof typeof icons
}>()
const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()
const icons = {
  'play': 'i-iconamoon-player-play-fill',
  'pause': 'i-iconamoon-player-pause-fill',
  'stop': 'i-iconamoon-player-stop-fill',
  'next': 'i-iconamoon-player-next-fill',
  'prev': 'i-iconamoon-player-previous-fill',
  'volume-up': 'i-iconamoon-volume-up-fill',
  'volume-down': 'i-iconamoon-volume-down-fill',
  'volume-off': 'i-iconamoon-volume-off-fill',
  'repeat': 'i-iconamoon-playlist-repeat-list-bold',
  'repeat-one': 'i-iconamoon-playlist-repeat-song-bold',
  'shuffle': 'i-iconamoon-playlist-shuffle-bold',
  'play-list': 'i-iconamoon-playlist-bold',
}
const fontSize = computed(() => {
  return size / 2
})
</script>

<template>
  <div class="flex cursor-pointer items-center justify-center border border-[2px] border-black/5 rounded-full transition-base hover:bg-black/10" :style="{ width: `${size}px`, height: `${size}px` }" @click="emit('click', $event)">
    <i :class="icons[name]" :style="{ fontSize: `${fontSize}px` }" />
  </div>
</template>

<style scoped lang='less'>

</style>
