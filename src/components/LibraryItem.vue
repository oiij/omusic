<script setup lang='ts'>
import { readFile } from '@tauri-apps/plugin-fs'
import { parseBuffer } from 'music-metadata'

import {Library} from '~/composables/useLibrary'
const {data} = defineProps<{
  data:Library
}>();
const objectUrl = ref()
async function loadImage(){
  if(objectUrl.value){
    URL.revokeObjectURL(objectUrl.value)
    return 
  }
  const unit8Array = await readFile(data.path)
  const tagRaw = await parseBuffer(unit8Array)
  const picture = tagRaw.common.picture
  if(!picture || picture.length === 0){
    return
  }
  const blob = new Blob([new Uint8Array(picture[0].data)],{type:picture[0].format})
  objectUrl.value = URL.createObjectURL(blob)
  const image = new Image()
  image.src = objectUrl.value
  image.onload = ()=>{
   URL.revokeObjectURL(objectUrl.value) 
  }
}
loadImage()
</script>

<template>
  <div class="w-full flex">
    <div class="w-[40px] h-[40px] rounded-[10px] overflow-hidden flex justify-center items-center">
      <img :src="objectUrl" />
    </div>
    <div class="flex-col">
      <div>{{data.tag.title}}</div>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>