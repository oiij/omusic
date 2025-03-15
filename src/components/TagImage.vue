<script setup lang='ts'>
import {IAudioMetadata} from 'music-metadata'

const props = defineProps<{
  tag?:IAudioMetadata
}>();

const objectUrl = computed(()=>{
  const picture = props.tag?.common?.picture
  if(!picture){
    return ''
  }
  const blob = new Blob([new Uint8Array(picture[0].data)],{type:picture[0].format})  
  return URL.createObjectURL(blob)
})
</script>

<template>
  <img :src="objectUrl">
</template>

<style scoped lang='less'>

</style>