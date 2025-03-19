<script setup lang='ts'>
const props = defineProps<{
  value?: number
}>()
const emit = defineEmits<{
  (e: 'update:value', value: typeof props.value): void
}>()
function handleClick(ev: MouseEvent) {
  const rect = (ev.target as HTMLElement).getBoundingClientRect()
  const x = ev.clientX - rect.left
  const value = (x / rect.width) * 100
  emit('update:value', value)
}
</script>

<template>
  <div class="relative">
    <div class="absolute left-0 left-0 top-[50%] h-[12px] w-[12px] translate-x-[-6px] translate-y-[-50%] rounded-full bg-red-5" :style="{ left: `${props.value}%` }" />
    <div class="h-[8px] w-full flex-y-center cursor-pointer overflow-hidden rounded-full bg-transparent p-x-[2px] transition-base hover:bg-black/10" @click="handleClick">
      <div class="pointer-events-none h-[4px] rounded-full bg-black/30 transition-base" :style="{ width: `${props.value}%` }" />
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
