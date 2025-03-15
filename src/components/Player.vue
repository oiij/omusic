<script setup lang='ts'>
const { playerCollapsed } = storeToRefs(useAppStore())

function handleCollapse() {
  playerCollapsed.value = false
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
          <img src="" alt="">
        </div>
        <div class="h-[100px] w-full flex-col">
          l
        </div>
        <div class="m-t-auto w-full flex-col gap-[5px]">
          <div class="text-2xl">
            Fight width your past
          </div>
          <div class="text-xl">
            SEXANA GEVENXIO
          </div>
        </div>
        <div class="w-full flex">
          a
        </div>
        <div class="w-full flex items-center justify-center gap-[10px]">
          <PlayerControllerButton name="prev" />
          <PlayerControllerButton name="play" :size="50" />
          <PlayerControllerButton name="next" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang='less'>

</style>
