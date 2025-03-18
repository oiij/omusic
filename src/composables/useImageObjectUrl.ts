import type { IPicture } from 'music-metadata'
import { useBoolean } from '@oiij/use'

export function useImageObjectUrl(picture?: IPicture) {
  const domRef = ref<HTMLImageElement>()
  const { value: loading, setTrue: setLoading, setFalse: removeLoading } = useBoolean()

  function load(_picture?: IPicture) {
    if (!domRef.value)
      return
    const __picture = _picture ?? picture

    if (!__picture)
      return

    setLoading()
    const blob = new Blob([__picture.data], { type: __picture.format })
    const url = URL.createObjectURL(blob)
    domRef.value.src = url
    domRef.value.onload = () => {
      URL.revokeObjectURL(url)
      removeLoading()
    }
  }
  onMounted(() => {
    load()
  })
  return {
    loading,
    domRef,
    load,
  }
}
