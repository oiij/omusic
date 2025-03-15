<script setup lang='ts'>
import { open } from '@tauri-apps/plugin-dialog'
import { readFile } from '@tauri-apps/plugin-fs'
import { parseBuffer } from 'music-metadata'
import { useLibrary } from '~/composables/useLibrary'
import { basename } from '@tauri-apps/api/path';
defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: 'HOME',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-home',

  },
})
useHead({
  title: '首页',
})
const {data,refresh} = useRequest(async()=>{
  const {getAll} = await useLibrary()
  return getAll()
})
async function handleAdd() {

  const paths = await open({
    multiple: true,
    filters: [
      {
        name: '音频文件',
        extensions: ['mp3'],
      },
    ],
  })

  if (!paths || paths.length === 0)
    return

  const {has,set} = await useLibrary()

  const widthFilter = await Promise.all(paths.map(async(m)=>{
    return {
      path: m,
      has: await has(m),
    }
  }))
  
  const widthUnit8Array = await Promise.all(widthFilter.filter(f=>!f.has).map(async (m) => {
    return {
      path:m.path,
      unit8Array: await readFile(m.path),
    }
  }))

  const widthTags = await Promise.all(widthUnit8Array.map(async (m) => {
    const tag = await parseBuffer(m.unit8Array)
    return {
      path:m.path,
      name:await basename(m.path),
      createAt:Date.now(),
      size: m.unit8Array.length,
      tag:{
        album:tag.common.album,
        albumartist:tag.common.albumartist,
        artist:tag.common.artist,
        artists:tag.common.artists,
        title:tag.common.title,
        year:tag.common.year,
      }
    }
  }))

  for (const item of widthTags) {
    await set(item.path,item)
  }
  
  refresh()

}
async function handleClear(){
  const {clear} = await useLibrary()
  await clear()
  refresh()
}

</script>

<template>
  <div class="wh-full flex-col gap-10 p-[20px]">
    <div class="w-full flex">
      <div class="m-l-auto">
        <NButton @click="handleClear">
          清除
        </NButton>
        <NButton @click="handleAdd">
          添加
        </NButton>
      </div>
    </div>
    <div class="flex-1 min-h-0">
      <NScrollbar>
        <div class="flex-col">
          <div  v-for="item in data" :key="item.path">
            <LibraryItem :data="item" />
          </div>
        </div>
      </NScrollbar>
      
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
