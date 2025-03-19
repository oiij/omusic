import type { MediaLibrary } from './useMediaLibrary'
import { useBoolean } from '@oiij/use'
import { readFile } from '@tauri-apps/plugin-fs'
import { useAudioContext } from './useAudioContext'

const { value: loading, setTrue: setLoading, setFalse: removeLoading } = useBoolean()
const { value: playerCollapsed, toggle: togglePlayerCollapsed } = useBoolean(false)
const { playing, duration, currentTime, playBuffer, pause, resume, stop, onByteTimeDomainData, progress, setProgress, volume } = useAudioContext()
const playList = shallowRef<MediaLibrary[]>([])
const currentPath = ref()
const current = computed(() => playList.value.find(f => f.path === currentPath.value))
const playMode = ref<'repeat' | 'repeat-one' | 'shuffle'>('repeat')
onByteTimeDomainData((_array) => {

})
function add(media: MediaLibrary) {
  const index = playList.value.findIndex(item => item.path === media.path)
  if (index === -1) {
    playList.value.push(media)
  }
}
async function handlePlay(media: MediaLibrary) {
  try {
    setLoading()
    add(media)
    currentPath.value = media.path
    const unit8Array = await readFile(media.path) as Uint8Array<ArrayBuffer>
    playBuffer(unit8Array)

    removeLoading()
  }
  catch (error) {
    console.warn(error)
  }
}

export function usePlayer() {
  return {
    loading,
    playerCollapsed,
    togglePlayerCollapsed,
    playList,
    currentPath,
    current,
    handlePlay,
    duration,
    currentTime,
    playing,
    pause,
    resume,
    stop,
    progress,
    setProgress,
    volume,
    playMode,
  }
}
