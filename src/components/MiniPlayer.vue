<script setup lang='ts'>
const { togglePlayerCollapsed } = usePlayer()
</script>

<template>
  <div class="fixed-lb w-full flex items-center justify-center bg-white/60 p-x-[20px] p-y-[10px] backdrop-blur-xl">
    <div class="h-[50px] w-[50px] cursor-pointer rounded-full bg-white" @click="togglePlayerCollapsed">
      <img src="" alt="">
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
