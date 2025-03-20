<script setup lang='ts'>
const { togglePlayerCollapsed, currentPicture, playing } = usePlayer()
</script>

<template>
  <div class="fixed-lb h-[50px] w-full flex items-center justify-center rounded-t-[20px] bg-white backdrop-blur-xl drop-shadow-2xl">
    <div class="relative h-full w-[60px]">
      <div class="absolute left-0 top-[-20px] h-[60px] w-[60px] overflow-hidden rounded-full bg-white p-[5px]">
        <div class="wh-full flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black/10" @click="togglePlayerCollapsed">
          <img v-if="currentPicture" v-array-buffer-src="currentPicture" class="wh-full object-cover" :class="playing ? 'rotate' : ''">
          <i v-else class="i-iconamoon-music-2-fill text-[20px] text-black/30" :class="playing ? 'rotate' : ''" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.rotate {
  animation: rotate 10s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
