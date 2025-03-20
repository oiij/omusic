import type { MediaLibrary } from './useMediaLibrary'
import { useBoolean } from '@oiij/use'
import { readFile } from '@tauri-apps/plugin-fs'
import { useAudioContext } from './useAudioContext'

const { data: mediaLibrary, refresh } = useRequest(async () => {
  const { getAll } = await useMediaLibrary()
  return getAll()
})

async function handleAddMedia() {
  const { openFiles } = await useMediaLibrary()
  await openFiles()
  refresh()
}
async function handleAddDirectory() {
  const { openDirectory } = await useMediaLibrary()
  await openDirectory()
  refresh()
}
async function handleClearMedia() {
  const { clear } = await useMediaLibrary()
  await clear()
  refresh()
}
async function handleRemoveMedia(key: string) {
  const { removeMediaLibrary } = await useMediaLibrary()
  await removeMediaLibrary(key)
  refresh()
}

const { value: loading, setTrue: setLoading, setFalse: removeLoading } = useBoolean()
const { value: playerCollapsed, toggle: togglePlayerCollapsed } = useBoolean(false)

const { playBuffer, playing, play, pause, resume, onEnded, ...audioContext } = useAudioContext({ analyser: true })

const currentPath = ref()
const currentMedia = computed(() => mediaLibrary.value?.find(f => f.path === currentPath.value))
const currentPicture = computed(() => currentMedia.value?.tag.picture?.data)
const playMode = ref<'repeat' | 'repeat-one' | 'shuffle'>('repeat')
function handlePlayModeToggle() {
  const repeats = ['repeat', 'repeat-one', 'shuffle']
  const currentRepeat = repeats.indexOf(playMode.value)
  if (currentRepeat === 2) {
    playMode.value = 'repeat'
  }
  else {
    playMode.value = repeats[currentRepeat + 1] as typeof playMode.value
  }
}
async function handlePlay(media: MediaLibrary) {
  try {
    setLoading()
    currentPath.value = media.path
    const unit8Array = await readFile(media.path) as Uint8Array<ArrayBuffer>
    playBuffer(unit8Array)

    removeLoading()
  }
  catch (error) {
    console.warn(error)
  }
}
function handlePauseResume() {
  if (!mediaLibrary.value)
    return
  if (!currentPath.value) {
    handlePlay(mediaLibrary.value[0])
    return
  }
  if (playing.value) {
    pause()
  }
  else {
    resume()
  }
}
function handleNext() {
  if (!mediaLibrary.value)
    return
  const index = mediaLibrary.value.findIndex(f => f.path === currentPath.value)
  if (index === undefined)
    return
  if (playMode.value === 'shuffle') {
    const randomIndex = Math.floor(Math.random() * mediaLibrary.value.length)
    handlePlay(mediaLibrary.value[randomIndex])
    return
  }
  if (index === mediaLibrary.value.length - 1) {
    handlePlay(mediaLibrary.value[0])
    return
  }
  handlePlay(mediaLibrary.value[index + 1])
}
function handlePrev() {
  if (!mediaLibrary.value)
    return
  const index = mediaLibrary.value.findIndex(f => f.path === currentPath.value)
  if (index === undefined)
    return
  if (playMode.value === 'shuffle') {
    const randomIndex = Math.floor(Math.random() * mediaLibrary.value.length)
    handlePlay(mediaLibrary.value[randomIndex])
    return
  }
  if (index === 0) {
    handlePlay(mediaLibrary.value[mediaLibrary.value.length - 1])
    return
  }
  handlePlay(mediaLibrary.value[index - 1])
}
function autoNext() {
  if (!mediaLibrary.value)
    return
  const index = mediaLibrary.value.findIndex(f => f.path === currentPath.value)
  if (index === undefined)
    return
  if (playMode.value === 'repeat-one') {
    handlePlay(mediaLibrary.value[index])
    return
  }
  if (playMode.value === 'shuffle') {
    const randomIndex = Math.floor(Math.random() * mediaLibrary.value.length)
    handlePlay(mediaLibrary.value[randomIndex])
    return
  }
  if (index === mediaLibrary.value.length - 1) {
    handlePlay(mediaLibrary.value[0])
    return
  }
  handlePlay(mediaLibrary.value[index + 1])
}
onEnded(() => {
  autoNext()
})
export function usePlayer() {
  return {
    mediaLibrary,
    handleAddMedia,
    handleClearMedia,
    handleAddDirectory,
    handleRemoveMedia,
    loading,
    playerCollapsed,
    togglePlayerCollapsed,
    currentPath,
    currentMedia,
    currentPicture,
    playMode,
    playing,
    play,
    pause,
    resume,
    handlePlay,
    handlePlayModeToggle,
    handlePauseResume,
    ...audioContext,
    handleNext,
    handlePrev,
    autoNext,
  }
}
