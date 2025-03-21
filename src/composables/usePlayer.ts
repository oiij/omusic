import type { MediaLibrary } from './useMediaLibrary'
import { useBoolean } from '@oiij/use'
import { readFile } from '@tauri-apps/plugin-fs'
import { useAudioContext } from './useAudioContext'

const { value: playerCollapsed, toggle: togglePlayerCollapsed } = useBoolean(false)
const { value: mediaLoading, setTrue: setMediaLoading, setFalse: removeMediaLoading } = useBoolean(false)
const { value: playLoading, setTrue: setLoading, setFalse: removeLoading } = useBoolean()
const { playBuffer, playing, play, pause, resume, onEnded, stop, ...audioContext } = useAudioContext({ analyser: true })

const mediaLibrary = ref<MediaLibrary[]>()
const currentPath = ref()
const currentMedia = computed(() => mediaLibrary.value?.find(f => f.path === currentPath.value))
const currentPicture = computed(() => currentMedia.value?.tag.picture?.data)
async function refresh() {
  setMediaLoading()
  const { getAll } = await useMediaLibrary()
  const result = await getAll()
  mediaLibrary.value = result
  removeMediaLoading()
  return result
}
refresh()
async function handleAddMedia() {
  setMediaLoading()
  const { openFiles } = await useMediaLibrary()
  await openFiles()
  await refresh()
  removeMediaLoading()
}
async function handleAddDirectory() {
  setMediaLoading()
  const { openDirectory } = await useMediaLibrary()
  await openDirectory()
  await refresh()
  removeMediaLoading()
}
async function handleClearMedia() {
  setMediaLoading()
  stop()
  const { clear } = await useMediaLibrary()
  await clear()
  await refresh()
  removeMediaLoading()
}
async function handleRemoveMedia(key: string) {
  setMediaLoading()
  if (currentPath.value === key) {
    stop()
  }
  const { removeMediaLibrary } = await useMediaLibrary()
  await removeMediaLibrary(key)
  await refresh()

  removeMediaLoading()
}
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
    stop()
    const unit8Array = await readFile(media.path) as Uint8Array<ArrayBuffer>
    currentPath.value = media.path
    await playBuffer(unit8Array)

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
    mediaLoading,
    handleAddMedia,
    handleClearMedia,
    handleAddDirectory,
    handleRemoveMedia,
    playLoading,
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
