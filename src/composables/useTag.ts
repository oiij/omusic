import type { IAudioMetadata } from 'music-metadata'

import { useBoolean } from '@oiij/use'
import { readFile } from '@tauri-apps/plugin-fs'
import { parseBuffer } from 'music-metadata'

interface Options {
  manual?: boolean
}
export function useTag(path?: string, options?: Options) {
  const { manual = false } = options ?? {}
  const { value: loading, setTrue: setLoading, setFalse: removeLoading } = useBoolean()

  const tag = ref<IAudioMetadata>()
  const objectUrl = ref<string>()
  async function loadTag(_path: string) {
    try {
      setLoading()
      const unit8Array = await readFile(_path) as Uint8Array<ArrayBuffer>
      const tagRaw = await parseBuffer(unit8Array)
      tag.value = tagRaw
      const picture = tagRaw.common.picture

      if (!picture || picture.length === 0) {
        removeLoading()
        return {
          tag: tagRaw,
        }
      }
      const blob = new Blob([picture[0].data], { type: picture[0].format })
      const url = URL.createObjectURL(blob)
      objectUrl.value = url
      removeLoading()
      return {
        tag: tagRaw,
        objectUrl: url,
      }
    }
    catch (error) {
      console.warn(error)
    }
  }
  function revokeObjectURL() {
    if (objectUrl.value) {
      URL.revokeObjectURL(objectUrl.value)
    }
  }
  if (!manual && path) {
    loadTag(path)
  }
  return {
    loading,
    tag,
    objectUrl,
    loadTag,
    revokeObjectURL,
  }
}
