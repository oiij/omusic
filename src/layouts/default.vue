<script setup lang="ts">
const { togglePlayerCollapsed } = useAppStore()
</script>

<template>
  <div class="wh-full flex-col">
    <div class="fixed-lb w-full flex items-center justify-center p-[20px]">
      <div class="h-[60px] w-[60px] cursor-pointer rounded-full bg-white" @click="togglePlayerCollapsed">
        <img src="" alt="">
      </div>
    </div>
    <main>
      <RouterEntry />
    </main>
    <Player />
  </div>
</template>

<style scoped lang="less"></style>
